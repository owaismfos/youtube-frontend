import { createSlice } from '@reduxjs/toolkit';

const chatUserListSlice = createSlice({
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

export const { addUsersList } = chatUserListSlice.actions;

export default chatUserListSlice.reducer;