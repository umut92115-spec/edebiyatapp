import React from 'react';
import { Link } from 'react-router-dom';
import { GlobalSearch } from './GlobalSearch';
import { Map, ChevronRight, Book, Feather, Scroll, Compass, Trophy } from 'lucide-react';


export function HomeScreen({ categories, onSelectCategory, onSelectAuthor, onStartQuiz }) {
  return (
    <div className="animate-in">
      <div className="home-hero">
        
        <div className="hero-parallax">
          <h1 className="hero-title">
            Türk Edebiyatı Dönemleri —<br />
            <span className="gradient-text">Yazarlar ve Eserler</span>
          </h1>
        </div>



        <p className="hero-desc">
          Yüzyıllık edebiyat tarihini keşfet. Dönemleri, yazarları
          ve eserleri interaktif olarak incele.
        </p>

        <style>{`
          .category-link {
            text-decoration: none;
            color: inherit;
            display: block;
          }
          .hero-search-container {
            margin: 40px auto 20px;
            width: 100%;
            display: flex;
            justify-content: center;
            position: relative;
            z-index: 50;
          }
          .hero-search-container .global-search-container {
            width: 100%;
            max-width: 650px;
          }
          .hero-search-container .global-search-wrapper,
          .hero-search-container .global-search-wrapper:focus-within {
            width: 100%;
          }
          .hero-search-container .global-search-input {
            font-size: 1.2rem !important;
            padding: 18px 24px 18px 56px !important;
            border-radius: 40px !important;
            box-shadow: 0 10px 25px rgba(0,0,0,0.05) !important;
            border: 2px solid var(--border) !important;
          }
          .hero-search-container .global-search-input:focus {
            border-color: var(--amber) !important;
            box-shadow: 0 15px 35px rgba(193, 127, 42, 0.15) !important;
          }
          .hero-search-container .global-search-icon {
            font-size: 1.5rem !important;
            left: 20px !important;
            top: 50% !important;
          }
          .hero-search-container .global-search-clear {
            font-size: 1.3rem !important;
            right: 18px !important;
            top: 50% !important;
          }
          .hero-search-container .global-search-results {
            top: 75px !important;
            font-size: 1.05rem !important;
            border-radius: 24px !important;
            box-shadow: var(--shadow-premium) !important;
            padding: 12px !important;
          }
        `}</style>
        
        <div className="hero-search-container">
          <GlobalSearch allCategories={categories} onSelectAuthor={onSelectAuthor} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '48px' }}>
          <button 
            className="btn-quiz-hero glass"
            onClick={onStartQuiz}
            style={{
              padding: '12px 32px',
              borderRadius: '30px',
              border: '2px solid var(--amber)',
              background: 'var(--amber-dim)',
              color: 'var(--text-primary)',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <Trophy size={20} color="var(--amber)" /> Edebiyat Quiz'e Başla
          </button>
        </div>

        <div className="categories-grid stagger">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/${cat.id}`}
              className="category-card category-link animate-in glass"
              aria-label={`${cat.name} kategorisini aç`}
            >
              <div className="card-icon-wrapper">
                <Book className="card-icon" size={32} />
              </div>
              <div className="card-title">{cat.name.replace(/^[\p{Emoji}\s]+/u, '')}</div>
              <div className="card-meta">
                {cat.periods.length} dönem &bull;{' '}
                {cat.periods.reduce((sum, p) => sum + p.authors.length, 0)} yazar
              </div>
              <div className="card-arrow" aria-hidden="true">
                <ChevronRight size={20} />
              </div>
            </Link>
          ))}
        </div>

        {/* Reklam alanı şimdilik gizli (Gerektiğinde CSS'ten açılabilir) */}
        <div className="ad-placeholder" style={{ display: 'none' }}>
          Reklam Alanı (AdSense)
        </div>
      </div>
    </div>
  );
}
