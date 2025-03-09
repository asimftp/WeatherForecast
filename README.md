# Weather Wizard

A React-based weather application optimized for GitHub Pages deployment. Get accurate weather forecasts for any location.

## Features

- Search for cities worldwide
- View current weather conditions
- See 5-day weather forecast
- Recent search history
- Responsive design for all devices
- Optimized for GitHub Pages deployment

## Technologies Used

- React 18
- TypeScript
- Vite
- React Query for data fetching
- Tailwind CSS for styling
- Radix UI for accessible components
- OpenWeatherMap API for weather data

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/WeatherWizard.git
   cd WeatherWizard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Deployment to GitHub Pages

This project is configured for easy deployment to GitHub Pages.

1. Update the `homepage` field in `package.json` to match your GitHub Pages URL:
   ```json
   "homepage": "https://yourusername.github.io/WeatherWizard"
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

This will build the project and publish it to the `gh-pages` branch of your repository.

## Project Structure

```
/
├── client/                # Frontend code
│   ├── public/            # Static assets
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   ├── pages/         # Page components
│   │   └── types/         # TypeScript type definitions
│   └── index.html         # HTML template
├── dist/                  # Build output
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── README.md              # Project documentation
```

## API Usage

This application uses the OpenWeatherMap API to fetch weather data. The API calls are made directly from the client with appropriate caching to minimize requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather data API
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the fast development environment
