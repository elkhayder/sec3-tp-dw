import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/styles.css';

import { Login } from './App';

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <Login />
   </StrictMode>
);
