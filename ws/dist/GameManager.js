"use strict";
// Note:-
// need to update remover-user function it is not done yet
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
exports.GameManager = void 0;
const messages_1 = require("./messages");
const Game_1 = require("./Game");
const SocketManager_1 = require("./SocketManager");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingGame = null;
        this.users = [];
    }
    addUser(user) {
        this.users.push(user);
        this.addHandler(user);
    }
    removeUser(user) {
        this.users = this.users.filter(user => user !== user);
        // Stop Game because the user left
    }
    addHandler(user) {
        user.socket.on("message", (data) => __awaiter(this, void 0, void 0, function* () {
            const message = JSON.parse(data.toString());
            console.log("Parsed message:", message);
            if (!message.gameId) { // if there is no gameId in the message then create new game
                if (this.pendingGame) {
                    const game = this.games.find((x) => x.gameId === this.pendingGame);
                    if (!game) {
                        console.log('Pending game not found');
                        return;
                    }
                    if (user.userId === (game === null || game === void 0 ? void 0 : game.player1UserId)) {
                        SocketManager_1.socketManager.broadcast(game.gameId, JSON.stringify({
                            type: messages_1.GAME_ALERT,
                            payload: {
                                message: 'Trying to connect with yourself ?',
                            },
                        }));
                        return;
                    }
                    SocketManager_1.socketManager.addUser(user, game.gameId);
                    yield (game === null || game === void 0 ? void 0 : game.updateSecondPlayer(user.userId));
                    this.pendingGame = null;
                }
                else {
                    const game = new Game_1.Game(user.userId, null);
                    this.games.push(game);
                    this.pendingGame = game.gameId;
                    SocketManager_1.socketManager.addUser(user, game.gameId);
                    SocketManager_1.socketManager.broadcast(game.gameId, JSON.stringify({
                        type: messages_1.GAME_ADDED,
                        gameId: game.gameId,
                        message: "Wait for 2nd Player to join"
                    }));
                }
            }
            // if (this.pendingGame) {
            //     const game = this.games.find((x) => x.gameId === this.pendingGame);
            //     if (!game) {
            //         console.log('Pending game not found');
            //         return;
            //     }
            //     if (user.userId === game?.player1UserId) {
            //         socketManager.broadcast(
            //             game.gameId,
            //             JSON.stringify({
            //                 type: GAME_ALERT,
            //                 payload: {
            //                     message: 'Trying to connect with yourself ?',
            //                 },
            //             }),
            //         );
            //         return
            //     }
            //     socketManager.addUser(user, game.gameId)
            //     await game?.updateSecondPlayer(user.userId);
            //     this.pendingGame = null;
            // } else {
            //     const game = new Game(user.userId, null);
            //     this.games.push(game);
            //     this.pendingGame = game.gameId;
            //     socketManager.addUser(user, game.gameId)
            //     socketManager.broadcast(
            //         game.gameId,
            //         JSON.stringify({
            //             type: GAME_ADDED,
            //             gameId: game.gameId,
            //             message: "Wait for 2nd Player to join"
            //         }),
            //     );
            if (message.type === messages_1.MOVE) {
                console.log("Move detected");
                const gameId = message.gameId;
                console.log("move made in following game:", gameId);
                const game = this.games.find((game) => game.gameId === gameId);
                //const game = this.games.find(game => game.player1 === socket || game.player2 === socket) // old logic before GameID
                if (game) {
                    game.makeMove(user, message.payload.move);
                }
            }
        }));
    }
}
exports.GameManager = GameManager;
