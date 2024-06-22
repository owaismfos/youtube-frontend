import { createSlice } from '@reduxjs/toolkit';

const videoSlice = createSlice({
    name: 'videos',
    initialState: {
        isVideos: false,
        videosList: []
    },
    reducers: {
        addVideosList: (state, action) => {
            state.isVideos = true;
            state.videosList = action.payload;
        },
        addVideo: (state, action) => {
            state.videosList.push(action.payload);
        }
    }
})

export const { addVideosList, addVideo } = videoSlice.actions;

export default videoSlice.reducer;