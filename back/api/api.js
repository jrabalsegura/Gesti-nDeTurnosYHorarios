const axios = require('axios');
const API_ENDPOINT = process.env.API_ENDPOINT;

const api = axios.create({
    baseURL: API_ENDPOINT,
});

//Get valid token from api
const getToken = async () => {
    const response = await api.post('/auth/login', {
        email: process.env.ADMIN,
        password: process.env.ADMIN_PASSWORD
    });
    return response.data.token;
}

api.interceptors.request.use(async (config) => {
    const token = await getToken();
    config.headers = {
        ...config.headers,
        'x-token': token
    }
    return config;
});

module.exports = {api};


