// Note:-
// need to update remover-user function it is not done yet

import { WebSocket } from "ws";
import { INIT_GAME, MOVE, GAME_ALERT, GAME_ADDED } from "./messages";
import { Game } from "./Game";

import { User, socketManager } from './SocketManager'
import { Square } from 'chess.js'

export class GameManager {

    private games: Game[];
    private pendingGame: string | null;
    private users: User[];

    constructor() {
        this.games = [];
        this.pendingGame = null;
        this.users = [];
    }

    addUser(user: User) {
        this.users.push(user);
        this.addHandler(user);
    }

    removeUser(user: User) {
        this.users = this.users.filter(user => user !== user);
        // Stop Game because the user left
    }

    private async addHandler(user: User) {
        user.socket.on("message", async (data) => {
            const message = JSON.parse(data.toString());
            console.log("Parsed message:", message);

            if (message.type === INIT_GAME) { // if there is no gameId in the message then create new game
                if (this.pendingGame) {
                    const game = this.games.find((x) => x.gameId === this.pendingGame);
                    if (!game) {
                        console.log('Pending game not found');
                        return;
                    }
                    // console.log(game);
                    if (user.userId === game?.player1UserId) {
                        socketManager.broadcast(
                            game.gameId,
                            JSON.stringify({
                                type: GAME_ALERT,
                                payload: {
                                    message: 'Trying to connect with yourself ?',
                                },
                            }),
                        );
                        return
                    }
                    socketManager.addUser(user, game.gameId)
                    await game?.updateSecondPlayer(user.userId);
                    this.pendingGame = null;
                }
                else {
                    const game = new Game(user.userId, null);
                    // console.log(game);
                    this.games.push(game);
                    this.pendingGame = game.gameId;
                    console.log("Game Created with Following ID:", game.gameId);
                    socketManager.addUser(user, game.gameId)
                    socketManager.broadcast(
                        game.gameId,
                        JSON.stringify({
                            type: GAME_ADDED,
                            gameId: game.gameId,
                            message: "Wait for 2nd Player to join"
                        }),
                    )
                }
            }

            if (message.type === MOVE) {
                console.log("Move detected")
                const gameId = message.gameId;
                console.log("move made in following game:", gameId);
                const game = this.games.find((game) => game.gameId === gameId);
                //const game = this.games.find(game => game.player1 === socket || game.player2 === socket) // old logic before GameID
                if (game) {
                    game.makeMove(user, message.payload.move);
                }
            }

            // if (message.type === "RESIGN") {

            // }

        })
    }
}