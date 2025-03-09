@echo off
echo Starting deployment to GitHub Pages...

echo Building project...
call npm run build:gh-pages

echo Setting up git in dist folder...
cd dist

echo Initializing git repository...
git init

echo Configuring git...
git config user.name "GitHub Pages Deployment"
git config user.email "github-pages-deploy@users.noreply.github.com"

echo Adding files to git...
git add .

echo Committing changes...
git commit -m "Deploy to GitHub Pages"

echo Adding remote repository...
git remote add origin https://github.com/asimftp/WeatherForecast.git

echo Pushing to gh-pages branch...
git push -f origin HEAD:gh-pages

echo Returning to project root...
cd ..

echo Deployment completed!
echo Your site should now be available at: https://asimftp.github.io/WeatherForecast/
pause 