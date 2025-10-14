import { apiClient } from './client';
import type { 
  ApiResponse, 
  LoginRequest, 
  RegisterRequest, 
  LoginResponse, 
  User 
} from '@/types';

export const authService = {
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/api/auth/login',
      credentials
    );
    
    if (response.success && response.data) {
      // Store tokens
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  async register(data: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/api/auth/register',
      data
    );
    
    if (response.success && response.data) {
      // Store tokens
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } finally {
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      apiClient.clearTokens();
    }
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>('/api/users/me');
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<boolean>> {
    return apiClient.post<ApiResponse<boolean>>('/api/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  async forgotPassword(email: string): Promise<ApiResponse<boolean>> {
    return apiClient.post<ApiResponse<boolean>>('/api/auth/forgot-password', {
      email,
    });
  },

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<boolean>> {
    return apiClient.post<ApiResponse<boolean>>('/api/auth/reset-password', {
      token,
      newPassword,
    });
  },

  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('accessToken');
  },
};