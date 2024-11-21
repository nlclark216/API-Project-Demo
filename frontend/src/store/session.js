import { csrfFetch } from "./csrf";

// action creators
const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

const setUser = (user) => {
    return {
        type: SET_USER,
        payload: user
    }
};

// const removeUser = (user) => {
//     return {
//         type: REMOVE_USER,
//         payload: user
//     }
// };

// thunk action
export const login = (user) => async (dispatch) => {
    // get user credentials
    const { credential, password } = user;

    const res = await csrfFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify({
            credential,
            password
        })
    })

    const data = await res.json();
    dispatch(setUser(data.user));
    return res;
};

// initial state - user is logged out

const initialState = { user: null };

// reducer

export default function sessionReducer(state = initialState, action) {
    switch(action.type){
        case SET_USER:
            return {...state, user: action.payload};
        case REMOVE_USER:
            return {...state, user: null};
        default:
            return state;
    }
}