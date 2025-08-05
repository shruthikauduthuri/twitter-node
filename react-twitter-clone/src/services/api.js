import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/register/', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/login/', credentials);
    if (response.data.jwtToken) {
      localStorage.setItem('jwtToken', response.data.jwtToken);
    }
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/profile/');
    return response.data;
  },
};

// Tweet API calls
export const tweetAPI = {
  getFeed: async () => {
    const response = await api.get('/user/tweets/feed/');
    return response.data;
  },
  
  getUserTweets: async () => {
    const response = await api.get('/user/tweets/');
    return response.data;
  },
  
  createTweet: async (tweetData) => {
    const response = await api.post('/user/tweets/', tweetData);
    return response.data;
  },
  
  deleteTweet: async (tweetId) => {
    const response = await api.delete(`/tweets/${tweetId}/`);
    return response.data;
  },
  
  getTweetDetails: async (tweetId) => {
    const response = await api.get(`/tweets/${tweetId}/`);
    return response.data;
  },
  
  getTweetLikes: async (tweetId) => {
    const response = await api.get(`/tweets/${tweetId}/likes/`);
    return response.data;
  },
  
  getTweetReplies: async (tweetId) => {
    const response = await api.get(`/tweets/${tweetId}/replies/`);
    return response.data;
  },
};

// User API calls
export const userAPI = {
  getFollowing: async () => {
    const response = await api.get('/user/following/');
    return response.data;
  },
  
  getFollowers: async () => {
    const response = await api.get('/user/followers/');
    return response.data;
  },
};

export default api;