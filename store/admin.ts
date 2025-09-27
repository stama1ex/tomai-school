'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  isAdmin: boolean;
  login: (login: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAdmin: false,
      login: async (login, password) => {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ login, password }),
        });

        if (res.ok) {
          set({ isAdmin: true });
          return true;
        }

        return false;
      },
      logout: () => set({ isAdmin: false }),
    }),
    {
      name: 'admin-storage',
    }
  )
);
