import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ensure backend runs on 5000
});

// Request interceptor for adding the token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
