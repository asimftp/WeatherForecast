@echo off
npm run build:gh-pages
cd dist
git init
git add .
git commit -m "Deploy to GitHub Pages"
git remote add origin https://github.com/asimftp/WeatherForecast.git
git push -f origin HEAD:gh-pages
cd .. 