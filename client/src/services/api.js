import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT automatically

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("careershield_token");

    console.log("TOKEN:", token);

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("AUTH HEADER:", config.headers.Authorization);

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
