"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
exports.isPromoting = isPromoting;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
const crypto_1 = require("crypto");
const SocketManager_1 = require("./SocketManager");
function isPromoting(chess, from, to) {
    if (!from) {
        return false;
    }
    const piece = chess.get(from);
    if ((piece === null || piece === void 0 ? void 0 : piece.type) !== 'p') {
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
class Game {
    constructor(player1, player2, gameId) {
        this.moveCount = 0;
        this.player1UserId = player1;
        this.player2UserId = player2;
        this.board = new chess_js_1.Chess();
        this.gameId = gameId !== null && gameId !== void 0 ? gameId : (0, crypto_1.randomUUID)();
        //console.log(this.gameId);
        this.moves = [];
        this.startTime = new Date();
    }
    makeMove(user, move) {
        console.log(move);
        // Get the piece at the 'from' square
        const piece = this.board.get(move.from);
        console.log(piece);
        // Determine whose turn it is based on the game state
        const currentTurn = this.board.turn(); // 'w' for white, 'b' for black
        const playerTurn = (currentTurn === 'w') ? this.player1UserId : this.player2UserId; // White moves first
        // Check if the player making the move is the one whose turn it is
        if (user.userId !== playerTurn) {
            console.log("Not your turn");
            user.socket.send(JSON.stringify({
                type: messages_1.NOT_YOUR_TURN,
                gameId: this.gameId,
                payload: "It's not your turn.",
                valid: false
            }));
            return;
        }
        // Check if the player is moving their own piece
        if ((currentTurn === 'w' && (piece === null || piece === void 0 ? void 0 : piece.color) !== 'w') || (currentTurn === 'b' && (piece === null || piece === void 0 ? void 0 : piece.color) !== 'b')) {
            console.log("You cannot move your opponent's piece");
            user.socket.send(JSON.stringify({
                type: messages_1.NOT_YOUR_PIECE,
                gameId: this.gameId,
                payload: "You cannot move your opponent's piece.",
                valid: false
            }));
            return;
        }
        // Handle the move
        try {
            const promotionMove = isPromoting(this.board, move.from, move.to);
            if (promotionMove) {
                this.board.move({
                    from: move.from,
                    to: move.to,
                    promotion: 'q', // Default to queen promotion for simplicity
                });
            }
            else {
                this.board.move(move);
            }
        }
        catch (error) {
            console.log(error);
            user.socket.send(JSON.stringify({
                type: messages_1.INVALID_MOVE,
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
                : (this.board.turn() === 'b' ? 'White_Wins' : 'Black_Wins');
            // const winner = currentTurn === 'w' ? "Black" : "White";
            SocketManager_1.socketManager.broadcast(this.gameId, JSON.stringify({
                type: messages_1.GAME_OVER,
                gameId: this.gameId,
                payload: { result }
            }));
            return;
        }
        // Broadcast the valid move to both players
        console.log("move is valid");
        SocketManager_1.socketManager.broadcast(this.gameId, JSON.stringify({
            type: messages_1.MOVE,
            gameId: this.gameId,
            payload: move,
            valid: true,
        }));
        console.log(`Move made by ${currentTurn === 'w' ? "White" : "Black"}`);
    }
    updateSecondPlayer(player2UserId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.player2UserId = player2UserId;
            const WhitePlayer = this.player1UserId;
            const BlackPlayer = this.player2UserId;
            SocketManager_1.socketManager.broadcast(this.gameId, JSON.stringify({
                type: messages_1.INIT_GAME,
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
            }));
        });
    }
}
exports.Game = Game;
