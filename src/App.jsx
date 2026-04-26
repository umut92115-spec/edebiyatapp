import React, { Suspense, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import literatureData from './data/literatureData.json';

import MobileNav from './components/MobileNav';

const allCategories = literatureData.categories;

function App() {
  const location = useLocation();

  // Google Analytics Page View Tracking
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', 'G-RSGJRM3V9B', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  // Scroll to top on route change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  // SSR-safe way to check for home without hooks
  // This is only for the initial HTML render. Hydration will take care of the rest.
  return (
    <div className="app">
      <Helmet>
        <meta name="google-site-verification" content="AhxNlnpyVY7QJPb8_MkFHI_3DfpMYKLExbqf-0bDXEA" />
      </Helmet>

      <div className="bg-decorations" aria-hidden="true">
        <div className="ambient-blob blob-1"></div>
        <div className="ambient-blob blob-2"></div>
        <div className="ambient-blob blob-3"></div>
      </div>

      <header className="app-header">
        <div className="header-left">
          <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span>İnteraktif Edebiyat Rehberi</span>
            🗺️ Türk Edebiyatı Atlası
          </Link>
        </div>
        <div className="header-actions">
          <Link to="/quiz" className="header-quiz-btn desktop-only" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy size={18} />
            <span>Quiz</span>
          </Link>
          <div className="header-badge">Beta v1.0</div>
        </div>
      </header>

      <main className="main-content" id="main-content">
        <Suspense fallback={<div className="screen-loading">Yükleniyor...</div>}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">🗺️ Edebiyat Atlası</div>
            <p className="footer-tagline">
              Türk edebiyatının tüm dönemlerini, yazarlarını ve eserlerini keşfetmeniz için tasarlanmış interaktif eğitim platformu.
            </p>
          </div>
          <div className="footer-column">
            <h4>Hızlı Menü</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Ana Sayfa</Link></li>
              <li><Link to="/blog" className="footer-link">Edebiyat Blogu</Link></li>
              <li><Link to="/quiz" className="footer-link">Edebiyat Quiz</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Kurumsal</h4>
            <ul className="footer-links">
              <li><Link to="/hakkimizda" className="footer-link">Hakkımızda</Link></li>
              <li><Link to="/iletisim" className="footer-link">İletişim</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 edebiyatdonemler.com.tr — Türk Edebiyatı Tarihi Atlası. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
      <MobileNav />
      <Analytics />
    </div>
  );
}

export default App;
