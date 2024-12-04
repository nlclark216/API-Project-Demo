import { csrfFetch } from "./csrf";

// action creators

const LOAD_SPOTS = 'spots/loadSpots';
const FIND_BYID = 'spots/findById';
const LOAD_REVIEWS = 'spots/loadReviews';

const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        spots
    }
}

const findById = spot => {
    return {
        type: FIND_BYID,
        spot
    }
}

const loadReviews = reviews => {
    return {
        type: LOAD_REVIEWS,
        reviews
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

export const findSpot = (id) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${id}`);
    const spot = await res.json();
    localStorage.setItem('spot', JSON.stringify(spot));
    dispatch(findById(spot));
    return spot;
}

export const fetchReviews = (id) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${id}/reviews`);
    const reviews = await res.json();
    localStorage.setItem(`reviews`, JSON.stringify(reviews.Reviews));
    dispatch(loadReviews(reviews));
    return reviews;
}

// reducer

const initialState = { allSpots: {}, singleSpot: {}, spotReviews: {}, isLoading: true };

export default function spotsReducer(state = initialState, action) {
    switch(action.type){
        case LOAD_SPOTS:
            { 
                action.spots.Spots.map(spot=>
                    initialState.allSpots[spot.id] = spot
                )
                return state
            }
        case FIND_BYID:
            return {...state, singleSpot: action.spot}
        case LOAD_REVIEWS:
            {
                action.reviews.Reviews.map(review=>
                    initialState.spotReviews[review.id] = review
                )
                return state
            }
        default:
            return state;
    }
}
    