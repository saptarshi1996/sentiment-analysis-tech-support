import axios from 'axios';

// Create an Axios instance with the base URL from environment variables
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export default axiosInstance;
