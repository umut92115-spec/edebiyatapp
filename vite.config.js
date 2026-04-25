import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'
import fs from 'fs'
import persistencePlugin from './persistence-plugin'

const getDynamicRoutes = () => {
  try {
    const data = JSON.parse(fs.readFileSync('./src/data/literatureData.json', 'utf-8'));
    const routes = ['/quiz', '/admin'];
    data.categories.forEach(cat => {
      routes.push(`/${cat.id}`);
      cat.periods.forEach(period => {
        routes.push(`/${cat.id}/${period.id}`);
        period.authors.forEach(author => {
          routes.push(`/${cat.id}/${period.id}/${author.id}`);
        });
      });
    });
    return routes;
  } catch (e) {
    return [];
  }
};

export default defineConfig({
  plugins: [
    react(),
    persistencePlugin(),
    sitemap({
      hostname: 'https://edebiyatdonemler.com.tr',
      dynamicRoutes: getDynamicRoutes(),
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: {
        '/': 1.0,
        '/quiz': 0.8,
        '/admin': 0.1
      }
    })
  ],
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    includedRoutes(paths, routes) {
      // Re-use our dynamic routes helper
      return getDynamicRoutes();
    },
    onFinished() {
      console.log('SSG finished!');
    }
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('react-dom') || id.includes('react/')) return 'vendor-react';
          if (id.includes('react-router-dom')) return 'vendor-router';
          if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('react-helmet-async')) return 'vendor-utils';
        }
      }
    }
  }
});
