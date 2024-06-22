import userService from '../api/userapi.js';

const isTokenValid = (tokenExpiry) => {
    // const token = localStorage.getItem('accessToken');
    // const tokenExpiry = localStorage.getItem('tokenExpiry');
    if (new Date(tokenExpiry) > new Date()) {
        return true;
    }
    return false;
}

const isTokenExist = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        return true;
    }
    return false;
}

const refreshedTokens = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        return false;
    }
    const tokensResponse = await userService.getTokens(refreshToken);
    console.log(tokensResponse);
    localStorage.setItem('accessToken', tokensResponse.data.accessToken);
    localStorage.setItem('refreshToken', tokensResponse.data.refreshToken);
    localStorage.setItem('tokenExpiry', tokensResponse.data.tokenExpiry);
    return true;
}


export {
    isTokenValid,
    refreshedTokens,
    isTokenExist,
}