import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ForecastResponse } from "@/types/weather";
import { getWeatherIcon } from "@/lib/weather";

interface Props {
  forecast: ForecastResponse;
}

const Forecast: React.FC<Props> = ({ forecast }) => {
  // Get one forecast per day (every 24 hours)
  const dailyForecasts = forecast.list.filter((_: any, index: number) => index % 8 === 0).slice(0, 5);

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden bg-[hsl(var(--weather-card-bg))]">
      <CardHeader className="bg-[hsl(var(--card-background))] pb-2">
        <CardTitle className="text-lg sm:text-xl">5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-5 gap-2">
          {dailyForecasts.map((day, index) => (
            <div 
              key={day.dt} 
              className={`text-center p-2 ${index < 4 ? 'border-r border-border' : ''}`}
            >
              <div className="text-sm font-medium mb-1">
                {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                  weekday: "short"
                })}
              </div>
              <img
                src={getWeatherIcon(day.weather[0].icon)}
                alt={day.weather[0].description}
                className="w-10 h-10 mx-auto"
              />
              <div className="text-sm font-medium mt-1">
                {Math.round(day.main.temp)}°C
              </div>
              <div className="text-xs text-muted-foreground capitalize truncate">
                {day.weather[0].description}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Forecast;