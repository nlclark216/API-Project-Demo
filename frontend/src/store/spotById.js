// action creators

import { useParams } from "react-router-dom"

const FIND_BYID = 'spots/findById'

const findById = (spot) => {
    return {
        type: FIND_BYID,
        payload: spot
    }
}

// thunk action

export const fetchSpotById = () => async dispatch => {
    const { id } = useParams();
    const res = await fetch(`/api/spots/${id}`);
    const spot = await res.json();
    dispatch(findById(spot));
}

// reducer

