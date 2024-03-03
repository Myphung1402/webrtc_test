import { createContext, useEffect, useReducer, useState, useRef } from 'react';
import socketIOClient from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import Peer from 'peerjs'
import {v4 as uuidV4} from "uuid"
import { peersReducer } from './peerReducer';
import { addPeerAction } from './peerActions';

const WS = 'http://localhost:8080';

export const RoomContext = createContext(null);

const ws = socketIOClient(WS);

export const RoomProvider = ({children}) => {
    const navigate = useNavigate();
    const [me, setMe] = useState();
    const [stream, setStream] = useState();
    const [peers, dispatch] = useReducer(peersReducer, {});

    const enterRoom = ({roomId}) => {
        console.log(roomId);
        navigate(`/room/${roomId}`);
    }

    const getUsers = ({participants}) => {
        console.log({participants});
    }

    useEffect(() => {
        const meId = uuidV4();
        const peer = new Peer(meId);
        setMe(peer);
        
        try {
            navigator.mediaDevices.getUserMedia({video: true, audio: true})
                .then((stream) =>{
                    setStream(stream);
                });
        } catch (error) {
            console.log(error);
        }

        ws.on("room-created", enterRoom);
        ws.on("get-users", getUsers);
    }, [])
    
    const isListenerSetUp = useRef(false);
    useEffect(() => {
        if (!me || !stream) return;
        if (!isListenerSetUp.current) {
            ws.on("user-joined", ({peerId}) => {
                console.log(peerId, stream);
                const call = me.call(peerId, stream);
                console.log("call:",call);

                call.on("stream", (peerStream) => {
                    console.log("user_joined")
                    dispatch(addPeerAction(peerId, peerStream));
                })
            })
            me.on("call", (call) => {
                console.log("call received:", call);
                call.answer(stream);
                console.log("call answer");
                call.on("stream", (peerStream) => {
                    console.log("peer stream", peerStream);
                    dispatch(addPeerAction(call.id, peerStream));
                })
            })
            isListenerSetUp.current = true;
        }
        
    }, [me, stream, dispatch, ws])
    // isListenerSetUp.current = false;
    // ws.emit('ready');

    console.log({peers});
    return (<RoomContext.Provider value={{ws, me, stream, peers}}>{children}</RoomContext.Provider>);
}
