// Import axios library
import axios from "axios";

// Create axios instance with a base URL
const instance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_PORT}/`,
});

// Add request interceptor to modify request configuration
instance.interceptors.request.use((config) => {
  // Get token from localStorage
  const token = window.localStorage.getItem("token");

  // Set Authorization header with the Bearer token, if available
  config.headers.Authorization = token ? `Bearer ${token}` : "";

  // Return updated configuration
  return config;
});

// Export configured axios instance
export default instance;
