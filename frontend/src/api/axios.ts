import axios from "axios";

const apiUrl = "https://content-approval-workflow.onrender.com/"; 

const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
