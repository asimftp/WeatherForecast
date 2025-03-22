import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import weatherService from "@/services/weatherService";
import { ForecastResponse } from "@/types/weather";
import { format } from "date-fns";

interface Props {
    forecast: ForecastResponse;
}

/**
 * Filters forecast data to get one forecast per day (every 24 hours).
 */
const getDailyForecasts = (forecast: ForecastResponse) => {
    return forecast.list.filter((_, index) => index % 8 === 0).slice(0, 5);
};

/**
 * Displays a 5-day weather forecast.
 */
const Forecast: React.FC<Props> = ({ forecast }) => {
    const dailyForecasts = getDailyForecasts(forecast);

    // Memoized forecast items for performance
    const forecastItems = dailyForecasts.map((day, index) => {
        const { dt, main, weather } = day;
        const formattedDay = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
            new Date(dt * 1000)
        );
        const weatherIcon = weatherService.getWeatherIcon(weather[0].icon);
        const temperature = Math.round(main.temp);
        const weatherDescription = weather[0].description;

        return (
            <div
                key={dt}
                className={`text-center p-2 ${index < 4 ? "border-r border-border" : ""}`}
            >
                <div className="text-sm font-medium mb-1">{formattedDay}</div>
                <img src={weatherIcon} alt={weatherDescription} className="w-10 h-10 mx-auto" />
                <div className="text-sm font-medium mt-1">{temperature}°C</div>
                <div className="text-xs text-muted-foreground capitalize truncate">{weatherDescription}</div>
            </div>
        );
    });

    return (
        <Card className="w-full max-w-md mx-auto overflow-hidden bg-[hsl(var(--weather-card-bg))]">
            <CardHeader className="bg-[hsl(var(--card-background))] pb-2">
                <CardTitle className="text-lg sm:text-xl">5-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="grid grid-cols-5 gap-2">{forecastItems}</div>
            </CardContent>
        </Card>
    );
};

export default Forecast;
