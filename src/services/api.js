import axios from "axios";

// const API_BASE_URL = 'https://adoptional-julian-grovellingly.ngrok-free.dev/api'
const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
  withCredentials: false,
});

// Add request interceptor to include token and headers
api.interceptors.request.use(
  (config) => {
    config.headers["ngrok-skip-browser-warning"] = "69420";

    const token = localStorage.getItem("token");
    if (token) {
      // console.log("token found: ", token);
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("Request config:", config);
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  (error) => {
    console.error("Response error:", error.response || error);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // login
  login: async (credentials) => {
    try {
      console.log("Login request:", credentials);
      const response = await api.post("/auth/login", credentials);
      console.log("Login API response:", response);
      return response.data;
    } catch (error) {
      console.error("Login API error:", error);
      console.error("Error details:", error.response?.data);
      throw error;
    }
  },
  // register
  register: async (userData) => {
    try {
      console.log("Register request:", userData);
      const response = await api.post("/auth/register", userData);
      console.log("Register API response:", response);
      return response.data;
    } catch (error) {
      console.error("Register API error:", error);
      console.error("Error details:", error.response?.data);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

//ai
export const chatbotAPI = {
  // gợi ý chuyên khoa dựa trên triệu chứng
  suggestSpecialty: async (data) => {
    try {
      console.log("Chatbot suggest specialty request:", data);
      const response = await api.post("/chatbot/suggest-specialty", data);
      console.log("Chatbot API response:", response);
      return response.data;
    } catch (error) {
      console.error("Chatbot API error:", error);
      console.error("Error details:", error.response?.data);
      throw error;
    }
  },

  // Health check
  health: async () => {
    try {
      const response = await api.get("/chatbot/health");
      return response.data;
    } catch (error) {
      console.error("Chatbot health check error:", error);
      throw error;
    }
  },
};

export default api;
