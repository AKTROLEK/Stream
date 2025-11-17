import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (discordId) => api.post('/auth/login', { discordId }),
  verify: () => api.get('/auth/verify'),
};

export const streamerAPI = {
  getProfile: () => api.get('/streamers/profile'),
  updateProfile: (data) => api.put('/streamers/profile', data),
  getLeaderboard: () => api.get('/streamers/leaderboard'),
};

export const creditAPI = {
  getHistory: (params) => api.get('/credits/history', { params }),
  getBalance: () => api.get('/credits/balance'),
};

export const analyticsAPI = {
  getWeekly: (platform) => api.get('/analytics/weekly', { params: { platform } }),
  getMonthly: (platform) => api.get('/analytics/monthly', { params: { platform } }),
  getPlatforms: () => api.get('/analytics/platforms'),
  getTop: (period, limit) => api.get('/analytics/top', { params: { period, limit } }),
};

export const ticketAPI = {
  getMy: () => api.get('/tickets/my'),
  getById: (ticketId) => api.get(`/tickets/${ticketId}`),
};

export const rewardAPI = {
  getAll: () => api.get('/rewards'),
  purchase: (rewardId) => api.post(`/rewards/${rewardId}/purchase`),
};

export default api;
