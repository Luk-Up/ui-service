import axios from "axios";

const API_URL = process.env.REACT_APP_AUTH_API_URL || 'http://localhost:5000/api/auth';

const register = (username, email, password) => {
    return axios.post(`${API_URL}/register`, {
        username,
        email,
        password
    });
};

const login = (email, password) => {
    return axios.post(`${API_URL}/login`, {
        email,
        password
    });
};

const getMe = (token) => {
    return axios.get(`${API_URL}/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const authService = {
    register,
    login,
    getMe
}

export default authService;