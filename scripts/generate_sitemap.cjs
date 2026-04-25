const fs = require('fs');
const path = require('path');
const data = require('../src/data/literatureData.json');

const BASE_URL = 'https://edebiyatatlasi.com';

function generateSitemap() {
  const urls = [
    { loc: `${BASE_URL}/`, priority: '1.0' },
  ];

  data.categories.forEach(cat => {
    cat.periods.forEach(period => {
      // Period URL (hypothetical, as it's a SPA, but good for SEO)
      urls.push({ loc: `${BASE_URL}/period/${period.id}`, priority: '0.8' });
      
      period.authors.forEach(author => {
        urls.push({ loc: `${BASE_URL}/author/${author.id}`, priority: '0.6' });
      });
    });
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <priority>${url.priority}</priority>
    <changefreq>weekly</changefreq>
  </url>`).join('')}
</urlset>`;

  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, sitemap);
  console.log(`✅ Sitemap generated at ${outputPath}`);
}

generateSitemap();
