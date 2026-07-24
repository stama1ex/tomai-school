'use client';

import { create } from 'zustand';

interface AdminState {
  isAdmin: boolean;
  username: string | null;
  hydrated: boolean;
  setAuthenticated: (username: string) => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAdminStore = create<AdminState>()((set) => ({
  isAdmin: false,
  username: null,
  hydrated: false,

  setAuthenticated: (username) => set({ isAdmin: true, username, hydrated: true }),

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
