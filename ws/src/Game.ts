import { WebSocket } from "ws";
import { Chess, Move, Square } from 'chess.js';
import { INIT_GAME, GAME_OVER, MOVE, NOT_YOUR_PIECE, GAME_ADDED, NOT_YOUR_TURN, INVALID_MOVE } from "./messages";
import { randomUUID } from "crypto";
import { User, socketManager } from "./SocketManager"
import axios from "axios"

import GameModel from "./db/models/GameModel"
import MoveModel from "./db/models/MoveModel"

export function isPromoting(chess: Chess, from: Square, to: Square) {
    if (!from) {
        return false;
    }

    const piece = chess.get(from);

    if (piece?.type !== 'p') {
        return false;
    }

    if (piece.color !== chess.turn()) {
        return false;
    }

    if (!['1', '8'].some((it) => to.endsWith(it))) {
        return false;
    }

    return chess
        .moves({ square: from, verbose: true })
        .map((it) => it.to)
        .includes(to);
}

export class Game {

    public gameId: string;
    public player1UserId: string;
    public player2UserId: string | null;
    public board: Chess;
    private moves: string[];
    public DBgameId: string; //Additionally created for DB operations
    private DBmovesId: string | null; // Additionally created for DB operations
    private startTime: Date;
    private moveCount = 0;

    constructor(player1: string, player2: string | null, gameId?: string) {

        this.player1UserId = player1;
        this.player2UserId = player2;
        this.board = new Chess();
        this.gameId = gameId ?? randomUUID(); // This is not the ID that matches with DB but this ID matches with WebScoket RoomID
        this.moves = [];
        this.DBgameId = this.gameId; //Additionally created for DB operations
        this.DBmovesId = null; // Additionally created for DB operations
        this.startTime = new Date();
    }


    makeMove(user: User, move: Move) {
        console.log(move);

        // Get the piece at the 'from' square
        const piece = this.board.get(move.from as Square);
        console.log(piece);

        // Determine whose turn it is based on the game state
        const currentTurn = this.board.turn(); // 'w' for white, 'b' for black
        const playerTurn = (currentTurn === 'w') ? this.player1UserId : this.player2UserId; // White moves first

        // Check if the player making the move is the one whose turn it is
        if (user.userId !== playerTurn) {
            console.log("Not your turn");
            user.socket.send(JSON.stringify({
                type: NOT_YOUR_TURN,
                gameId: this.gameId,
                payload: "It's not your turn.",
                valid: false
            }));
            return;
        }

        // Check if the player is moving their own piece
        if ((currentTurn === 'w' && piece?.color !== 'w') || (currentTurn === 'b' && piece?.color !== 'b')) {
            console.log("You cannot move your opponent's piece");
            user.socket.send(JSON.stringify({
                type: NOT_YOUR_PIECE,
                gameId: this.gameId,
                payload: "You cannot move your opponent's piece.",
                valid: false
            }));
            return;
        }

        // Handle the move
        // let moveResult;
        try {
            const promotionMove = isPromoting(this.board, move.from, move.to);
            if (promotionMove) {
                this.board.move({
                    from: move.from,
                    to: move.to,
                    promotion: 'q', // Default to queen promotion for simplicity
                });
            } else {
                this.board.move(move);
            }
        } catch (error) {
            console.log(error);
            user.socket.send(JSON.stringify({
                type: INVALID_MOVE,
                gameId: this.gameId,
                payload: "Invalid move.",
                valid: false
            }));
            return;
        }

        // Check if the game is over
        if (this.board.isGameOver()) {
            const result = this.board.isDraw()
                ? 'DRAW'
                : (this.board.turn() === 'b' ? 'White_Wins' : 'Black_Wins')
            // const winner = currentTurn === 'w' ? "Black" : "White";

            socketManager.broadcast(
                this.gameId,
                JSON.stringify({
                    type: GAME_OVER,
                    gameId: this.gameId,
                    payload: {
                        result,
                        move,
                    }
                })
            );
            return;
        }

        // Broadcast the valid move to both players

        console.log("move is valid");
        socketManager.broadcast(
            this.gameId,
            JSON.stringify({
                type: MOVE,
                gameId: this.gameId,
                payload: move,
                valid: true,
            })
        );

        console.log(`Move made by ${currentTurn === 'w' ? "White" : "Black"}`);
    }


    async updateSecondPlayer(player2UserId: string) {
        this.player2UserId = player2UserId;

        const WhitePlayer = this.player1UserId;
        const BlackPlayer = this.player2UserId;

        // here i want the code for creating Game and move document in database
        try {
            await this.createGameInDB();
            await this.createMoveInDB();
        } catch (error) {
            console.log("Error While creating Game & Moves in DB:", error);
        }

        socketManager.broadcast(
            this.gameId,
            JSON.stringify({
                type: INIT_GAME,
                payload: {
                    gameId: this.gameId,
                    whitePlayer: {
                        id: this.player1UserId,
                        name: 'White',
                        isGuest: true,
                    },
                    blackPlayer: {
                        id: this.player2UserId,
                        name: 'Black',
                        isGuest: true,
                    },
                },
            }),
        );
    }

    async createGameInDB() {
        try {
            const newGame = new GameModel({
                players: {
                    white: this.player1UserId,
                    black: this.player2UserId,
                },
                status: "IN_PROGRESS",
                result: "ongoing",
                createdAt: this.startTime,// here we don't need to Initialize empty move array later  we will store _id from move collection
            });

            await newGame.save();
            console.log(newGame._id.toString());
            this.DBgameId = newGame._id.toString();

            console.log("✅ Game document created in MongoDB");
        } catch (error) {
            console.error("❌ Error creating game document:", error);
        }
    }

    async createMoveInDB() {
        try {
            const newMove = new MoveModel({
                gameId: this.DBgameId,
                moves: [],
                createdAt: new Date(),
            });

            await newMove.save();
            this.DBmovesId = newMove._id.toString();

            // Before we did not have ObjectID of moves document. So we are passing it now.
            await GameModel.findByIdAndUpdate(
                this.DBgameId,
                { $push: { moves: this.DBmovesId } }
            );

            console.log("The moves document ID is:", newMove._id.toString());
            console.log("✅ Move document created in MongoDB");
        } catch (error) {
            console.error("❌ Error creating move document:", error);
        }
    }

}