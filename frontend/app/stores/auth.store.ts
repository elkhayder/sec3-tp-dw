import { create } from 'zustand';

export type User = {
   id: number;
   username: string;
};

type AuthStore = {
   isInitialized: boolean;
   setIsInitialized: (value: boolean) => void;

   token: string | null;
   setToken: (token: string | null) => void;

   user: User | null;
   setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
   token: null,
   user: null,
   isInitialized: false,

   setToken: (token) => set({ token }),
   setUser: (user) => set({ user }),
   setIsInitialized: (value) => set({ isInitialized: value }),
}));
