const axios = require('axios');
const API_ENDPOINT = process.env.API_ENDPOINT;

// Create a separate instance for token retrieval to avoid interceptor loop
const axiosForTokenRetrieval = axios.create({
    baseURL: API_ENDPOINT,
});

const api = axios.create({
    baseURL: API_ENDPOINT,
});



const getToken = async () => {
    console.log(`Using API endpoint: ${API_ENDPOINT}`);
    try {
        const response = await axiosForTokenRetrieval.post('/auth', {
            "username": process.env.ADMIN_EMAIL,
            "password": process.env.ADMIN_PASSWORD
        }, {
            headers: {
            'Content-Type': 'application/json'
            }
        });
        console.log(`Token retrieved: ${response.data.token}`);
        return response.data.token;
    } catch (error) {
        console.error('Error retrieving token:', error);
        throw error;
    }
};

api.interceptors.request.use(async (config) => {
    const token = await getToken();
    config.headers = {
        ...config.headers,
        'x-token': token
    };
    return config;
});

module.exports = { api };
