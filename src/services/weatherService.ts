import { WeatherResponse, ForecastResponse } from "../types/weather";
import { API_CONFIG } from "../config/api";

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

    constructor(cacheDurationMinutes = API_CONFIG.CACHE_DURATION_MIN) {
        this.cacheDuration = cacheDurationMinutes * 60 * 1000;
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry || Date.now() - entry.timestamp >= this.cacheDuration) {
            this.cache.delete(key);
            return null;
        }
        return entry.data as T;
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
            throw createApiError(errorData.message || `API error: ${response.status} ${response.statusText}`, response.status);
        }
        return await response.json();
    } catch (error) {
        throw createApiError(error instanceof Error ? error.message : "Unknown API error");
    }
}

/**
 * Normalize a query string by converting it to lowercase and trimming spaces
 */
function normalizeQuery(query: string): string {
    return query.toLowerCase().trim();
}

/**
 * Deduplicates city results
 */
function deduplicateCities(data: City[]): City[] {
    const uniqueCities: City[] = [];
    const cityKeys = new Set<string>();

    for (const city of data) {
        const key = `${city.name}-${city.state || ''}-${city.country}`;
        if (!cityKeys.has(key)) {
            cityKeys.add(key);
            uniqueCities.push(city);
        }
    }
    return uniqueCities;
}

/**
 * Get current weather data for a location
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
    apiCache.set(cacheKey, data);
    return data;
}

/**
 * Get forecast data for a location
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
    apiCache.set(cacheKey, data);
    return data;
}

/**
 * Get geocoding data for a location name
 */
export async function getGeocode(query: string, forceRefresh = false): Promise<City[]> {
    const normalizedQuery = normalizeQuery(query);

    if (!forceRefresh) {
        const cachedData = apiCache.get<City[]>(`geocode-${normalizedQuery}`);
        if (cachedData) return cachedData;
    }

    const url = `${API_CONFIG.GEO_BASE_URL}/direct?q=${encodeURIComponent(query)}&limit=${API_CONFIG.GEO_RESULTS_LIMIT}&appid=${API_CONFIG.WEATHER_API_KEY}`;
    const data = await fetchFromApi<City[]>(url);

    if (!Array.isArray(data)) throw createApiError("Invalid response format from geocoding API");

    const uniqueCities = deduplicateCities(data);
    apiCache.set(`geocode-${normalizedQuery}`, uniqueCities);
    return uniqueCities;
}

/**
 * Get weather icon URL
 */
export function getWeatherIcon(code: string): string {
    return `${API_CONFIG.WEATHER_ICON_URL}/${code}@2x.png`;
}

/**
 * Format a city name with state and country
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