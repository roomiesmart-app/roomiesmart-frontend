import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { RegisterProvider } from './context/RegisterContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RegisterProvider>
      <App />
    </RegisterProvider>
  </StrictMode>,
);