import { useEffect, useState } from 'react';
import { api } from '~/lib/api';
import { useAuthStore } from '~/stores/auth.store';

export const useTokenPersistence = () => {
   const authStore = useAuthStore();
   const [isInitialized, setIsInitialized] = useState(false);

   // Session restoration
   useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
         setIsInitialized(true);
         return;
      }

      api.get('/auth/me')
         .then((response) => {
            const data = response.data;
            authStore.setToken(token);
            authStore.setUser(data.user);
         })
         .catch(() => {
            localStorage.removeItem('token');
         })
         .finally(() => {
            setIsInitialized(true);
         });
   }, []);

   // Token persistence
   useEffect(() => {
      if (!isInitialized) return;

      localStorage.setItem('token', authStore.token || '');
   }, [authStore.token, isInitialized]);

   return { isInitialized };
};
