import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherResponse } from "@/types/weather";
import { getWeatherIcon } from "@/lib/weather";
import { Thermometer, Droplets, Wind } from "lucide-react";

interface Props {
  weather: WeatherResponse;
}

export function CurrentWeather({ weather }: Props) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{weather.name}</span>
          <img
            src={getWeatherIcon(weather.weather[0].icon)}
            alt={weather.weather[0].description}
            className="w-16 h-16"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold mb-4">
          {Math.round(weather.main.temp)}°C
        </div>
        <div className="text-muted-foreground mb-4">
          {weather.weather[0].description}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-yellow-500" />
            <div>
              <div className="text-sm">Feels like</div>
              <div>{Math.round(weather.main.feels_like)}°C</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <div>
              <div className="text-sm">Humidity</div>
              <div>{weather.main.humidity}%</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-gray-500" />
            <div>
              <div className="text-sm">Wind</div>
              <div>{Math.round(weather.wind.speed)} m/s</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}