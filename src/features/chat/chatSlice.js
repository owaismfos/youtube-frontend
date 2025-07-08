import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'users',
    initialState: {
        isUsers: false,
        usersList: []
    },
    reducers: {
        addUsersList: (state, action) => {
            state.isUsers = true;
            state.usersList = action.payload;
        },
        // addVideo: (state, action) => {
        //     state.videosList.push(action.payload);
        // }
    }
})

export const { addUsersList } = chatSlice.actions;

export default chatSlice.reducer;