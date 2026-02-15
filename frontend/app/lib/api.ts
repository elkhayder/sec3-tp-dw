import axios from 'axios';

export type Event = {
   id: number;
   userId: number;
   title: string;
   description: string;
   imageUrl: string;
   date: string;
   capacity: number;
   address: string;
   createdAt: string;
   updatedAt: string;

   reservationsCount: number;
   isRegistered: boolean;
   user?: { id: number; name: string; username: string };
};

export const api = axios.create({
   baseURL: '/api',
});

api.interceptors.request.use((config) => {
   const token = localStorage.getItem('token');
   if (token) {
      config.headers!['Authorization'] = `Bearer ${token}`;
   }
   return config;
});
