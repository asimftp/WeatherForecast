import fs from 'fs';
import path from 'path';

// Path to the index.html file
const indexPath = path.resolve('dist', 'index.html');

// Read the file
let html = fs.readFileSync(indexPath, 'utf8');

// Replace absolute paths with relative paths
html = html.replace(/src="\/WeatherForecast\//g, 'src="./');
html = html.replace(/href="\/WeatherForecast\//g, 'href="./');

// Write the fixed content back to the file
fs.writeFileSync(indexPath, html);

console.log('✅ Fixed asset paths in index.html'); 