import axios from 'axios';
import store from '../app/store';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});


// Add a request interceptor to the instance and include the token in the headers
instance.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.auth.userData?.accessToken;
    console.log("This is access token in axios: ", token);
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
},  
    (error) => {
        console.log("Error: ", error);
        return Promise.reject(error);
})

export default instance;