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

const removeUser = (user) => {
    return {
        type: REMOVE_USER,
        payload: user
    }
};

// thunk actions
// login action
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

// Restore User action
export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

// Signup action
export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user;
    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username,
        firstName,
        lastName,
        email,
        password
      })
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

// Logout action
export const logout = () => async dispatch => {
    const res = await csrfFetch('/api/session', {
        method: 'DELETE'
    });
    dispatch(removeUser());
    return res
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