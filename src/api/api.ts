import axios, { AxiosInstance, AxiosResponse } from "axios";

// Cấu hình cơ bản cho API instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor cho request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho response (xử lý lỗi chung)
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Xử lý lỗi chung, ví dụ: 401 Unauthorized
    if (error.response?.status === 401) {
      console.error("Unauthorized! Redirecting to login...");
    }
    return Promise.reject(error);
  }
);

export default api;
