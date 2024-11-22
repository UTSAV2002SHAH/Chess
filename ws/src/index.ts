import { WebSocketServer } from 'ws';
import url from 'url';
import { GameManager } from './GameManager';
// import { User } from './SocketManager'     
import { extractAuthUser } from './auth';

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

wss.on('connection', function connection(ws, req) {
    // @ts-ignore
    const token: string = url.parse(req.url, true).query.token;
    const user = extractAuthUser(token, ws); // Here I am createing a user explicitly but it should be via login
    gameManager.addUser(user);

    ws.on("close", () => gameManager.removeUser(user));
});