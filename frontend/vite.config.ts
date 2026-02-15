import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { reactRouter } from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
   plugins: [
      // react({
      //    babel: {
      //       plugins: [['babel-plugin-react-compiler']],
      //    },
      // }),
      tailwindcss(),
      reactRouter(),
      tsconfigPaths(),
   ],
   server: {
      proxy: {
         '/api/': {
            target: 'http://localhost:5000',
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path.replace(/^\/api/, ''),
         },
         '/uploads': {
            target: 'http://localhost:5000',
            changeOrigin: true,
            secure: false,
         },
      },
   },
});
