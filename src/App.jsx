import React, { Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import './index.css';
import literatureData from './data/literatureData.json';

// Lazy loaded components
const HomeScreen = lazy(() => import('./components/HomeScreen').then(m => ({ default: m.HomeScreen })));
const PeriodsScreen = lazy(() => import('./components/PeriodsScreen').then(m => ({ default: m.PeriodsScreen })));
const AuthorsScreen = lazy(() => import('./components/AuthorsScreen').then(m => ({ default: m.AuthorsScreen })));
const AuthorModal = lazy(() => import('./components/AuthorModal').then(m => ({ default: m.AuthorModal })));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const QuizScreen = lazy(() => import('./components/QuizScreen').then(m => ({ default: m.QuizScreen })));

// Static pages
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));

import { ArrowLeft, Trophy } from 'lucide-react';
import { FavoritesSidebar } from './components/FavoritesSidebar';
import { GlobalSearch } from './components/GlobalSearch';
import { AutoBreadcrumb } from './components/AutoBreadcrumb';

const allCategories = literatureData.categories;

import { AnimatePresence, motion } from 'framer-motion';

import { Helmet } from 'react-helmet-async';

// Helper component for Authors view with Modal
function AuthorsView({ categories }) {
  const { categorySlug, periodSlug, authorSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const category = categories.find(c => c.id === categorySlug);
  const period = category?.periods.find(p => p.id === periodSlug);
  const author = period?.authors.find(a => a.id === authorSlug);

  const cleanPeriodName = period?.name.replace(/^[\p{Emoji}\s]+/u, '') ?? '';
  const authorName = author?.name ?? '';
  const currentUrl = `https://edebiyatdonemler.com.tr${location.pathname}`;

  // SEO Titles & Descriptions
  const pageTitle = authorSlug && author 
    ? `${authorName} Eserleri ve Hayatı — ${cleanPeriodName} | edebiyatdonemler.com.tr`
    : `${cleanPeriodName} Edebiyatı — Yazarlar ve Eserler | edebiyatdonemler.com.tr`;
  
  const pageDesc = authorSlug && author
    ? `${authorName}'nın tüm eserleri, hayatı ve ${cleanPeriodName} edebiyatındaki yeri. ${author.works.slice(0, 3).map(w => w.name).join(', ')} hakkında bilgi.`
    : `${cleanPeriodName} edebiyatının genel özellikleri, ${period?.authors.slice(0, 3).map(a => a.name).join(', ')} gibi temsilci yazarlar ve eserleri.`;

  // JSON-LD for Author
  const schemaOrg = authorSlug && author ? {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": author.name,
    "description": author.bio?.substring(0, 160),
    "nationality": "Turkish",
    "knowsAbout": `${cleanPeriodName} edebiyatı`,
    "sameAs": author.wikiPage || undefined
  } : null;

  if (!category || !period) {
    return <div className="screen-error">Dönem bulunamadı.</div>;
  }

  const handleSelectAuthor = (selectedAuthor) => {
    navigate(`/${categorySlug}/${periodSlug}/${selectedAuthor.id}`);
  };

  const handleCloseModal = () => {
    navigate(`/${categorySlug}/${periodSlug}`);
  };

  const handleBack = () => {
    navigate(`/${categorySlug}`);
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={currentUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        {schemaOrg && <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>}
      </Helmet>
      
      <AuthorsScreen
        period={period}
        onSelectAuthor={handleSelectAuthor}
        onBack={handleBack}
      />
      <AnimatePresence>
        {authorSlug && author && (
          <AuthorModal
            author={author}
            period={period}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Helper component for Periods view
function PeriodsView({ categories }) {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const category = categories.find(c => c.id === categorySlug);
  const cleanCatName = category?.name.replace(/^[\p{Emoji}\s]+/u, '') ?? '';
  const currentUrl = `https://edebiyatdonemler.com.tr${location.pathname}`;

  const pageTitle = `${cleanCatName} — Türk Edebiyatı Dönemleri | edebiyatdonemler.com.tr`;
  const pageDesc = `${cleanCatName} döneminin özellikleri, temsilci yazarları ve önemli eserleri.`;

  if (!category) {
    return <div className="screen-error">Kategori bulunamadı.</div>;
  }

  const handleSelectPeriod = (period) => {
    navigate(`/${categorySlug}/${period.id}`);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={currentUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
      </Helmet>
      <PeriodsScreen
        category={category}
        onSelectPeriod={handleSelectPeriod}
        onBack={handleBack}
      />
    </>
  );
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const categories = allCategories;

  const goHome = () => navigate('/');
  const goToQuiz = () => navigate('/quiz');

  // Search/Favorite select author handler
  const handleGlobalSelectAuthor = (author) => {
    // We need to find the category and period for this author
    let foundPath = '/';
    for (const cat of categories) {
      for (const p of cat.periods) {
        if (p.authors.some(a => a.id === author.id)) {
          foundPath = `/${cat.id}/${p.id}/${author.id}`;
          break;
        }
      }
    }
    navigate(foundPath);
  };

  const currentUrl = `https://edebiyatdonemler.com.tr${location.pathname}`;
  const isHome = location.pathname === '/';

  // Breadcrumb List for JSON-LD
  const getBreadcrumbJsonLd = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    const items = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Ana Sayfa",
        "item": "https://edebiyatdonemler.com.tr"
      }
    ];

    paths.forEach((path, index) => {
      items.push({
        "@type": "ListItem",
        "position": index + 2,
        "name": path.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        "item": `https://edebiyatdonemler.com.tr/${paths.slice(0, index + 1).join('/')}`
      });
    });

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items
    };
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          {!isHome && (
            <button 
              className="header-back-btn" 
              onClick={() => navigate(-1)}
              aria-label="Geri git"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div
            className="logo"
            onClick={goHome}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
            aria-label="Ana sayfaya git"
            onKeyDown={e => e.key === 'Enter' && goHome()}
          >
            <span>İnteraktif Edebiyat Rehberi</span>
            🗺️ Türk Edebiyatı Atlası
          </div>
        </div>
        <div className="header-actions">
          <button className="header-quiz-btn" onClick={goToQuiz} title="Edebiyat Quiz">
            <Trophy size={18} />
            <span>Quiz</span>
          </button>
          <GlobalSearch allCategories={categories} onSelectAuthor={handleGlobalSelectAuthor} />
          <FavoritesSidebar allCategories={categories} onSelectAuthor={handleGlobalSelectAuthor} />
          <div className="header-badge">Beta v1.0</div>
        </div>
      </header>

      <main className="main-content" id="main-content">
        <AutoBreadcrumb />
        <Suspense fallback={<div className="screen-loading">Yükleniyor...</div>}>
          <Routes location={location} key={location.pathname.split('/')[1] || 'home'}>
            <Route path="/" element={
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <Helmet>
                  <title>Türk Edebiyatı Dönemleri — Yazarlar ve Eserler | edebiyatdonemler.com.tr</title>
                  <meta name="description" content="Türk edebiyatının tüm dönemleri, yazarları ve eserleri. YKS AYT edebiyat için görsel ve interaktif kaynak." />
                  <link rel="canonical" href={currentUrl} />
                  <script type="application/ld+json">{JSON.stringify(getBreadcrumbJsonLd())}</script>
                </Helmet>
                <HomeScreen
                  categories={categories}
                  onSelectCategory={(cat) => navigate(`/${cat.id}`)}
                  onSelectAuthor={handleGlobalSelectAuthor}
                  onStartQuiz={goToQuiz}
                />
              </motion.div>
            } />

            <Route path="/quiz" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Helmet>
                  <title>Edebiyat Quiz — Bilgini Test Et | edebiyatdonemler.com.tr</title>
                  <meta name="description" content="Edebiyat bilginizi interaktif quizler ile test edin. YKS, AYT ve okul sınavlarına hazırlık için eğlenceli edebiyat soruları." />
                  <link rel="canonical" href={currentUrl} />
                </Helmet>
                <QuizScreen categories={categories} onBack={goHome} />
              </motion.div>
            } />

            <Route path="/admin" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Helmet>
                  <title>Yönetici Paneli — Edebiyat Atlası</title>
                  <meta name="robots" content="noindex, nofollow" />
                </Helmet>
                <AdminDashboard onBack={goHome} />
              </motion.div>
            } />

            <Route path="/hakkimizda" element={<AboutPage />} />
            <Route path="/iletisim" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:postId" element={<BlogPostPage />} />

            <Route path="/:categorySlug" element={
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <PeriodsView categories={categories} />
              </motion.div>
            } />

            <Route path="/:categorySlug/:periodSlug" element={
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <AuthorsView categories={categories} />
              </motion.div>
            } />

            <Route path="/:categorySlug/:periodSlug/:authorSlug" element={
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <AuthorsView categories={categories} />
              </motion.div>
            } />
          </Routes>
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
              <li><Link to="/admin" className="footer-link" style={{ opacity: 0.5 }}>Yönetici Paneli</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 edebiyatdonemler.com.tr — Türk Edebiyatı Tarihi Atlası. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
