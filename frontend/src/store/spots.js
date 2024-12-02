import { csrfFetch } from "./csrf";

// action creators

const LOAD_SPOTS = 'spots/loadSpots';

const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        spots
    }
}

// thunk action

// getAllSpots action

export const fetchSpots = () => async dispatch => {
    const res = await fetch('/api/spots');
    const spots = await res.json();
    localStorage.setItem('spots', JSON.stringify(spots))
    dispatch(loadSpots(spots));
    return spots;
}

// reducer

const initialState = { allSpots: {}, isLoading: true };

export default function spotsReducer(state = initialState, action) {
    switch(action.type){
        case LOAD_SPOTS:
            { 
                action.spots.Spots.map(spot=>
                    initialState.allSpots[spot.id] = spot
                )
            };
        default:
            return state;
    }
}
    