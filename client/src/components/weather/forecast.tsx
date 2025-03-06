import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ForecastResponse } from "@/types/weather";
import { getWeatherIcon } from "@/lib/weather";

interface Props {
  forecast: ForecastResponse;
}

export function Forecast({ forecast }: Props) {
  // Get one forecast per day (every 24 hours)
  const dailyForecasts = forecast.list.filter((_: any, index: number) => index % 8 === 0).slice(0, 5);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {dailyForecasts.map((day) => (
            <div key={day.dt} className="text-center">
              <div className="text-sm mb-1">
                {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                  weekday: "short"
                })}
              </div>
              <img
                src={getWeatherIcon(day.weather[0].icon)}
                alt={day.weather[0].description}
                className="w-10 h-10 mx-auto"
              />
              <div className="text-sm font-medium">
                {Math.round(day.main.temp)}°C
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}