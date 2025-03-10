import { WeatherResponse, ForecastResponse } from "../types/weather";

// Environment variables or configuration should be used for API keys
// Consider moving this to an environment variable in a production app
const API_KEY = "60a689a67061620d8093314c1fd9ec6c";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Improved cache implementation with type safety
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly cacheDuration: number;

  constructor(cacheDurationMinutes = 10) {
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
 * Get weather data for a location
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
  
  try {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || `Failed to fetch weather data: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Cache the response
    apiCache.set(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error('Weather API error:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Unknown error occurred while fetching weather data');
  }
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
  
  try {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || `Failed to fetch forecast data: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Cache the response
    apiCache.set(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error('Forecast API error:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Unknown error occurred while fetching forecast data');
  }
}

/**
 * Get geocoding data for a location name
 * @param query - Location name to search for
 * @param forceRefresh - Whether to bypass cache
 * @returns Promise with geocoding data
 */
export async function getGeocode(query: string, forceRefresh = false): Promise<Array<{
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}>> {
  // Normalize the query
  const normalizedQuery = query.toLowerCase().trim();
  
  // Check if this is a formatted city name (contains commas)
  if (normalizedQuery.includes(',') && !forceRefresh) {
    // First, check if we have an exact cache match for this formatted name
    const exactCacheKey = `geocode-${normalizedQuery}`;
    const exactCachedData = apiCache.get<Array<{
      name: string;
      lat: number;
      lon: number;
      country: string;
      state?: string;
    }>>(exactCacheKey);
    
    if (exactCachedData) {
      return exactCachedData;
    }
    
    // Try to find this exact query in all cached results
    const geocodeKeys = apiCache.getKeysByPattern('geocode-');
    for (const key of geocodeKeys) {
      const value = apiCache.get<Array<{
        name: string;
        lat: number;
        lon: number;
        country: string;
        state?: string;
      }>>(key);
      
      if (value && Array.isArray(value)) {
        // Check each city in the cached results
        for (const city of value) {
          const formattedName = `${city.name}${city.state ? `, ${city.state}` : ''}${city.country ? `, ${city.country}` : ''}`.toLowerCase();
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
      const simpleCachedData = apiCache.get<Array<{
        name: string;
        lat: number;
        lon: number;
        country: string;
        state?: string;
      }>>(simpleCacheKey);
      
      if (simpleCachedData) {
        // Try to find a matching city in the cached results
        const matchingCity = simpleCachedData.find(city => {
          const formattedName = `${city.name}${city.state ? `, ${city.state}` : ''}${city.country ? `, ${city.country}` : ''}`.toLowerCase();
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
    const cachedData = apiCache.get<Array<{
      name: string;
      lat: number;
      lon: number;
      country: string;
      state?: string;
    }>>(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
  }
  
  try {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
    const res = await fetch(url);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || `Failed to fetch location data: ${res.status}`);
    }
    
    const data = await res.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format from geocoding API');
    }
    
    // Cache the response
    apiCache.set(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error('Geocode API error:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Unknown error occurred while fetching geocode data');
  }
}

/**
 * Get weather icon URL
 * @param code - Weather icon code
 * @returns URL for the weather icon
 */
export function getWeatherIcon(code: string): string {
  return `https://openweathermap.org/img/wn/${code}@2x.png`;
}