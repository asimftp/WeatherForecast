import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { WeatherResponse } from "@/types/weather";
import weatherService from "@/services/weatherService";
import { Thermometer, Droplets, Wind } from "lucide-react";

interface Props {
    weather: WeatherResponse;
    selectedCityName?: string | null;
}

/**
 * Displays current weather details including temperature, humidity, and wind speed.
 */
export function CurrentWeather({ weather, selectedCityName }: Props) {
    // Extract necessary weather data
    const displayName = selectedCityName || weather.name;
    const temp = Math.round(weather.main.temp);
    const feelsLike = Math.round(weather.main.feels_like);
    const humidity = weather.main.humidity;
    const windSpeed = Math.round(weather.wind.speed);
    const weatherIcon = weatherService.getWeatherIcon(weather.weather[0].icon);
    const weatherDescription = weather.weather[0].description;

    // Memoized weather details
    const weatherDetails = [
        {
            icon: <Thermometer className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />,
            label: "Feels like",
            value: `${feelsLike}°C`,
        },
        {
            icon: <Droplets className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
            label: "Humidity",
            value: `${humidity}%`,
        },
        {
            icon: <Wind className="h-5 w-5 text-gray-500 dark:text-gray-400" />,
            label: "Wind",
            value: `${windSpeed} m/s`,
        },
    ];

    return (
        <Card className="w-full max-w-md mx-auto overflow-hidden bg-[hsl(var(--weather-card-bg))]">
            <CardHeader className="bg-[hsl(var(--card-background))] pb-2">
                <CardTitle className="flex items-center justify-between">
                    <span className="text-lg sm:text-xl">{displayName}</span>
                    <img
                        src={weatherIcon}
                        alt={`Weather icon representing ${weatherDescription}`}
                        className="w-12 h-12 sm:w-16 sm:h-16"
                    />
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-4">
                <div className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4">
                    {temp}°C
                </div>
                <div className="text-muted-foreground mb-4 capitalize">
                    {weatherDescription}
                </div>

                {/* Weather Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {weatherDetails.map(({ icon, label, value }, index) => (
                        <div
                            key={label}
                            className={`flex items-center gap-2 p-2 border-border ${index < weatherDetails.length - 1 ? "border-b sm:border-b-0 sm:border-r" : ""
                                }`}
                        >
                            {icon}
                            <div>
                                <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
                                <div className="font-medium">{value}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
