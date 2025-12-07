import axios from 'axios'

// 🔧 URL de tu backend en Render
const URL_BASE = 'https://final2025python-main.onrender.com/'

const api = axios.create({
  baseURL: URL_BASE,
  headers: { 
    'Content-Type': 'application/json'
  },
  timeout: 10000,
})

// Interceptor para agregar token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 🐛 DEBUG: Ver qué se está enviando
    console.log('📤 REQUEST:', {
      method: config.method,
      url: config.url,
      data: config.data,
      headers: config.headers
    })
    
    return config
  },
  error => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas
api.interceptors.response.use(
  response => {
    // 🐛 DEBUG: Ver qué responde el servidor
    console.log('📥 RESPONSE:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    })
    return response
  },
  error => {
    // 🐛 DEBUG: Ver errores completos
    console.error('❌ RESPONSE ERROR:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/'
    }
    
    return Promise.reject(error)
  }
)

export default api