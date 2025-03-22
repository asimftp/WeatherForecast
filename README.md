# Weather Forecast

A modern React weather application providing accurate forecasts for locations worldwide. Built with performance and user experience in mind.

## Features

- Search for cities worldwide with autocomplete suggestions
- View detailed current weather conditions
- See 5-day/3-hour weather forecasts
- Dark and light theme support
- Mobile-responsive design
- Optimized caching for better performance
- Deployed on GitHub Pages

## Technologies Used

- React 18.3
- TypeScript
- Vite 6
- TanStack React Query for efficient data fetching and caching
- Tailwind CSS for styling
- Radix UI for accessible components
- Wouter for lightweight routing
- OpenWeatherMap API for weather data

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/asimftp/WeatherForecast.git
   cd WeatherForecast
   ```

2. Create a `.env` file in the root directory with your OpenWeatherMap API key:
   ```
   VITE_WEATHER_API_KEY=your_api_key_here
   ```
   
   > **Note:** The repository includes an `.env.example` file that you can use as a template. Simply copy it to a new file named `.env` and replace the placeholder values with your actual API key:
   > ```bash
   > cp .env.example .env
   > ```
   > Then edit the `.env` file with your API key. You can get a free API key by signing up at [OpenWeatherMap](https://openweathermap.org/api).

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Deployment to GitHub Pages

This project is configured for easy deployment to GitHub Pages.

1. The `homepage` field in `package.json` is already set to match the GitHub Pages URL:
   ```json
   "homepage": "https://asimftp.github.io/WeatherForecast"
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

   This builds the project and publishes it to the `gh-pages` branch of your repository.

3. Alternatively, you can use the provided deploy script:
   ```bash
   ./deploy.bat
   ```

## Project Structure

```
/
├── src/                  # Source code
│   ├── components/       # React components
│   │   ├── common/       # Shared UI components 
│   │   ├── layout/       # Layout components like Header and Footer
│   │   └── weather/      # Weather-specific components
│   ├── contexts/         # React contexts including ThemeContext
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── services/         # API services 
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── public/               # Static assets
├── dist/                 # Build output
├── .env                  # Environment variables (not in repo)
├── .env.example          # Example environment variables
├── vite.config.ts        # Vite configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Project dependencies and scripts
└── deploy.bat            # Deployment script
```

## API Usage

This application uses the OpenWeatherMap API for:

- Current weather data
- 5-day/3-hour forecast
- Geocoding (city search)
- Reverse geocoding (getting city name from coordinates)

API calls include intelligent caching to minimize requests and improve performance.

## Features in Detail

### Weather Data
- Current temperature, feels like, humidity, pressure, wind speed and direction
- Weather conditions with appropriate icons
- Sunrise and sunset times
- Detailed 5-day forecast with 3-hour intervals

### User Experience
- Automatic theme detection based on user's system preferences
- Manual theme toggle
- Responsive design that works on all devices
- Recent search history
- Error handling with user-friendly messages

## License

This project is licensed under the MIT License.

## Acknowledgements

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather data API
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the fast development environment
