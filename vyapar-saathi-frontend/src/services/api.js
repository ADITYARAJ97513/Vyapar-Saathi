import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * A function to set the authentication token for all subsequent API requests.
 * This should be called after a user logs in or when the app loads with a stored token.
 * @param {string} token The JWT token from the backend.
 */
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete api.defaults.headers.common['x-auth-token'];
  }
};
export const productAPI = {
  getAll: () => api.get('/products'),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
};
export const salesAPI = {
  create: (saleData) => api.post('/sales', saleData),
  getAll: () => api.get('/sales'),
};
export const expensesAPI = {
  create: (expenseData) => api.post('/expenses', expenseData),
  getByDate: (date) => api.get(`/expenses?date=${date}`),
};
export const customersAPI = {
  getAll: () => api.get('/customers'),
  recordPayment: (customerId, amount) =>
    api.post(`/customers/${customerId}/pay`, { amount }),
  sendUdhaarReminder: (customerId) =>
    api.post(`/customers/${customerId}/reminder`),
};
export const reportsAPI = {
  getDailyReport: (date) => api.get(`/reports/daily?date=${date}`),
};
export const paymentAPI = {
  createOrder: (amount) => api.post('/payments/create-order', { amount }),
  verifyPayment: (data) => api.post('/payments/verify', data),
};



export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getQuestion: (email) => api.post('/auth/get-question', { email }),
  verifyAnswer: (data) => api.post('/auth/verify-answer', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export default api;