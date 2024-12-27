import { WebSocketServer } from 'ws';
import url from 'url';
import { GameManager } from './GameManager';
// import { User } from './SocketManager'     
import { extractAuthUser } from './auth';

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

wss.on('connection', function connection(ws, req) {
    // @ts-ignore

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzQ2YzFjOGIyMWRhMjdjNjc5ZDIxNjAiLCJuYW1lIjoiVXRzYXYiLCJpc0d1ZXN0Ijp0cnVlLCJpYXQiOjE3MzUyMDgwNjh9.xibNOhipOeZ6-Zxlx5ekitTAqkaB66bBJLdIPlGZmSI' //string = url.parse(req.url, true).query.token;
    // const cookies = req.headers.cookie;
    // console.log(cookies);
    // const token = cookies?.split('; ').find(cookie => cookie.startsWith('accesstoken='))?.split('=')[1] ?? '';
    console.log(token);

    const user = extractAuthUser(token, ws); // Here I am createing a user explicitly but it should be via login
    gameManager.addUser(user);

    ws.on("close", () => gameManager.removeUser(user));
});