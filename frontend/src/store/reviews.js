import { csrfFetch } from "./csrf";
import { useSelector } from "react-redux";

const LOAD_REVIEWS = 'reviews/loadReviews';
const ADD_REVIEW = 'reviews/addReview';
const DELETE_REVIEW = 'reviews/deleteReview';
const FINDBY_SPOTID = 'reviews/findBySpotId';


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

export const findBySpotId = spotId => {
    return {
        type: FINDBY_SPOTID,
        payload: spotId
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
        window.location.reload();
        return review;
    }
}

// Delete review thunk

export const deleteTargetReview = reviewId => async dispatch => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
    })
    if(res.ok){
        dispatch(deleteReview(reviewId));
        window.location.reload();
    }
}

// find review by spot id thunk

export const findReviewBySpot = spotId => async dispatch => {
    dispatch(loadSpotReviews(spotId));
    dispatch(findBySpotId(spotId));
    const reviews = useSelector(state=>state.reviews);
    return reviews.forEach(review=>dispatch(deleteTargetReview(review.id)));
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
        case FINDBY_SPOTID:
            return {
                ...state, reviews: state.reviews.filter(review=>review.spotId!==action.payload)
            }
        default:
            return state;
    }
}