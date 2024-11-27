// action creators

import { useParams } from "react-router-dom";

const LOAD_SPOTS = 'spots/loadSpots';
const ADD_SPOT = 'spots/addSpot';

export const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        payload: spots
    }
}

export const addSpot = (spot) => {
    return {
        type: ADD_SPOT,
        payload: spot
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

export const createSpot = (newSpot) => async dispatch => {
    const { id } = useParams();
    console.log(id)
}

// reducer

const initialState = { allSpots: {}, isLoading: true };

export default function spotsReducer(state = initialState, action) {
    switch(action.type){
        case LOAD_SPOTS:
            return { ...state, allSpots: [...action.payload.Spots] };
        default:
            return state;
    }
}
    