import fs from 'fs';
import path from 'path';

// Repository name - keep this consistent with package.json homepage
const repoName = 'WeatherForecast';

// Path to the index.html file
const indexPath = path.resolve('dist', 'index.html');

// Read the file
let html = fs.readFileSync(indexPath, 'utf8');

// Replace absolute paths with relative paths
html = html.replace(new RegExp(`src="/${repoName}/`, 'g'), 'src="./');
html = html.replace(new RegExp(`href="/${repoName}/`, 'g'), 'href="./');

// Add a script to automatically redirect to hash-based routing
// This prevents 404 errors on GitHub Pages by ensuring all routes are handled client-side
const hashRedirectScript = `
  <script>
    // Redirect non-hash paths to hash-based equivalents for GitHub Pages compatibility
    (function() {
      var pathname = window.location.pathname;
      var search = window.location.search;
      var hash = window.location.hash;
      
      // If this is a direct access to a path that should be handled by the router
      if (pathname.indexOf('/${repoName}/') === 0 && pathname.length > '/${repoName}/'.length && !hash) {
        // Convert the path to a hash route
        var route = pathname.replace('/${repoName}/', '');
        window.location.replace(window.location.origin + '/${repoName}/#' + route + search);
      }
    })();
  </script>
`;

// Insert the hash redirect script before the closing head tag
html = html.replace('</head>', hashRedirectScript + '\n</head>');

// Write the fixed content back to the file
fs.writeFileSync(indexPath, html);

// Create or update 404.html
const notFoundPath = path.resolve('dist', '404.html');
let notFoundContent;

// Create a new 404.html file that redirects to the main app with the original path as hash
notFoundContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Weather Forecast</title>
  <script>
    // Redirect all 404s to the index.html with the path as a hash
    var segmentCount = 1; // Adjust this based on your GitHub Pages setup
    var l = window.location;
    var path = l.pathname.slice(1).split('/').slice(segmentCount).join('/');
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      '/${repoName}/#/' + path +
      (l.search ? l.search : '') +
      (l.hash ? l.hash : '')
    );
  </script>
</head>
<body>
  <h2>Redirecting...</h2>
</body>
</html>`;

// Write the 404.html file
fs.writeFileSync(notFoundPath, notFoundContent);

// Copy _redirects file to dist
const redirectsPath = path.resolve('public', '_redirects');
const distRedirectsPath = path.resolve('dist', '_redirects');

if (fs.existsSync(redirectsPath)) {
  fs.copyFileSync(redirectsPath, distRedirectsPath);
} else {
  // Create _redirects file if it doesn't exist
  fs.writeFileSync(distRedirectsPath, '/* /index.html 200');
}

console.log('✅ Fixed asset paths in index.html');
console.log('✅ Updated/created 404.html with hash-based redirect');
console.log('✅ Added _redirects file for SPA routing'); 