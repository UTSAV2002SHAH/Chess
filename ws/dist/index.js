"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const url_1 = __importDefault(require("url"));
const GameManager_1 = require("./GameManager");
// import { User } from './SocketManager'     
const auth_1 = require("./auth");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const gameManager = new GameManager_1.GameManager();
wss.on('connection', function connection(ws, req) {
    // @ts-ignore
    var _a;
    // Extract the token
    const queryParams = new URLSearchParams(url_1.default.parse(req.url).query);
    const token = (_a = queryParams.get('token')) !== null && _a !== void 0 ? _a : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzQ2YzFjOGIyMWRhMjdjNjc5ZDIxNjAiLCJuYW1lIjoiVXRzYXYiLCJpc0d1ZXN0Ijp0cnVlLCJpYXQiOjE3MzUyMDgwNjh9.xibNOhipOeZ6-Zxlx5ekitTAqkaB66bBJLdIPlGZmSI';
    console.log("Token in WS server file");
    console.log(token);
    const user = (0, auth_1.extractAuthUser)(token, ws); // Here I am createing a user explicitly but it should be via login
    gameManager.addUser(user);
    ws.on("close", () => gameManager.removeUser(user));
});
