import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Search } from "@/components/weather/search";
import { CurrentWeather } from "@/components/weather/current";
import { Forecast } from "@/components/weather/forecast";
import { getWeather, getForecast } from "@/lib/weather";

export default function Home() {
  const [coords, setCoords] = useState<{lat: string; lon: string} | null>(null);

  const weather = useQuery({
    queryKey: ["/api/weather", coords?.lat, coords?.lon],
    queryFn: () => coords ? getWeather(coords.lat, coords.lon) : null,
    enabled: !!coords
  });

  const forecast = useQuery({
    queryKey: ["/api/forecast", coords?.lat, coords?.lon],
    queryFn: () => coords ? getForecast(coords.lat, coords.lon) : null,
    enabled: !!coords
  });

  const handleSearch = (lat: string, lon: string) => {
    setCoords({ lat, lon });
  };

  return (
    <div className="min-h-screen bg-[#F6F9FC] p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#2C3E50]">
          Weather Forecast
        </h1>

        <Search onSearch={handleSearch} />

        {weather.isLoading || forecast.isLoading ? (
          <Card className="w-full max-w-md mx-auto p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </Card>
        ) : weather.error || forecast.error ? (
          <Card className="w-full max-w-md mx-auto p-6 text-center text-red-500">
            {(weather.error as Error)?.message || (forecast.error as Error)?.message || "Error loading weather data"}
          </Card>
        ) : weather.data && forecast.data ? (
          <>
            <CurrentWeather weather={weather.data} />
            <Forecast forecast={forecast.data} />
          </>
        ) : null}
      </div>
    </div>
  );
}