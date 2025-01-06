import jwt from 'jsonwebtoken';
import { User } from '../SocketManager';
import { WebSocket } from 'ws';

const JWT_SECRET = 'utsav_shah';

export interface userJwtClaims {
    userId: string;
    name: string;
    isGuest?: boolean;
}

export const extractAuthUser = (token: string, ws: WebSocket): User => {
    const decoded = jwt.verify(token, JWT_SECRET) as userJwtClaims;
    console.log(decoded);
    console.log("extractAuth function completed");
    return new User(ws, decoded);
};