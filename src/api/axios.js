import axios from 'axios';
import store from '../app/store';

const instance = axios.create({
//   baseURL: 'http://localhost:8080/api/v1',
    baseURL: import.meta.env.VITE_SERVER_URL
});

print(import.meta.env.SERVER_URL)

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