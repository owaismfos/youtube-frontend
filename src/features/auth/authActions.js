import axios from 'axios';
import store from '../../app/store';
import axiosInstance from '../../api/axios';
import { login, logout} from '../auth/authSlice';

export const loginUser = (username, password) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('/users/authenticate', {
            username,
            password
        });
        console.log(response.data);
        dispatch(login({ userData: response.data.data }));
        const authData = response.data.data;
        localStorage.setItem('authToken', authData.accessToken);
        localStorage.setItem('authRefreshToken', authData.refreshToken);
        localStorage.setItem('authUsername', authData.user);
        localStorage.setItem('authId', authData.id);
        localStorage.setItem('userAvatar', authData.userAvatar);
        localStorage.setItem('tokenExpiry', authData.tokenExpiry);
        alert("Logged in successfully");
        return true;
    } catch (error) {
        console.log(error);
        alert("Failed to login: " + error.message);
    }
}

export const loginWithGoogle = (idToken) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('users/google-login', {
            idToken
        });
        console.log(response.data);
        dispatch(login({ userData: response.data.data }));
        const authData = response.data.data;
        localStorage.setItem('authToken', authData.accessToken);
        localStorage.setItem('authRefreshToken', authData.refreshToken);
        localStorage.setItem('authUsername', authData.user);
        localStorage.setItem('authId', authData.id);
        localStorage.setItem('userAvatar', authData.userAvatar);
        localStorage.setItem('tokenExpiry', authData.tokenExpiry);
        alert("Logged in successfully");
        return true;
    } catch (error) {
        console.log(error);
        alert("Failed to login: " + error.message);
    }
}


export const logoutUser = () => async (dispatch) => {
    try {
        const response = await axiosInstance.post('/users/logout');
        if (response.data.status_code === 200) {
            dispatch(logout());
            localStorage.clear();
        }
    } catch (error) {
        console.log(error);
    }
}

export const refreshedAccessToken = () =>  async (dispatch) => {
    try {
        const state = store.getState();
        const refreshToken = state.auth.userData.refreshToken
        const response = await axios.post('http://localhost:8000/api/v1/users/refreshed-tokens', {
            headers: {
                'Authorization': `Bearer ${refreshToken}`
            }
        });
        dispatch(login({ userData: response.data.data }));
    } catch (error) {
        console.log(error);
    }   
} 