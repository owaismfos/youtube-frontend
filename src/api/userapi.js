import axiosInstance from './axios';

class AuthService {
  async register(data) {
    try {
      const response = await axiosInstance.post('/users/create-user', data);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
  // async login(username, password) {
  //     return fetch('http://localhost:8000/api/v1/users/authenticate',{
  //         method: 'POST',
  //         headers: {
  //             'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({
  //             username: username,
  //             password: password
  //         })
  //     }).then(res => res.json());
  // }

  // async logout() {
  //     return fetch('http://localhost:8000/api/v1/users/logout',{
  //         method: 'POST',
  //         headers: {
  //             'Content-Type': 'application/json',
  //             'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  //         }
  //     }).then(res => res.json());
  // }

  // async loggedInUserAvatar() {
  //     return fetch('http://localhost:8000/api/v1/users/logged-in-user-avatar',{
  //         method: 'GET',
  //         headers: {
  //             'Content-Type': 'application/json',
  //             'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  //         }
  //     }).then(res => res.json());
  // }

  // async getTokens() {
  //     return fetch('http://localhost:8000/api/v1/users/refreshed-tokens',{
  //         method: 'POST',
  //         headers: {
  //             'Content-Type': 'application/json',
  //             'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
  //         }
  //     }).then(res => res.json());
  // }

  async userProfile() {
    try {
      const response = await axiosInstance.get('/users/user-profile');
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  async userList() {
    try {
      const response = await axiosInstance.get('/users/user-list');
      console.log('Users List: ', response.data);  // Use res.data to get the response body
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  async userSearch(query) {
    try {
      const response = await axiosInstance.get(`/users/user-search?query=${query}`);
      console.log('Search Results: ', response.data);  // Use res.data to get the response body
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  async passwordResetLink(data) {
    try {
      const response = await axiosInstance.post('users/password-reset', data);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
}

const authService = new AuthService();

export default authService;
