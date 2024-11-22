// Note: 
// Guest User is always true here need to change
// New thing 

import { randomUUID } from 'crypto';
import { WebSocket } from 'ws';
import { userJwtClaims } from './auth';

export class User {
    public socket: WebSocket;
    public id: string;
    public userId: string;
    public name: string;
    public isGuest: boolean;

    constructor(socket: WebSocket, userJwtClaims: userJwtClaims) {
        this.socket = socket;
        this.id = randomUUID();
        this.userId = userJwtClaims.userId;
        this.name = userJwtClaims.name;
        this.isGuest = true;
    }
}


class SocketManager {
    private static instance: SocketManager;
    private interestedSockets: Map<string, User[]>;
    private userRoomMappping: Map<string, string>;

    private constructor() {
        this.interestedSockets = new Map<string, User[]>();
        this.userRoomMappping = new Map<string, string>();
    }

    static getInstance() {
        if (SocketManager.instance) {
            return SocketManager.instance;
        }

        SocketManager.instance = new SocketManager();
        return SocketManager.instance;
    }

    addUser(user: User, roomId: string) {
        this.interestedSockets.set(roomId, [               // If there is already an array of users, it spreads that array (using ...) and appends the new user to the list
            ...(this.interestedSockets.get(roomId) || []),   // If there is no entry for the roomId, it defaults to an empty array ([]) and then adds the user to it.
            user,
        ]);
        this.userRoomMappping.set(user.userId, roomId);
    }

    removerUser(user: User) {
        const roomId = this.userRoomMappping.get(user.userId);                 // get roomId of user which we want to remove
        if (!roomId) {
            console.log("User Was Not In Any Room");
            return;
        }

        const room = this.interestedSockets.get(roomId) || [];                    // get all members of that room
        const remainingUsers = room.filter(u => u.userId !== user.userId)        // remove the user and set all other member to that room again
        this.interestedSockets.set(
            roomId,
            remainingUsers
        );

        if (this.interestedSockets.get(roomId)?.length === 0) {                   // If the there is no user left in the room then remove the room
            this.interestedSockets.delete(roomId);
        }
        this.userRoomMappping.delete(user.userId);                              // delete it from Room-Mapping Ss that Empty Room does not stays in mapping dictionary
    }

    broadcast(roomId: string, message: string) {
        const users = this.interestedSockets.get(roomId);

        if (!users) {
            console.log("No user in given room");
        }
        else {
            users.forEach(user => {
                user.socket.send(message);  // here user is object of User clsss
            });                             // and user.socket is a property of object
        }
    }
}

export const socketManager = SocketManager.getInstance()