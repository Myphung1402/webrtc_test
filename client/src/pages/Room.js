import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext.js";
import { VideoPlayer } from "../components/VideoPlayer.js";

export const Room = () => {
    const {id} = useParams();
    const {ws, me, stream, peers} = useContext(RoomContext);
    useEffect(() => {
        if (me) {
            const peerId = me._id;
            ws.emit("join-room", {id, peerId});
        }
    }, [id, ws, me]);
    const p = Object.values(peers);
    console.log("peers:",Object.values(peers));
    return (
        <>
            Room Id: {id}
            <div>
                <VideoPlayer stream={stream}/>
                {console.log("user stream", stream)}
                {p.map(peer => {
                    console.log("peers stream:",peer.stream);
                    return (
                        <div>
                            <VideoPlayer stream={peer.stream}/>
                        </div>
                    );
                    
                })}
            </div>
        </>
        
    )
}