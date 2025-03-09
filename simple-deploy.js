import ghpages from 'gh-pages';
import { exec } from 'child_process';

// First build the project
console.log('Building the project for GitHub Pages...');
exec('npm run build:gh-pages', (error, stdout, stderr) => {
  if (error) {
    console.error(`Build error: ${error.message}`);
    return;
  }
  
  console.log(stdout);
  
  if (stderr) {
    console.error(`Build stderr: ${stderr}`);
  }
  
  // Then deploy using gh-pages
  console.log('Deploying to GitHub Pages...');
  ghpages.publish('dist', {
    branch: 'gh-pages',
    repo: 'https://github.com/asimftp/WeatherForecast.git',
    message: 'Auto-generated commit from simple-deploy.js',
    dotfiles: true
  }, function(err) {
    if (err) {
      console.error('Deployment failed:', err);
    } else {
      console.log('Successfully deployed to GitHub Pages!');
      console.log('Your site should now be available at: https://asimftp.github.io/WeatherForecast/');
    }
  });
}); 