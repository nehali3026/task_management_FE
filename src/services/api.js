import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// New: Response interceptor for errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't auto-show errors here—let components handle via try/catch
    // But log for dev
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", error.response?.data || error.message);
    }
    return Promise.reject(error); // Re-throw for component catch
  }
);

export default api;
