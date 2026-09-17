// Explicit deployment allowlist: documentation and tooling are never published.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const files = [
  'index.html', 'index_en.html', 'disclaimer.html', '404.html', '410.html',
  'init.js', 'main.js', 'disclaimer.js', 'styles.css', 'staticwebapp.config.json',
  'manifest.json', 'robots.txt', 'sitemap.xml', 'favicon.ico', 'icon.svg',
  'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png',
  'intro.mp4', 'intro-poster.jpg', 'og-image.jpg'
];

function prepareSite(target = path.join(root, '.site')) {
  // Refuse an existing destination so stale/unlisted files cannot leak into it.
  for (const file of files) {
    if (!fs.statSync(path.join(root, file)).isFile()) throw new Error(`Missing website file: ${file}`);
  }
  fs.mkdirSync(target);
  for (const file of files) fs.copyFileSync(path.join(root, file), path.join(target, file));
  return files.length;
}

module.exports = { prepareSite, files };
if (require.main === module) console.log(`Prepared ${prepareSite()} files in .site/`);
