import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
import { User } from './SocketManager'

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
    const user = new User(ws);                    // Here I am createing a user explicitly but it should be via login
    gameManager.addUser(user);

    ws.on("close", () => gameManager.removeUser(user));
});