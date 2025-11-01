import axios from 'axios'

const API_BASE_URL = 'https://adoptional-julian-grovellingly.ngrok-free.dev/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420',
    'User-Agent': 'CustomClient/1.0',
  },
  withCredentials: false,
})

// Add request interceptor to include token and headers
api.interceptors.request.use(
  (config) => {
    // Ensure ngrok header is always present with every request
    config.headers['ngrok-skip-browser-warning'] = '69420'
    config.headers['User-Agent'] = 'CustomClient/1.0'

    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    console.log('Request config:', config)
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response)
    return response
  },
  (error) => {
    console.error('Response error:', error.response || error)

    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)
      return response.data
    } catch (error) {
      console.error('Login API error:', error)
      throw error
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      console.error('Register API error:', error)
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

export default api