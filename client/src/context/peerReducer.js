import { ADD_PEER, REMOVE_PEER } from "./peerActions";

export const peersReducer = (state, action) => {
    switch(action.type) {
        case ADD_PEER:
            return {
                ...state,
                [action.payload.peerId]: {
                    stream: action.payload.stream,
                },
            };
        case REMOVE_PEER:
            const {[action.payload.peerId]: deleted, ...rest} = state;
            return rest;
        default:
            return {...state};
        
    }
}