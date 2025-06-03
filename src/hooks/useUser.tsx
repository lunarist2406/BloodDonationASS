import { create } from 'zustand';

interface User {
  user_id: string;
  fullname: string;
  email: string;
  role_name: string;
}

interface UserStore {
  token: string | null;
  user: User | null;
  setAuthToken: (token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  hasRole: (role: string) => boolean;
}

export const useUser = create<UserStore>((set, get) => ({
  token: null,
  user: null,
  setAuthToken: (token) => {
    console.log('Đang cài đặt token:', token);
    set({ token });
  },
  setUser: (user) => {
    console.log('Đang cài đặt thông tin người dùng:', user);
    set({ user });
  },
  clearAuth: () => set({ token: null, user: null }),
  isAuthenticated: () => {
    const state = get();
    return !!state.token && !!state.user;
  },
  hasRole: (role) => {
    const state = get();
    return state.user?.role_name === role;
  }
}));