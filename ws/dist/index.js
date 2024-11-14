"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const SocketManager_1 = require("./SocketManager");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const gameManager = new GameManager_1.GameManager();
wss.on('connection', function connection(ws) {
    const user = new SocketManager_1.User(ws); // Here I am createing a user explicitly but it should be via login
    gameManager.addUser(user);
    ws.on("close", () => gameManager.removeUser(user));
});
