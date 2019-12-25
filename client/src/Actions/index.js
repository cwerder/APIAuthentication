import axios from 'axios';
import { AUTH_SIGN_IN,
    AUTH_SIGN_UP,
    AUTH_ERROR,
    AUTH_SIGN_OUT,
    DASHBOARD_GET_DATA
} from './types';

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

export const signIn = data => {
    /*
        (Step 1) Use the data and make HTTP request to backend and send it along [x]
        (Step 2) Take backend response (jwtToken is here now!) [x]
        (Step 3) Dispatch user just signed up (with jwtToken) [x]
        (Step 4) Save the jwtToken into our localStorage [x]
    */
    return async dispatch => {
        try {
            console.log('ActionCreator signin called')
            const res = await axios.post('http://localhost:5000/users/signin', data);
            console.log('res', res);

            console.log('ActionCreator dispatched a message');
            dispatch({
                type: AUTH_SIGN_IN,
                payload: res.data.token
            });

            localStorage.setItem('JWT_TOKEN', res.data.token);
            axios.defaults.headers.common['Authorization'] = res.data.token;
        } catch (error) {
            dispatch({
                type: AUTH_ERROR,
                payload: 'Email and password is invalid'
            });
        }
    }
}

export const getSecret = () => {
    return async dispatch => {
        try {
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('JWT_TOKEN');
            const res = await axios.get('http://localhost:5000/users/secret');
            console.log('res', res);

            dispatch({
                type: DASHBOARD_GET_DATA,
                payload: res.data.secret
            });
        } catch (e) {
            console.error('error', e);
        }
    }
}

export const signOut = () => {
    return dispatch => {
        localStorage.removeItem('JWT_TOKEN');
        axios.defaults.headers.common['Authorization'] = '';

        dispatch({
            type: AUTH_SIGN_OUT,
            action: ''
        });
    };
}