import { login } from "../features/auth/authSlice";


const isTokenValid = (tokenExpiry) => {
    if (new Date(tokenExpiry) > new Date()) {
        return true;
    }
    return false;
}

export const updateReduxState = (dispatch) => {
    if (!isTokenValid(localStorage.getItem('tokenExpiry'))) {
        console.log("Check token expiry date");
        localStorage.clear();
    } else {
        const userData = {
            id : localStorage.getItem('authId'),
            accessToken: localStorage.getItem('authToken'),
            refreshedToken: localStorage.getItem('authRefreshToken'),
            user: localStorage.getItem('authUsername'),
            userAvatar: localStorage.getItem('userAvatar'),
            tokenExpiry: localStorage.getItem('tokenExpiry')
        };
        dispatch(login({ userData: userData }));
    }
}

// export {updateReduxState};