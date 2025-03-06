import { z } from "zod";

// Weather response schema
export const weatherResponseSchema = z.object({
  name: z.string(),
  weather: z.array(z.object({
    description: z.string(),
    icon: z.string()
  })),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    humidity: z.number()
  }),
  wind: z.object({
    speed: z.number()
  })
});

// Forecast response schema
export const forecastResponseSchema = z.object({
  list: z.array(z.object({
    dt: z.number(),
    main: z.object({
      temp: z.number()
    }),
    weather: z.array(z.object({
      description: z.string(),
      icon: z.string()
    }))
  }))
});

export type WeatherResponse = z.infer<typeof weatherResponseSchema>;
export type ForecastResponse = z.infer<typeof forecastResponseSchema>;
