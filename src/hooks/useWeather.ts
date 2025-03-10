import { useQuery } from "@tanstack/react-query";
import weatherService from "../services/weatherService";
import { WeatherResponse, ForecastResponse } from "../types/weather";

interface WeatherQueryOptions {
  enabled?: boolean;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
}

interface WeatherHookResult {
  weather: {
    data: WeatherResponse | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<WeatherResponse | null>;
  };
  forecast: {
    data: ForecastResponse | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<ForecastResponse | null>;
  };
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Custom hook for fetching weather and forecast data
 * 
 * @param lat - Latitude
 * @param lon - Longitude
 * @param options - Query options
 * @returns Weather and forecast data with loading and error states
 */
export function useWeather(
  lat?: string, 
  lon?: string, 
  options: WeatherQueryOptions = {}
): WeatherHookResult {
  // Default options
  const defaultOptions = {
    enabled: !!lat && !!lon,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    ...options
  };

  // Weather query
  const weatherQuery = useQuery<WeatherResponse | null, Error>({
    queryKey: ["weather", lat, lon],
    queryFn: async () => {
      if (!lat || !lon) return null;
      return await weatherService.getWeather(lat, lon);
    },
    ...defaultOptions
  });

  // Forecast query
  const forecastQuery = useQuery<ForecastResponse | null, Error>({
    queryKey: ["forecast", lat, lon],
    queryFn: async () => {
      if (!lat || !lon) return null;
      return await weatherService.getForecast(lat, lon);
    },
    ...defaultOptions
  });

  // Combined result
  return {
    weather: {
      data: weatherQuery.data ?? null,
      isLoading: weatherQuery.isLoading,
      error: weatherQuery.error || null,
      refetch: async () => {
        const result = await weatherQuery.refetch();
        return result.data ?? null;
      }
    },
    forecast: {
      data: forecastQuery.data ?? null,
      isLoading: forecastQuery.isLoading,
      error: forecastQuery.error || null,
      refetch: async () => {
        const result = await forecastQuery.refetch();
        return result.data ?? null;
      }
    },
    isLoading: weatherQuery.isLoading || forecastQuery.isLoading,
    isError: weatherQuery.isError || forecastQuery.isError,
    error: weatherQuery.error || forecastQuery.error || null
  };
}

/**
 * Custom hook for geocoding search
 * 
 * @param query - Search query
 * @param options - Query options
 * @returns Geocoding data with loading and error states
 */
export function useGeocode(query: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["geocode", query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      return await weatherService.getGeocode(query);
    },
    enabled: !!query && query.length >= 2 && (options.enabled !== false),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export default useWeather; 