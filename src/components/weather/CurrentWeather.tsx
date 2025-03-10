import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { WeatherResponse } from "@/types/weather";
import { getWeatherIcon } from "@/utils/weatherHelpers";
import { Thermometer, Droplets, Wind } from "lucide-react";

interface Props {
  weather: WeatherResponse;
  selectedCityName?: string | null;
}

export function CurrentWeather({ weather, selectedCityName }: Props) {
  // Use the selected city name if available, otherwise fall back to the API response name
  const displayName = selectedCityName || weather.name;
  
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden bg-[hsl(var(--weather-card-bg))]">
      <CardHeader className="bg-[hsl(var(--card-background))] pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg sm:text-xl">{displayName}</span>
          <img
            src={getWeatherIcon(weather.weather[0].icon)}
            alt={weather.weather[0].description}
            className="w-12 h-12 sm:w-16 sm:h-16"
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4">
          {Math.round(weather.main.temp)}°C
        </div>
        <div className="text-muted-foreground mb-4 capitalize">
          {weather.weather[0].description}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="flex items-center gap-2 p-2 border-b sm:border-b-0 sm:border-r border-border">
            <Thermometer className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
            <div>
              <div className="text-xs sm:text-sm text-muted-foreground">Feels like</div>
              <div className="font-medium">{Math.round(weather.main.feels_like)}°C</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 border-b sm:border-b-0 sm:border-r border-border">
            <Droplets className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <div>
              <div className="text-xs sm:text-sm text-muted-foreground">Humidity</div>
              <div className="font-medium">{weather.main.humidity}%</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2">
            <Wind className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <div>
              <div className="text-xs sm:text-sm text-muted-foreground">Wind</div>
              <div className="font-medium">{Math.round(weather.wind.speed)} m/s</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}