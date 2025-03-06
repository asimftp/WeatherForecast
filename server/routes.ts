import type { Express } from "express";
import { createServer } from "http";
import { weatherResponseSchema, forecastResponseSchema } from "../client/src/types/weather";

// Use the API key directly for debugging
const WEATHER_API_KEY = "60a689a67061620d8093314c1fd9ec6c";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function registerRoutes(app: Express) {
  app.get("/api/weather", async (req, res) => {
    try {
      const { lat, lon } = req.query;

      // Validate coordinates
      if (!lat || !lon || typeof lat !== 'string' || typeof lon !== 'string') {
        res.status(400).json({ error: "Missing or invalid coordinates" });
        return;
      }

      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      if (isNaN(latitude) || isNaN(longitude)) {
        res.status(400).json({ error: "Invalid coordinate values" });
        return;
      }

      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Weather API error:', errorData);
        throw new Error(errorData.message || 'Weather API error');
      }

      const data = await response.json();
      const result = weatherResponseSchema.safeParse(data);

      if (!result.success) {
        console.error('Weather API schema validation error:', result.error);
        res.status(500).json({ error: "Invalid weather data format received from API" });
        return;
      }

      res.json(result.data);
    } catch (error) {
      console.error('Weather fetch error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to fetch weather data"
      });
    }
  });

  app.get("/api/forecast", async (req, res) => {
    try {
      const { lat, lon } = req.query;

      // Validate coordinates
      if (!lat || !lon || typeof lat !== 'string' || typeof lon !== 'string') {
        res.status(400).json({ error: "Missing or invalid coordinates" });
        return;
      }

      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      if (isNaN(latitude) || isNaN(longitude)) {
        res.status(400).json({ error: "Invalid coordinate values" });
        return;
      }

      const response = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Forecast API error:', errorData);
        throw new Error(errorData.message || 'Forecast API error');
      }

      const data = await response.json();
      const result = forecastResponseSchema.safeParse(data);

      if (!result.success) {
        console.error('Forecast API schema validation error:', result.error);
        res.status(500).json({ error: "Invalid forecast data format received from API" });
        return;
      }

      res.json(result.data);
    } catch (error) {
      console.error('Forecast fetch error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to fetch forecast data"
      });
    }
  });

  return createServer(app);
}