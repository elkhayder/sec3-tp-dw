import { create } from 'zustand';

export type User = {
   id: number;
   name: string;
   username: string;
};

type AuthStore = {
   token: string | null;
   setToken: (token: string | null) => void;

   user: User | null;
   setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
   token: null,
   user: null,

   setToken: (token) => set({ token }),
   setUser: (user) => set({ user }),
}));
