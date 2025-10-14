import { create } from 'zustand';
import type { User } from '@/types';
import { authService } from '@/lib/api/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      if (response.success && response.data) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    try {
      const response = await authService.register(data);
      if (response.success && response.data) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  checkAuth: () => {
    const user = authService.getStoredUser();
    const isAuthenticated = authService.isAuthenticated();
    set({ user, isAuthenticated, isLoading: false });
  },
}));