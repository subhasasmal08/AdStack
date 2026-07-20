import axios from 'axios';
import CryptoJS from 'crypto-js';
import { ENDPOINTS } from './endpoints';

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default_secret_key_123';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper to encrypt data
const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

// Helper to decrypt data
const decryptData = (ciphertext) => {
  if (!ciphertext) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (e) {
    return null;
  }
};

// Store tokens
export const setTokens = (accessToken, refreshToken) => {
  if (typeof window !== 'undefined') {
    const tokens = { access_token: accessToken, refresh_token: refreshToken };
    localStorage.setItem('UID', encryptData(tokens));
  }
};

// Get access token
export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    const tokens = decryptData(localStorage.getItem('UID'));
    return tokens ? tokens.access_token : null;
  }
  return null;
};

// Get refresh token
export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    const tokens = decryptData(localStorage.getItem('UID'));
    return tokens ? tokens.refresh_token : null;
  }
  return null;
};

// Clear tokens
export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('UID');
  }
};

const axiosapiinstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach access token
axiosapiinstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
axiosapiinstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        try {
          // Call refresh token API
          const res = await axios.post(`${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH_TOKEN}`, {
            refresh_token: refreshToken
          });
          
          // Depending on the exact structure, assuming it matches the login response pattern:
          // res.data.detail.access_token
          const newAccessToken = res.data?.detail?.access_token || res.data?.access_token;
          const newRefreshToken = res.data?.detail?.refresh_token || res.data?.refresh_token || refreshToken;

          if (newAccessToken) {
              setTokens(newAccessToken, newRefreshToken);
              
              // Update Authorization header for original request
              originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              
              // Retry the original request
              return axiosapiinstance(originalRequest);
          }
        } catch (refreshError) {
          // If refresh token fails, clear tokens and redirect to login
          clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/login'; // Adjust to your login route
          }
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, redirect to login
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export { axiosapiinstance, axios };
