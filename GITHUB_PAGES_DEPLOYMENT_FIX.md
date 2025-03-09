# GitHub Pages Deployment Fix

This guide provides a step-by-step solution to fix the "Page Not Found" issue when deploying your Weather Forecast app to GitHub Pages.

## The Problem

GitHub Pages doesn't support the HTML5 `pushState` history API used by SPAs (Single Page Applications). When users navigate directly to a route like `https://asimftp.github.io/WeatherForecast/forecast`, GitHub Pages returns a 404 error because there's no physical `forecast.html` file on the server.

## The Solution: Hash-Based Routing

We've implemented hash-based routing, which uses URLs like `https://asimftp.github.io/WeatherForecast/#/forecast`. This approach works on GitHub Pages because everything after the `#` is processed client-side and not sent to the server.

## Changes Made

1. **Updated `fix-paths.js` Script**:
   - Added a script to redirect non-hash paths to hash-based equivalents
   - Created a 404.html file that redirects to the hash-based equivalent

2. **Fixed Asset Paths**:
   - Ensured all asset paths use relative URLs (`./`) instead of absolute URLs (`/WeatherForecast/`)
   - Added proper redirects for direct URL access

## How to Deploy

### Method 1: Using GitHub Actions (Recommended)

1. Push your code to GitHub, and the GitHub Actions workflow will automatically build and deploy your site.

2. Go to your GitHub repository settings:
   - Navigate to "Settings" > "Pages"
   - Make sure it's deployed from the "gh-pages" branch

### Method 2: Manual Deployment

If the GitHub Actions approach doesn't work, you can deploy manually:

1. Run the build command:
   ```
   npm run build:gh-pages
   ```

2. Deploy using one of these methods:

   **Option A: Using the batch file**
   ```
   .\deploy-gh.bat
   ```

   **Option B: Using npm deploy**
   ```
   npm run deploy
   ```
   
   **Option C: Manual git commands**
   ```
   cd dist
   git init
   git config --local user.name "GitHub"
   git config --local user.email "noreply@github.com"
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push -f https://github.com/asimftp/WeatherForecast.git HEAD:gh-pages
   cd ..
   ```

## Troubleshooting

If you're still experiencing issues:

1. **Check your browser console** for any errors
2. **Clear your browser cache** to ensure you're seeing the latest version
3. **Verify GitHub Pages settings** in your repository
4. **Check the gh-pages branch** to make sure it contains the latest build

## How It Works

1. When a user visits a direct URL like `https://asimftp.github.io/WeatherForecast/forecast`:
   - GitHub Pages serves the 404.html file
   - The 404.html file redirects to `https://asimftp.github.io/WeatherForecast/#/forecast`
   - The app loads and the router handles the hash-based route

2. When a user navigates within the app:
   - The app uses hash-based URLs like `#/forecast`
   - This works without page reloads or server requests

This approach ensures your SPA works correctly on GitHub Pages without any 404 errors. 