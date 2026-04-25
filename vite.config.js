import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'
import fs from 'fs'
import persistencePlugin from './persistence-plugin'

const getDynamicRoutesAndPriorities = () => {
  try {
    const data = JSON.parse(fs.readFileSync('./src/data/literatureData.json', 'utf-8'));
    const routes = ['/quiz', '/admin', '/blog', '/hakkimizda', '/iletisim'];
    const priorities = {
      '/': 1.0,
      '/quiz': 0.8,
      '/admin': 0.1,
      '/blog': 0.8,
      '/hakkimizda': 0.8,
      '/iletisim': 0.8
    };

    data.categories.forEach(cat => {
      const catPath = `/${cat.id}`;
      routes.push(catPath);
      priorities[catPath] = 0.9; // Dönem grupları

      cat.periods.forEach(period => {
        const periodPath = `/${cat.id}/${period.id}`;
        routes.push(periodPath);
        priorities[periodPath] = 0.8; // Dönemler

        period.authors.forEach(author => {
          const authorPath = `/${cat.id}/${period.id}/${author.id}`;
          routes.push(authorPath);
          priorities[authorPath] = 0.7; // Yazarlar
        });
      });
    });
    return { routes, priorities };
  } catch (e) {
    return { routes: [], priorities: { '/': 1.0 } };
  }
};

const { routes: dynamicRoutes, priorities: routePriorities } = getDynamicRoutesAndPriorities();

export default defineConfig({
  plugins: [
    react(),
    persistencePlugin(),
    sitemap({
      hostname: 'https://edebiyatapp.vercel.app',
      dynamicRoutes: dynamicRoutes,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: routePriorities
    })
  ],
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    includedRoutes(paths, routes) {
      return dynamicRoutes;
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
