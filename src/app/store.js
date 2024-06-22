import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import videoReducer from '../features/video/videoSlice';
import commentReducer from '../features/video/commentSlice';

// Retrieve the stored state from localStorage
// const storedState = localStorage.getItem('reduxState');

// Parse the stored state or set it to an empty object if undefined
// const preloadedState = storedState ? storedState : {};

// const reducers = combineReducers({
//     auth: authReducer,
//     videos: videoReducer,
// })

const store = configureStore({
    reducer: {
        auth: authReducer,
        videos: videoReducer,
        comments: commentReducer,
    },
    // preloadedState
});

// store.subscribe(() => {
//     const stateToStore = store.getState();
//     localStorage.setItem('reduxState', stateToStore);
// })

export default store