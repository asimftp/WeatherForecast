import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../public/styles/global.css";
import { Router } from "wouter";

// Get base path from your package.json homepage (for GitHub Pages)
const getBasePath = () => {
  // Check if we're in production mode
  if (import.meta.env.PROD) {
    // Extract base path from the pathname segment of the URL
    const basePath = location.pathname.split('/').filter(Boolean)[0];
    return basePath ? `/${basePath}` : '';
  }
  return '';
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router base={getBasePath()}>
      <App />
    </Router>
  </React.StrictMode>
);
