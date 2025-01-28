import { csrfFetch } from "./csrf";

const LOAD_SPOTS = "spots/loadSpots";
const SPOT_BYID = "spots/spotById";
const CREATE_SPOT = "spots/createSpot";
const GET_USER_SPOTS = "spots/getUserSpots";
const UPDATE_SPOT = "spots/updateSpot";
const DELETE_SPOT = "spots/deleteSpot";
const ADD_SPOT_IMG = "spots/addSpotImg";
const RESET_STATE = "spots/resetState";
const GET_REVIEWS = "spots/getReviews";

// Actions

// load all spots
export const loadSpots = (payload) => ({
  type: LOAD_SPOTS,
  payload,
});

// Get spot details by id
export const spotById = (payload) => ({
  type: SPOT_BYID,
  payload,
});

// Create a new spot
export const createSpot = (spot) => {
  return {
    type: CREATE_SPOT,
    payload: spot,
  };
};

// Get user spots
export const getUserSpots = (spots) => ({
  type: GET_USER_SPOTS,
  payload: spots,
});

// Update a spot
export const updateSpot = (spot) => ({
  type: UPDATE_SPOT,
  payload: spot,
});

// Delete a spot
export const deleteSpot = (spotId) => ({
  type: DELETE_SPOT,
  spotId,
});

// Add an image to spot
export const addImg = (img) => ({
  type: ADD_SPOT_IMG,
  img,
});


// Clear Spot State
export const clearState = () => {
  return {
    type: RESET_STATE,
  };
};

export const getReviews = (spotId) => {
  return {
    type: GET_REVIEWS,
    payload: spotId
  }
}

// Thunks

// load all spots
export const loadAllSpots = () => async dispatch => {
  const res = await fetch('/api/spots');
  
  if (res.ok) {
    const allSpots = await res.json();
    dispatch(loadSpots(allSpots));
  }
};

// Get spot details THUNK
export const getSpotById = (spotId) => async dispatch => {
  const res = await csrfFetch(`/api/spots/${spotId}`);
  if (res.ok) {
    const spot = await res.json();
    dispatch(spotById(spot));
    return spot;
  }
};

export const createNewSpot = (spot, imgArr, navigate) => async dispatch => {
  const res = await csrfFetch('/api/spots', {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(spot),
  });
  if (res.ok) {
    const addSpot = await res.json();
    dispatch(loadAllSpots());
    dispatch(createSpot(addSpot));
    await Promise.all(imgArr.map((img) => 
      dispatch(addImgToSpot(addSpot.id, img)))
    );
    dispatch(getSpotById(addSpot.id));
    navigate(`/spots/${addSpot.id}`);
    window.location.reload();
    return addSpot;
  } else {
    const error = await res.json();
    throw error;
  }
};

export const getCurrentUserSpots = () => async dispatch => {
  const res = await csrfFetch("/api/spots/current");
  if (res.ok) {
    const spots = await res.json();
    dispatch(getUserSpots(spots));
  } else {
    const error = await res.json();
    throw error;
  }
};

// Delete spot
export const deleteTargetSpot = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      dispatch(deleteSpot(spotId));
      window.location.reload();
    } else {
      const error = await res.json();
      throw error;
    }
  };

// Add spot image
export const addImgToSpot = (spotId, img) => async dispatch => {
  const res = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(img),
  });

  if (res.ok) {
    const newImg = await res.json();
    dispatch(addImg(newImg));
    return newImg;
  } else {
    const error = await res.json();
    throw error;
  }
};



// Update spot
// delete all ratings and reviews on update
export const updateTargetSpot = (id, spotInfo, navigate) => async dispatch => {
  const res = await csrfFetch(`/api/spots/${+id}`, {
    method: "PUT",
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(spotInfo),
  });
  if (res.ok) {
    const updatedSpot = await res.json();
    dispatch(updateSpot(updatedSpot));
    navigate(`/spots/${+id}`);
    window.location.reload();
    return updatedSpot;
  } else {
    const error = await res.json();
    throw error;
  }
};

// find review by spot Id
export const findReviewBySpot = spotId => async dispatch => {
  const res = await csrfFetch(`/api/spots/${+spotId}/reviews`);
  if(res.ok) {
      dispatch(getReviews(+spotId));
  }
}


// Initital State
const initialState = {
  allSpots: {},
  spotDetails: {},
  spotReviews: [],
  userSpots: [],
};

// REDUCER
export default function spotsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_SPOTS: {
      const newState = { ...state, allSpots: {} };
      const spotsArray = action.payload.Spots;
      spotsArray.forEach((spot) => {
        newState.allSpots[spot?.id] = spot;
      });
      return newState;
    }
    case SPOT_BYID: {
      return {
        ...state,
        spotDetails: {
          ...state.spotDetails,
          [action.payload.id]: action.payload,
        },
      };
    }
    case CREATE_SPOT: {
      const newState = {
        allSpots: {
          [action.payload.id]: action.payload,
          ...state.allSpots,
        },
        spotDetails: {
          ...state.spotDetails,
          [action.payload.id]: action.payload,
        },
      };
      return newState;
    }
    case UPDATE_SPOT: {
      const newState = {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.payload.id]: action.payload,
        },
        spotDetails: {
          ...state.spotDetails,
          [action.payload.id]: action.payload,
        },
        userSpots: state.userSpots.map((spot) =>
          spot.id === action.payload.id ? action.payload : spot
        ),
      };
      return newState;
    }
    case GET_USER_SPOTS: {
        return {
            ...state,
            userSpots: action.payload.Spots,
        };
    }
    case DELETE_SPOT: {
      const newState = { ...state };
      delete newState.allSpots[action.spotId];
      newState.userSpots = newState.userSpots.filter(
        (spot) => spot.id !== action.spotId
      );
      delete newState.spotDetails[action.spotId];
      return newState;
    }
    case ADD_SPOT_IMG: {
      const newState = { ...state };
      const spot = newState.spotDetails[action.img.spotId];
      if (spot) {
        spot.images = spot.images || [];
        if(spot.images.length < 10) {spot.images.push(action.img);}
      }
      return newState;
    }
    case GET_REVIEWS:
      return {...state, spotReviews: action.payload.Reviews}
    case RESET_STATE:
      return { ...initialState };
    default:
      return state;
  }
}