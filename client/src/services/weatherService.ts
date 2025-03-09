import { WeatherResponse, ForecastResponse } from "../types/weather";
import API_CONFIG from "../config/api";

// Types for the service
export interface City {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface ApiError extends Error {
  status?: number;
  isApiError: boolean;
}

// Cache implementation
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly cacheDuration: number;

  constructor(cacheDurationMinutes = API_CONFIG.CACHE_DURATION_MINUTES) {
    this.cacheDuration = cacheDurationMinutes * 60 * 1000;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    // Check if cache entry is still valid
    if (Date.now() - entry.timestamp < this.cacheDuration) {
      return entry.data as T;
    }
    
    // Remove expired entry
    this.cache.delete(key);
    return null;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }

  // Get all keys that match a pattern
  getKeysByPattern(pattern: string): string[] {
    return Array.from(this.cache.keys()).filter(key => key.startsWith(pattern));
  }
}

// Create a single cache instance
const apiCache = new ApiCache();

/**
 * Creates an API error with additional properties
 */
function createApiError(message: string, status?: number): ApiError {
  const error = new Error(message) as ApiError;
  error.isApiError = true;
  if (status) error.status = status;
  return error;
}

/**
 * Generic function to fetch data from the API with error handling
 */
async function fetchFromApi<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw createApiError(
        errorData.message || `API error: ${response.status} ${response.statusText}`,
        response.status
      );
    }
    
    return await response.json();
  } catch (error) {
    if ((error as ApiError).isApiError) throw error;
    
    throw createApiError(
      error instanceof Error ? error.message : 'Unknown error occurred while fetching data'
    );
  }
}

/**
 * Get current weather data for a location
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns Promise with weather data
 */
export async function getWeather(lat: string, lon: string): Promise<WeatherResponse> {
  const cacheKey = `weather-${lat}-${lon}`;
  const cachedData = apiCache.get<WeatherResponse>(cacheKey);
  
  // Return cached data if available
  if (cachedData) {
    return cachedData;
  }
  
  const url = `${API_CONFIG.WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_CONFIG.WEATHER_API_KEY}&units=${API_CONFIG.DEFAULT_UNITS}`;
  const data = await fetchFromApi<WeatherResponse>(url);
  
  // Cache the response
  apiCache.set(cacheKey, data);
  
  return data;
}

/**
 * Get forecast data for a location
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns Promise with forecast data
 */
export async function getForecast(lat: string, lon: string): Promise<ForecastResponse> {
  const cacheKey = `forecast-${lat}-${lon}`;
  const cachedData = apiCache.get<ForecastResponse>(cacheKey);
  
  // Return cached data if available
  if (cachedData) {
    return cachedData;
  }
  
  const url = `${API_CONFIG.WEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_CONFIG.WEATHER_API_KEY}&units=${API_CONFIG.DEFAULT_UNITS}`;
  const data = await fetchFromApi<ForecastResponse>(url);
  
  // Cache the response
  apiCache.set(cacheKey, data);
  
  return data;
}

/**
 * Get geocoding data for a location name
 * @param query - Location name to search for
 * @param forceRefresh - Whether to bypass cache
 * @returns Promise with geocoding data
 */
export async function getGeocode(query: string, forceRefresh = false): Promise<City[]> {
  // Normalize the query
  const normalizedQuery = query.toLowerCase().trim();
  
  // Check if this is a formatted city name (contains commas)
  if (normalizedQuery.includes(',') && !forceRefresh) {
    // First, check if we have an exact cache match for this formatted name
    const exactCacheKey = `geocode-${normalizedQuery}`;
    const exactCachedData = apiCache.get<City[]>(exactCacheKey);
    
    if (exactCachedData) {
      return exactCachedData;
    }
    
    // Try to find this exact query in all cached results
    const geocodeKeys = apiCache.getKeysByPattern('geocode-');
    for (const key of geocodeKeys) {
      const value = apiCache.get<City[]>(key);
      
      if (value && Array.isArray(value)) {
        // Check each city in the cached results
        for (const city of value) {
          const formattedName = formatCityName(city).toLowerCase();
          if (formattedName === normalizedQuery) {
            // Cache this formatted name for future use
            const result = [city];
            apiCache.set(exactCacheKey, result);
            return result;
          }
        }
      }
    }
    
    // If we get here, we couldn't find a match in the cache
    // Try to extract the city name from the formatted name for a simpler search
    const cityNameOnly = normalizedQuery.split(',')[0].trim();
    if (cityNameOnly !== normalizedQuery) {
      // Check if we have a cache for the simplified name
      const simpleCacheKey = `geocode-${cityNameOnly}`;
      const simpleCachedData = apiCache.get<City[]>(simpleCacheKey);
      
      if (simpleCachedData) {
        // Try to find a matching city in the cached results
        const matchingCity = simpleCachedData.find(city => {
          const formattedName = formatCityName(city).toLowerCase();
          return formattedName === normalizedQuery;
        });
        
        if (matchingCity) {
          return [matchingCity];
        }
      }
    }
  }
  
  const cacheKey = `geocode-${normalizedQuery}`;
  
  // Return cached data if it's still valid and not forcing refresh
  if (!forceRefresh) {
    const cachedData = apiCache.get<City[]>(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
  }
  
  const url = `${API_CONFIG.GEO_BASE_URL}/direct?q=${encodeURIComponent(query)}&limit=${API_CONFIG.GEO_RESULTS_LIMIT}&appid=${API_CONFIG.WEATHER_API_KEY}`;
  const data = await fetchFromApi<City[]>(url);
  
  if (!Array.isArray(data)) {
    throw createApiError('Invalid response format from geocoding API');
  }
  
  // Deduplicate results
  const uniqueCities: City[] = [];
  const cityKeys = new Set<string>();
  
  for (const city of data) {
    const key = `${city.name}-${city.state || ''}-${city.country}`;
    if (!cityKeys.has(key)) {
      cityKeys.add(key);
      uniqueCities.push(city);
    }
  }
  
  // Cache the deduplicated response
  apiCache.set(cacheKey, uniqueCities);
  
  return uniqueCities;
}

/**
 * Get weather icon URL
 * @param code - Weather icon code
 * @returns URL for the weather icon
 */
export function getWeatherIcon(code: string): string {
  return `${API_CONFIG.WEATHER_ICON_URL}/${code}@2x.png`;
}

/**
 * Format a city name with state and country
 * @param city - City object
 * @returns Formatted city name
 */
export function formatCityName(city: City): string {
  let formattedName = city.name;
  if (city.state) formattedName += `, ${city.state}`;
  if (city.country) formattedName += `, ${city.country}`;
  return formattedName;
}

/**
 * Clear the API cache
 */
export function clearCache(): void {
  apiCache.clear();
}

// Export the weather service as a single object
const weatherService = {
  getWeather,
  getForecast,
  getGeocode,
  getWeatherIcon,
  formatCityName,
  clearCache
};

export default weatherService; 