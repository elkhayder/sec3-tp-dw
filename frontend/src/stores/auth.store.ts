import { create } from 'zustand';

type AuthStore = {
   token: string | null;
   user: { id: number; username: string } | null;
   setAuth: (token: string, user: { id: number; username: string }) => void;
   clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
   token: null,
   user: null,
   setAuth: (token, user) =>
      set(() => ({
         token,
         user,
      })),
   clearAuth: () =>
      set(() => ({
         token: null,
         user: null,
      })),
}));
