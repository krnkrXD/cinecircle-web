// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// @ts-ignore
import { AuthProvider } from "./context/AuthContext";
// @ts-ignore
import { ToastProvider } from "./context/ToastContext";
// @ts-ignore
import ErrorBoundary from "./components/ErrorBoundary";
// @ts-ignore
import "../src/index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
