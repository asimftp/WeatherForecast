import fs from 'fs';
import path from 'path';

// Repository name (must match GitHub Pages repo name)
const repoName = 'WeatherForecast';

// Paths
const distDir = path.resolve('dist');
const indexPath = path.join(distDir, 'index.html');
const notFoundPath = path.join(distDir, '404.html');
const redirectsPath = path.join('public', '_redirects');
const distRedirectsPath = path.join(distDir, '_redirects');

// ✅ 1. Fix asset paths in `index.html`
if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8');

    // Convert absolute paths to relative paths for GitHub Pages
    html = html.replaceAll(`src="/${repoName}/`, 'src="./');
    html = html.replaceAll(`href="/${repoName}/`, 'href="./');

    // ✅ 2. Insert hash-based redirect script (fixes GitHub Pages SPA routing)
    const hashRedirectScript = `
    <script>
      (function() {
        var pathname = window.location.pathname;
        var search = window.location.search;
        var hash = window.location.hash;
        
        if (pathname.startsWith('/${repoName}/') && pathname.length > '/${repoName}/'.length && !hash) {
          var route = pathname.replace('/${repoName}/', '');
          window.location.replace(window.location.origin + '/${repoName}/#' + route + search);
        }
      })();
    </script>`;

    html = html.replace('</head>', `${hashRedirectScript}\n</head>`);

    // Write the updated file
    fs.writeFileSync(indexPath, html);
    console.log('✅ Fixed asset paths in index.html');
} else {
    console.warn('⚠ index.html not found. Skipping path fixes.');
}

// ✅ 3. Create `404.html` for GitHub Pages (ensures refresh works)
const notFoundContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Weather Forecast</title>
  <script>
    var segmentCount = 1; 
    var l = window.location;
    var path = l.pathname.slice(1).split('/').slice(segmentCount).join('/');
    l.replace(l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      '/${repoName}/#/' + path + (l.search || '') + (l.hash || ''));
  </script>
</head>
<body>
  <h2>Redirecting...</h2>
</body>
</html>`;

fs.writeFileSync(notFoundPath, notFoundContent);
console.log('✅ Created/Updated 404.html');

// ✅ 4. Copy `_redirects` file for Netlify (if exists)
if (fs.existsSync(redirectsPath)) {
    fs.copyFileSync(redirectsPath, distRedirectsPath);
    console.log('✅ Copied _redirects file for Netlify.');
} else {
    fs.writeFileSync(distRedirectsPath, '/* /index.html 200');
    console.log('✅ Created default _redirects file.');
}

console.log('🎉 Fixes applied successfully!');
