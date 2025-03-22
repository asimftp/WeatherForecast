import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card } from "@/components/common/Card";
import { CurrentWeather } from "@/components/weather/CurrentWeather";
import Forecast from "@/components/weather/Forecast";
import { useWeather } from "@/hooks/useWeatherData";

interface HomeProps {
    searchParams: { lat: string; lon: string; cityName?: string } | null;
    onSearch: (lat: string, lon: string, cityName?: string) => void;
}

/**
 * Home page component - Displays current weather and forecast
 */
const Home: React.FC<HomeProps> = ({ searchParams, onSearch }) => {
    const [coords, setCoords] = useState<{ lat: string; lon: string } | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedCityName, setSelectedCityName] = useState<string | null>(null);

    // Update coordinates when searchParams change
    useEffect(() => {
        if (searchParams) {
            setCoords({ lat: searchParams.lat, lon: searchParams.lon });
            setHasSearched(true);

            // Update the selected city name if provided
            if (searchParams.cityName) {
                setSelectedCityName(searchParams.cityName);
            }
        }
    }, [searchParams]);

    // Fetch weather data using custom hook
    const { weather, forecast, isLoading, isError, error } = useWeather(
        coords?.lat,
        coords?.lon,
        { enabled: !!coords && hasSearched }
    );

    // Custom search handler to track the selected city name
    const handleSearch = useCallback(
        (lat: string, lon: string, cityName?: string) => {
            if (cityName) setSelectedCityName(cityName);
            onSearch(lat, lon, cityName);
        },
        [onSearch]
    );

    // Memoized UI rendering logic
    const renderContent = useMemo(() => {
        if (!hasSearched) {
            return (
                <div className="text-center py-6 sm:py-8">
                    <h2 className="text-lg sm:text-xl font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Welcome to Weather Forecast
                    </h2>
                    <p className="text-muted-foreground">Use the search bar above to find weather for any city</p>
                        </div>
            );
        }

        if (isLoading) {
            return (
                <Card className="w-full max-w-md mx-auto p-4 sm:p-6 bg-[hsl(var(--weather-card-bg))]">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-8 bg-muted rounded w-1/2"></div>
                        <div className="h-4 bg-muted rounded w-full"></div>
                            </div>
                    </Card>
            );
        }

        if (isError) {
            return (
                <Card className="w-full max-w-md mx-auto p-4 sm:p-6 text-center text-destructive bg-[hsl(var(--weather-card-bg))]">
                    {error?.message || "Error loading weather data"}
                </Card>
            );
        }

        if (weather.data && forecast.data) {
            return (
                <div className="space-y-4 sm:space-y-6">
                    <CurrentWeather weather={weather.data} selectedCityName={selectedCityName} />
                    <Forecast forecast={forecast.data} />
                </div>
            );
        }

        return (
            <div className="text-center py-6 sm:py-8">
                <h2 className="text-lg sm:text-xl font-medium mb-2 text-gray-700 dark:text-gray-300">
                    No results found
                </h2>
                <p className="text-muted-foreground">Try searching for a different city using the search bar above</p>
            </div>
        );
    }, [hasSearched, isLoading, isError, error, weather.data, forecast.data, selectedCityName]);

    return (
        <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 min-h-full">
            <div className="max-w-4xl mx-auto">{renderContent}</div>
        </div>
    );
};

export default React.memo(Home);