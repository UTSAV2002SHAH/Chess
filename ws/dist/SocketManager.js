"use strict";
// Note: 
// Guest User is always true here need to change
// New thing 
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketManager = exports.User = void 0;
const crypto_1 = require("crypto");
class User {
    constructor(socket) {
        this.socket = socket;
        // this.id = randomUUID();
        this.userId = (0, crypto_1.randomUUID)();
        this.isGuest = true;
    }
}
exports.User = User;
class SocketManager {
    constructor() {
        this.interestedSockets = new Map();
        this.userRoomMappping = new Map();
    }
    static getInstance() {
        if (SocketManager.instance) {
            return SocketManager.instance;
        }
        SocketManager.instance = new SocketManager();
        return SocketManager.instance;
    }
    addUser(user, roomId) {
        this.interestedSockets.set(roomId, [
            ...(this.interestedSockets.get(roomId) || []), // If there is no entry for the roomId, it defaults to an empty array ([]) and then adds the user to it.
            user,
        ]);
        this.userRoomMappping.set(user.userId, roomId);
    }
    removerUser(user) {
        var _a;
        const roomId = this.userRoomMappping.get(user.userId); // get roomId of user which we want to remove
        if (!roomId) {
            console.log("User Was Not In Any Room");
            return;
        }
        const room = this.interestedSockets.get(roomId) || []; // get all members of that room
        const remainingUsers = room.filter(u => u.userId !== user.userId); // remove the user and set all other member to that room again
        this.interestedSockets.set(roomId, remainingUsers);
        if (((_a = this.interestedSockets.get(roomId)) === null || _a === void 0 ? void 0 : _a.length) === 0) { // If the there is no user left in the room then remove the room
            this.interestedSockets.delete(roomId);
        }
        this.userRoomMappping.delete(user.userId); // delete it from Room-Mapping Ss that Empty Room does not stays in mapping dictionary
    }
    broadcast(roomId, message) {
        const users = this.interestedSockets.get(roomId);
        if (!users) {
            console.log("No user in given room");
        }
        else {
            users.forEach(user => {
                user.socket.send(message); // here user is object of User clsss
            }); // and user.socket is a property of object
        }
    }
}
exports.socketManager = SocketManager.getInstance();
