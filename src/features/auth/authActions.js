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
        dispatch(logout());
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