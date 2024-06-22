import { createSlice } from '@reduxjs/toolkit';



export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: false,
        userData: null,
        userInfo: null,
    },
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            state.userInfo = null;
        },
        addUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
        addChannelStatus: (state, action) => {
            state.userInfo.isChannel = action.payload;
        }
    }
});

export const { login, logout, addUserInfo, addChannelStatus } = authSlice.actions;

export default authSlice.reducer;