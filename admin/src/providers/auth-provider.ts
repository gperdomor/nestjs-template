import { AuthProvider } from '@refinedev/core';
import axios from 'axios';

const API_URL = '/api';

// Configure axios to include a JWT token
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Handle token refresh
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/admin/auth/refresh`, {
            refreshToken,
          });

          const refreshResult = response.data.data || response.data;

          // Handle case where a user lost admin privileges
          if (refreshResult.success === false && refreshResult.statusCode === 403) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return;
          }

          localStorage.setItem('access_token', refreshResult.accessToken);
          localStorage.setItem('refresh_token', refreshResult.refreshToken);

          originalRequest.headers.Authorization = `Bearer ${refreshResult.accessToken}`;
          return axios(originalRequest);
        } catch (_) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  },
);

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      // Use admin-specific login endpoint with server-side admin validation
      const response = await axios.post(`${API_URL}/admin/auth/login`, {
        email,
        password,
      });

      const loginResult = response.data.data || response.data;

      // Handle server-side admin privilege validation
      if (loginResult.success === false && loginResult.statusCode === 403) {
        return {
          success: false,
          error: {
            name: 'Access Denied',
            message: loginResult.error || 'You do not have permission to access the admin area',
          },
        };
      }

      const { accessToken, refreshToken, user, requiresOtp, requiresEmailVerification } =
        loginResult;

      if (requiresEmailVerification) {
        return {
          success: false,
          error: {
            name: 'Email Verification Required',
            message: 'Please verify your email before logging in',
          },
          redirectTo: `/verify-email?email=${email}`,
        };
      }

      if (requiresOtp) {
        // Store user ID temporarily for OTP verification
        localStorage.setItem('otp_user_id', loginResult.userId);
        return {
          success: false,
          redirectTo: `/verify-otp?userId=${loginResult.userId}`,
        };
      }

      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      return {
        success: true,
        redirectTo: '/users',
      };
    } catch (error: any) {
      // Handle admin privilege errors from server
      if (error.response?.status === 403) {
        return {
          success: false,
          error: {
            name: 'Access Denied',
            message: 'You do not have permission to access the admin area',
          },
        };
      }

      return {
        success: false,
        error: {
          name: 'LoginError',
          message:
            error.response?.data?.error || error.response?.data?.message || 'Invalid credentials',
        },
      };
    }
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await axios.post(`${API_URL}/admin/auth/logout`, { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }

    return {
      success: true,
      redirectTo: '/login',
    };
  },

  check: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return {
        authenticated: false,
        redirectTo: '/login',
      };
    }

    try {
      // Verify token is still valid by calling a protected endpoint
      await axios.get(`${API_URL}/auth/me`);
      return {
        authenticated: true,
      };
    } catch (_error) {
      return {
        authenticated: false,
        redirectTo: '/login',
      };
    }
  },

  getPermissions: async () => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.permissions || [];
    }
    return [];
  },

  getIdentity: async () => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return {
        id: userData.id,
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        avatar: userData.avatar,
        roles: userData.roles,
      };
    }
    return null;
  },

  register: async ({ email, password, firstName, lastName }) => {
    try {
      await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        firstName,
        lastName,
      });

      return {
        success: true,
        redirectTo: '/login',
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: 'RegisterError',
          message: error.response?.data?.message || 'Registration failed',
        },
      };
    }
  },

  forgotPassword: async ({ email }) => {
    try {
      await axios.post(`${API_URL}/auth/password-reset/request`, {
        email,
      });

      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: 'ForgotPasswordError',
          message: error.response?.data?.message || 'Failed to send reset email',
        },
      };
    }
  },

  updatePassword: async ({ password, token }) => {
    try {
      await axios.post(`${API_URL}/auth/password-reset/reset`, {
        password,
        token,
      });

      return {
        success: true,
        redirectTo: '/login',
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: 'UpdatePasswordError',
          message: error.response?.data?.message || 'Failed to reset password',
        },
      };
    }
  },

  onError: async error => {
    console.error('Auth error:', error);
    return {};
  },
};
