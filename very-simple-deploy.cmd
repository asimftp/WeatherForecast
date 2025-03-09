@echo off
echo Building for GitHub Pages...
call npm run build:gh-pages

echo Deploying to GitHub Pages...
cd dist
git init
git add .
git commit -m "Deploy to GitHub Pages"
git branch -M gh-pages
git remote add origin https://github.com/asimftp/WeatherForecast.git
git push -f origin gh-pages

echo Deployment completed!
echo Your site should now be available at: https://asimftp.github.io/WeatherForecast/ 