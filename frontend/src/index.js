import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import createRoot from react-dom/client
import { createRoot } from 'react-dom/client';

// Function to load Daily.co script dynamically
const loadDailyScript = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@daily-co/daily-js';
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Create root with createRoot
const root = createRoot(document.getElementById('root'));

// Function to render App after Daily.co script is loaded
const renderApp = async () => {
  try {
    await loadDailyScript(); // Wait for Daily.co script to load
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to load Daily.co script:', error);
  }
};

renderApp(); // Call renderApp to render the app

reportWebVitals(console.log); // Example of reporting web vitals to console
