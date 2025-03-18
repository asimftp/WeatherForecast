@echo off
echo ======================================
echo 🚀 Deploying Vite React App to GitHub Pages...
echo ======================================

:: Ensure we are in the project root
cd /d "%~dp0"

:: Install dependencies
echo 📦 Installing dependencies...
CALL npm install || (echo ❌ Failed to install dependencies. Exiting... & exit /b)

:: Build the project
echo 🏗️  Building the project...
CALL npm run build || (echo ❌ Build failed. Exiting... & exit /b)

:: Deploy to GitHub Pages (gh-pages branch) without pushing main branch
echo 🚀 Deploying to GitHub Pages...
CALL npm run deploy || (echo ❌ Deployment failed. Exiting... & exit /b)

echo ======================================
echo ✅ Deployment Complete!
echo 🌐 Check your website at:
echo 👉 https://asimftp.github.io/WeatherForecast/
echo ======================================

pause
