import { useContext } from "react";
import { RoomContext } from "../context/RoomContext";

export const CreateRoom = () => {
    const {ws } = useContext(RoomContext);
    const createRoom = () => {
        ws.emit("create-room");
    };
    return (
        <button onClick={createRoom}>Create a room</button>
    )
};