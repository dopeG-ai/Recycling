import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    // Add token to request if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with an error
      console.error('Response error:', error.response.data);
      return Promise.reject(error);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error:', error.request);
      throw new Error('Unable to connect to the server. Please try again later.');
    } else {
      // Something else happened
      console.error('Error:', error.message);
      throw error;
    }
  }
);

export default instance;