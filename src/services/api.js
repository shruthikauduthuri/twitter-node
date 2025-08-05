import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/login/', credentials),
  register: (userData) => api.post('/register/', userData),
  getProfile: () => api.get('/profile/'),
};

// Tweet API
export const tweetAPI = {
  getFeed: () => api.get('/user/tweets/feed/'),
  getUserTweets: () => api.get('/user/tweets/'),
  createTweet: (tweet) => api.post('/user/tweets/', { tweet }),
  deleteTweet: (tweetId) => api.delete(`/tweets/${tweetId}/`),
  getTweetDetails: (tweetId) => api.get(`/tweets/${tweetId}/`),
  getTweetLikes: (tweetId) => api.get(`/tweets/${tweetId}/likes/`),
  getTweetReplies: (tweetId) => api.get(`/tweets/${tweetId}/replies/`),
};

// User API
export const userAPI = {
  getFollowing: () => api.get('/user/following/'),
  getFollowers: () => api.get('/user/followers/'),
};

export default api;