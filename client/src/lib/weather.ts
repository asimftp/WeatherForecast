import { WeatherResponse, ForecastResponse } from "../types/weather";

export async function getWeather(lat: string, lon: string): Promise<WeatherResponse> {
  const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch weather");
  }
  return res.json();
}

export async function getForecast(lat: string, lon: string): Promise<ForecastResponse> {
  const res = await fetch(`/api/forecast?lat=${lat}&lon=${lon}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch forecast");
  }
  return res.json();
}

export function getWeatherIcon(code: string) {
  return `https://openweathermap.org/img/wn/${code}@2x.png`;
}