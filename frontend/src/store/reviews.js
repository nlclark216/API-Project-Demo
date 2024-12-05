import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = 'reviews/loadReviews';
const ADD_REVIEW = 'reviews/addReview';
const DELETE_REVIEW = 'reviews/deleteReview';


// Actions

// Load all reviews

export const loadReviews = reviews => {
    return {
        type: LOAD_REVIEWS,
        payload: reviews
    }
}

export const addReview = review => {
    return {
        type: ADD_REVIEW,
        payload: review
    }
}

export const deleteReview = reviewId => {
    return {
        type: DELETE_REVIEW,
        payload: reviewId
    }
}



// THUNKS

// Fetch reviews thunk
export const loadSpotReviews = spotId => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if(res.ok) {
        const reviews = await res.json();
        dispatch(loadReviews(reviews.Reviews));
        return reviews;
    }
}

// Add spot review thunk
export const addSpotReview = (review, spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(review)
    })
    if(res.ok) {
        const review = await res.json();
        dispatch(addReview(review));
        return review;
    }
}

// Delete review thunk

export const deleteTargetReview = reviewId => async dispatch => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
    })
    if(res.ok){
        dispatch(deleteReview(reviewId))
    }
}



// reducer

const initialState = { reviews: [] }

export default function reviewReducer(state = initialState, action) {
    switch(action.type) {
        case LOAD_REVIEWS:
            return { ...state, reviews: action.payload };
        case ADD_REVIEW:
            return { ...state, reviews: [...state.reviews]};
        case DELETE_REVIEW:
            return {
                ...state, reviews: state.reviews.filter(review=>review.id!==action.payload.reviewId)
            }
        default:
            return state;
    }
}