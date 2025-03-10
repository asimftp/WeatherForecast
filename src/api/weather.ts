/**
 * API configuration
 */
export const API_CONFIG = {
  // OpenWeatherMap API key
  WEATHER_API_KEY: "60a689a67061620d8093314c1fd9ec6c",
  
  // API base URLs
  WEATHER_BASE_URL: "https://api.openweathermap.org/data/2.5",
  GEO_BASE_URL: "https://api.openweathermap.org/geo/1.0",
  
  // Cache configuration
  CACHE_DURATION_MINUTES: 10,
  
  // API request configuration
  DEFAULT_UNITS: "metric",
  GEO_RESULTS_LIMIT: 5,
  
  // Weather icon URL
  WEATHER_ICON_URL: "https://openweathermap.org/img/wn"
};

export default API_CONFIG; 