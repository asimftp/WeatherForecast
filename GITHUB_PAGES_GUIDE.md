# GitHub Pages Deployment Guide

This document provides a step-by-step guide to deploy this application to GitHub Pages.

## Option 1: Using GitHub Actions (Recommended)

The simplest way to deploy this application is to use GitHub Actions, which will automatically build and deploy the site whenever changes are pushed to the main branch.

1. Ensure your repository has GitHub Pages enabled:
   - Go to your repository on GitHub
   - Click on "Settings"
   - Scroll down to the "GitHub Pages" section
   - Under "Source", select "GitHub Actions"

2. Push your code to the `main` branch:
   ```
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

3. The GitHub Action will automatically build and deploy your site to the `gh-pages` branch.

4. Your site will be available at: `https://asimftp.github.io/WeatherForecast/`

## Option 2: Manual Deployment

If GitHub Actions isn't working for you, you can manually deploy the site:

1. Build the project:
   ```
   npm run build:gh-pages
   ```

2. Navigate to the `dist` directory:
   ```
   cd dist
   ```

3. Initialize a new Git repository inside the `dist` directory:
   ```
   git init
   ```

4. Add all files in the `dist` directory:
   ```
   git add .
   ```

5. Commit the changes:
   ```
   git commit -m "Deploy to GitHub Pages"
   ```

6. Add your GitHub repository as a remote:
   ```
   git remote add origin https://github.com/asimftp/WeatherForecast.git
   ```

7. Force push to the `gh-pages` branch:
   ```
   git push -f origin HEAD:gh-pages
   ```

8. Your site will be available at: `https://asimftp.github.io/WeatherForecast/`

##
npm run build
node fix-paths.js
npm run deploy

## Option 3: Using the gh-pages npm package

If you're encountering issues with the above methods, you can try using the `gh-pages` npm package directly:

1. Open a command prompt or terminal.

2. Run the following commands:
   ```
   npm run build:gh-pages
   npx gh-pages -d dist
   ```

## Troubleshooting

If you're encountering issues with GitHub Pages deployment:

1. **Check your repository settings:**
   - Go to your repository settings on GitHub
   - Scroll to the GitHub Pages section
   - Ensure it's set to use the `gh-pages` branch

2. **Check the GitHub Pages URL:**
   - Ensure you're using the correct URL: `https://asimftp.github.io/WeatherForecast/`
   - Note that it might take a few minutes for changes to propagate

3. **Check for 404 errors:**
   - If you're getting 404 errors, ensure your `404.html` file is properly set up
   - Check that the base path in your Vite configuration matches the repository name

4. **Check GitHub Actions logs:**
   - If using GitHub Actions, check the workflow run logs for any errors

5. **Manual verification:**
   - Check the contents of the `gh-pages` branch to ensure files were properly deployed
   - Verify that the `index.html` file exists at the root of the `gh-pages` branch 