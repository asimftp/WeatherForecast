/**
 * API Configuration
 * apiConfig.js
 * Stores API-related settings, including base URLs, request configurations,
 * and cache settings. API keys are now stored in the .env file.
 */

export const API_CONFIG = {
    WEATHER_API_KEY: import.meta.env.VITE_WEATHER_API_KEY, // Use `process.env.` if using Create React App
    WEATHER_BASE_URL: import.meta.env.VITE_WEATHER_BASE_URL,
    GEO_BASE_URL: import.meta.env.VITE_GEO_BASE_URL,
    WEATHER_ICON_URL: import.meta.env.VITE_WEATHER_ICON_URL,

    // Cache settings (in minutes)
    CACHE_DURATION_MIN: Number(import.meta.env.VITE_CACHE_DURATION_MINUTES) || 10,

    // API request settings
    DEFAULT_UNITS: import.meta.env.VITE_DEFAULT_UNITS || "metric",
    GEO_RESULTS_LIMIT: Number(import.meta.env.VITE_GEO_RESULTS_LIMIT) || 5,
};
