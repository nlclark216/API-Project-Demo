// import { csrfFetch } from "./csrf";

// action creators

const LOAD_SPOTS = 'spots/loadSpots';

const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        payload: spots
    }
}

// thunk action

// getAllSpots action

export const fetchSpots = () => async dispatch => {
    const res = await fetch('/api/spots');
    const spots = await res.json();
    dispatch(loadSpots(spots));
    return res;
}

// reducer

const initialState = { allSpots: {}, isLoading: true };

export default function spotsReducer(state = initialState, action) {
    switch(action.type){
        case LOAD_SPOTS:
            return { ...state, allSpots: {...action.payload.Spots} };
        default:
            return state;
    }
}
    