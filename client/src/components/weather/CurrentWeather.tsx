import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { getWeatherIcon } from '@/lib/weather';

interface CurrentWeatherProps {
  weather: any;
}

function CurrentWeather({ weather }: CurrentWeatherProps) {
  return (
    <Card className="mb-4 weather-card">
      <CardHeader>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{weather.name}</h5>
          <img
            src={getWeatherIcon(weather.weather[0].icon)}
            alt={weather.weather[0].description}
            className="weather-icon"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-3">
          <h2 className="mb-0">{Math.round(weather.main.temp)}°C</h2>
          <p className="text-capitalize text-muted mb-0">
            {weather.weather[0].description}
          </p>
        </div>
        
        <div className="row text-center mt-3">
          <div className="col-4">
            <div className="d-flex flex-column">
              <small className="text-muted">Feels Like</small>
              <span>{Math.round(weather.main.feels_like)}°C</span>
            </div>
          </div>
          <div className="col-4">
            <div className="d-flex flex-column">
              <small className="text-muted">Humidity</small>
              <span>{weather.main.humidity}%</span>
            </div>
          </div>
          <div className="col-4">
            <div className="d-flex flex-column">
              <small className="text-muted">Wind</small>
              <span>{Math.round(weather.wind.speed)} m/s</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CurrentWeather; 