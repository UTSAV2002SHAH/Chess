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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const url_1 = __importDefault(require("url"));
const GameManager_js_1 = require("./GameManager.js");
// import { User } from './SocketManager'     
const auth_1 = require("./auth");
const connectDB_1 = __importDefault(require("./db/connectDB"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const wss = new WebSocketServer({ port: 8080 });
// const gameManager = new GameManager();
// wss.on('connection', function connection(ws, req) {
//     // @ts-ignore
//     // Extract the token
//     const queryParams = new URLSearchParams(url.parse(req.url).query);
//     const token = queryParams.get('token') ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzQ2YzFjOGIyMWRhMjdjNjc5ZDIxNjAiLCJuYW1lIjoiVXRzYXYiLCJpc0d1ZXN0Ijp0cnVlLCJpYXQiOjE3MzUyMDgwNjh9.xibNOhipOeZ6-Zxlx5ekitTAqkaB66bBJLdIPlGZmSI';
//     console.log("Token in WS server file");
//     console.log(token);
//     const user = extractAuthUser(token, ws); // Here I am createing a user explicitly but it should be via login
//     gameManager.addUser(user);
//     ws.on("close", () => gameManager.removeUser(user));
// });
function startWebSocketServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, connectDB_1.default)(process.env.MONGO_URL); // Ensure MongoDB is connected before proceeding
            console.log("✅ WebSocket Server connected to MongoDB");
            const wss = new ws_1.WebSocketServer({ port: 8080 });
            console.log("🚀 WebSocket server is running on ws://localhost:8080");
            const gameManager = new GameManager_js_1.GameManager();
            wss.on('connection', function connection(ws, req) {
                // @ts-ignore
                var _a;
                // Extract the token
                const queryParams = new URLSearchParams(url_1.default.parse(req.url).query);
                const token = (_a = queryParams.get('token')) !== null && _a !== void 0 ? _a : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzQ2YzFjOGIyMWRhMjdjNjc5ZDIxNjAiLCJuYW1lIjoiVXRzYXYiLCJpc0d1ZXN0Ijp0cnVlLCJpYXQiOjE3MzUyMDgwNjh9.xibNOhipOeZ6-Zxlx5ekitTAqkaB66bBJLdIPlGZmSI';
                console.log("Token in WS server file");
                // console.log(token);
                const user = (0, auth_1.extractAuthUser)(token, ws); // Here I am creating a user explicitly, but it should be via login
                gameManager.addUser(user);
                ws.on("close", () => gameManager.removeUser(user));
            });
        }
        catch (error) {
            console.error("❌ Failed to connect to MongoDB:", error);
            // process.exit(1); // Exit process if DB connection fails
        }
    });
}
startWebSocketServer();
