import axios from 'axios';

const API_BASE_URL = 'https://ethonos-task-backend.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  refresh: (refreshToken) => api.post('/auth/refresh', { refresh: refreshToken }),
};

// Wallet API
export const walletAPI = {
  getWallet: () => api.get('/wallet/wallet'),
  getDashboard: () => api.get('/wallet/dashboard'),
  getStats: (months = 6) => api.get('/wallet/stats', { params: { months } }),
};

// Card API
export const cardAPI = {
  getCards: () => api.get('/wallet/cards'),
  getCard: (cardId) => api.get(`/wallet/cards/${cardId}`),
  createCard: (cardData) => api.post('/wallet/cards', cardData),
  updateCard: (cardId, cardData) => api.put(`/wallet/cards/${cardId}`, cardData),
  deleteCard: (cardId) => api.delete(`/wallet/cards/${cardId}`),
};

// Transaction API
export const transactionAPI = {
  getTransactions: (limit = 50, offset = 0) =>
    api.get('/wallet/transactions', { params: { limit, offset } }),
  getTransaction: (transactionId) => api.get(`/wallet/transactions/${transactionId}`),
  createTransaction: (transactionData) => api.post('/wallet/transactions', transactionData),
  sendMoney: (transferData) => api.post('/wallet/send-money', transferData),
};

// QR Code API
export const qrAPI = {
  generateQRCode: (qrData) => api.post('/wallet/qr-codes/generate', qrData),
  getQRCodes: () => api.get('/wallet/qr-codes'),
  scanQRCode: (qrCodeData) => api.post('/wallet/qr-codes/scan', qrCodeData),
};

export default api;
