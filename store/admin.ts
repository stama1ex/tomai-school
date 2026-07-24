'use client';

import { create } from 'zustand';

interface LoginResult {
  success: boolean;
  error?: string;
}

interface AdminState {
  isAdmin: boolean;
  username: string | null;
  hydrated: boolean;
  login: (login: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAdminStore = create<AdminState>()((set) => ({
  isAdmin: false,
  username: null,
  hydrated: false,

  login: async (login, password) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        set({ isAdmin: true, username: data.username ?? login, hydrated: true });
        return { success: true };
      }

      return {
        success: false,
        error:
          typeof data.error === 'string' ? data.error : 'Неверный логин или пароль',
      };
    } catch {
      return { success: false, error: 'Не удалось связаться с сервером' };
    }
  },

  logout: async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } finally {
      set({ isAdmin: false, username: null });
    }
  },

  hydrate: async () => {
    try {
      const res = await fetch('/api/me');
      const data = await res.json();
      set({
        isAdmin: !!data.isAdmin,
        username: data.username ?? null,
        hydrated: true,
      });
    } catch {
      set({ isAdmin: false, username: null, hydrated: true });
    }
  },
}));
