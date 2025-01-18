import { login } from "../features/auth/authSlice";


const isTokenValid = (tokenExpiry) => {
    // const token = localStorage.getItem('accessToken');
    // const tokenExpiry = localStorage.getItem('tokenExpiry');
    if (new Date(tokenExpiry) > new Date()) {
        return true;
    }
    return false;
}

const updateReduxState = (dispatch) => {
    if (isTokenValid(localStorage.getItem('tokenExpiry'))) {
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

export {updateReduxState};