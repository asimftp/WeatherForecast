import type { Express, Request, Response, RequestHandler } from "express";
import { createServer } from "http";
import { weatherResponseSchema, forecastResponseSchema } from "../client/src/types/weather";
import { z } from "zod";
import API_CONFIG from "../client/src/config/api";

// Validation schema for coordinates
const coordinatesSchema = z.object({
  lat: z.string().refine(val => !isNaN(parseFloat(val)), {
    message: "Latitude must be a valid number"
  }),
  lon: z.string().refine(val => !isNaN(parseFloat(val)), {
    message: "Longitude must be a valid number"
  })
});

/**
 * Handles API errors and sends appropriate response
 */
function handleApiError(res: Response, error: unknown) {
  console.error('API error:', error);
  
  if (error instanceof z.ZodError) {
    res.status(400).json({ 
      error: "Validation error", 
      details: error.errors 
    });
    return;
  }
  
  const message = error instanceof Error ? error.message : "An unknown error occurred";
  res.status(500).json({ error: message });
}

/**
 * Fetches data from the OpenWeather API
 */
async function fetchFromWeatherApi<T>(endpoint: string, params: Record<string, string>, schema: z.ZodType<T>): Promise<T> {
  const queryParams = new URLSearchParams({
    ...params,
    appid: API_CONFIG.WEATHER_API_KEY,
    units: API_CONFIG.DEFAULT_UNITS
  });
  
  const url = `${API_CONFIG.WEATHER_BASE_URL}/${endpoint}?${queryParams.toString()}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  const result = schema.safeParse(data);
  
  if (!result.success) {
    throw new Error("Invalid data format received from API");
  }
  
  return result.data;
}

// Weather endpoint handler
const getWeatherHandler: RequestHandler = async (req, res) => {
  try {
    // Validate request parameters
    const result = coordinatesSchema.safeParse(req.query);
    
    if (!result.success) {
      res.status(400).json({ 
        error: "Invalid parameters", 
        details: result.error.errors 
      });
      return;
    }
    
    const { lat, lon } = result.data;
    const data = await fetchFromWeatherApi(
      "weather", 
      { lat, lon }, 
      weatherResponseSchema
    );
    
    res.json(data);
  } catch (error) {
    handleApiError(res, error);
  }
};

// Forecast endpoint handler
const getForecastHandler: RequestHandler = async (req, res) => {
  try {
    // Validate request parameters
    const result = coordinatesSchema.safeParse(req.query);
    
    if (!result.success) {
      res.status(400).json({ 
        error: "Invalid parameters", 
        details: result.error.errors 
      });
      return;
    }
    
    const { lat, lon } = result.data;
    const data = await fetchFromWeatherApi(
      "forecast", 
      { lat, lon }, 
      forecastResponseSchema
    );
    
    res.json(data);
  } catch (error) {
    handleApiError(res, error);
  }
};

export async function registerRoutes(app: Express) {
  // Register routes
  app.get("/api/weather", getWeatherHandler);
  app.get("/api/forecast", getForecastHandler);

  return createServer(app);
}