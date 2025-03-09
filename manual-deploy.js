import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Ensure the dist directory exists
if (!fs.existsSync('dist')) {
  console.error('❌ Dist directory does not exist. Run npm run build:gh-pages first.');
  process.exit(1);
}

// Function to execute command and log output
function runCommand(command) {
  console.log(`Running: ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

// Create a copy of 404.html in the dist directory if it doesn't exist
if (!fs.existsSync(path.join('dist', '404.html'))) {
  console.log('Creating 404.html...');
  fs.copyFileSync(
    path.join('dist', 'index.html'),
    path.join('dist', '404.html')
  );
}

// Configure Git in the dist directory
console.log('Configuring Git in dist directory...');
process.chdir('dist');

// Initialize Git repository if not already initialized
if (!fs.existsSync('.git')) {
  runCommand('git init');
}

// Configure Git
runCommand('git config user.name "GitHub Pages Deployment"');
runCommand('git config user.email "github-pages-deploy@users.noreply.github.com"');

// Add all files
runCommand('git add .');

// Commit changes
runCommand('git commit -m "Deploy to GitHub Pages"');

// Add the remote repository if it doesn't exist
try {
  execSync('git remote get-url origin');
} catch (error) {
  console.log('Adding remote repository...');
  runCommand('git remote add origin https://github.com/asimftp/WeatherForecast.git');
}

// Force push to the gh-pages branch
console.log('Pushing to gh-pages branch...');
runCommand('git push -f origin HEAD:gh-pages');

console.log('✅ Successfully deployed to GitHub Pages!');
console.log('Your site should now be available at: https://asimftp.github.io/WeatherForecast/'); 