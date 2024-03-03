// import { Socket } from "socket.io";
import {v4 as uuidV4} from "uuid";

let rooms = {};

export const RoomHandler = (socket) => {
    socket.on("create-room", () => {
        const roomId = uuidV4();
        rooms[roomId] = [];
        socket.emit("room-created", {roomId});
        console.log("user created a room.", roomId);
    });

    socket.on("join-room", ({id, peerId}) => {
        if (rooms[id]) {
            console.log("user joined a room.", id, peerId);
            if (!rooms[id].includes(peerId)) {
                rooms[id].push(peerId);
            }
            socket.join(id);
            // socket.on('ready',()=>{
            //     socket.to(id).emit("user-joined", {peerId});
            // })
            socket.to(id).emit("user-joined", {peerId});
            socket.emit("get-users", {
                id,
                participants: rooms[id],
            })
        }

        socket.on("disconnect", () => {
            console.log("user left the room", peerId);
            leaveRoom({id, peerId});
            socket.to(id).emit("user-disconnected", peerId);
        })
    });

    const leaveRoom = ({id, peerId}) => {
        if (rooms[id]) {
            rooms[id] = rooms[id].filter((id) => id != peerId);
        } 
    }
}