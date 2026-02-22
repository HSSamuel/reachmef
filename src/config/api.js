import axios from "axios";

export const api = axios.create({
  // This pulls the URL from your new .env file
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor to attach the JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("reachme_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
