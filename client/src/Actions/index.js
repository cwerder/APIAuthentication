import axios from 'axios';
import { AUTH_SIGN_UP, AUTH_ERROR, AUTH_SIGN_OUT } from './types';

/*
    ActionCreators -> create/return Actions -> dispatched -> middlewares -> reducers
*/

export const oauthGoogle = data => {
    return async dispatch => {
        console.log('we received', data);
        const res = await axios.post('http://localhost:5000/users/oauth/google', {
            access_token: data
        });
        dispatch({
            type: AUTH_SIGN_UP,
            payload: res.data.token
        });
        localStorage.setItem('JWT_TOKEN', res.data.token);
    }
}

export const oauthFacebook = data => {
    return async dispatch => {
        console.log('we received', data);
        const res = await axios.post('http://localhost:5000/users/oauth/facebook', {
            access_token: data
        });
        dispatch({
            type: AUTH_SIGN_UP,
            payload: res.data.token
        });
        localStorage.setItem('JWT_TOKEN', res.data.token);
    }
}

export const signUp = data => {
    /*
        (Step 1) Use the data and make HTTP request to backend and send it along [x]
        (Step 2) Take backend response (jwtToken is here now!) [x]
        (Step 3) Dispatch user just signed up (with jwtToken) [x]
        (Step 4) Save the jwtToken into our localStorage [x]
    */
    return async dispatch => {
        try {
            console.log('ActionCreator signup called')
            const res = await axios.post('http://localhost:5000/users/signup', data);
            console.log('res', res);

            console.log('ActionCreator dispatched a message');
            dispatch({
                type: AUTH_SIGN_UP,
                payload: res.data.token
            });

            localStorage.setItem('JWT_TOKEN', res.data.token);
        } catch (error) {
            dispatch({
                type: AUTH_ERROR,
                payload: 'Email is already in use'
            });
        }
    }
}

export const signOut = () => {
    return dispatch => {
        localStorage.removeItem('JWT_TOKEN');

        dispatch({
            type: AUTH_SIGN_OUT,
            action: ''
        });
    };
}