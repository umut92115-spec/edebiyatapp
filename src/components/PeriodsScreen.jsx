import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Compass } from 'lucide-react';

const periodClassMap = {
  'tanzimat': 'tanzimat',
  'servet-i-funun': 'servet-i-funun',
  'fecr-i-ati': 'fecr-i-ati',
  'milli-edebiyat': 'milli-edebiyat',
  'cumhuriyet-donemi': 'cumhuriyet-donemi',
  'turk-cocuk-edebiyati': 'turk-cocuk-edebiyati',
  'dunya-cocuk-edebiyati': 'dunya-cocuk-edebiyati',
};

const periodColorVar = {
  'tanzimat': 'var(--amber)',
  'servet-i-funun': 'var(--teal)',
  'fecr-i-ati': 'var(--rose)',
  'milli-edebiyat': 'var(--gold)',
  'cumhuriyet-donemi': 'var(--indigo)',
  'turk-cocuk-edebiyati': 'var(--emerald)',
  'dunya-cocuk-edebiyati': 'var(--sky)',
};

const periodBgVar = {
  'tanzimat': 'var(--amber-dim)',
  'servet-i-funun': 'var(--teal-dim)',
  'fecr-i-ati': 'var(--rose-dim)',
  'milli-edebiyat': 'var(--gold-dim)',
  'cumhuriyet-donemi': 'var(--indigo-dim)',
  'turk-cocuk-edebiyati': 'var(--emerald-dim)',
  'dunya-cocuk-edebiyati': 'var(--sky-dim)',
};


export function PeriodsScreen({ category, onSelectPeriod, onBack }) {
  const { categorySlug } = useParams();
  const cleanCatName = category.name.replace(/^[\p{Emoji}\s]+/u, '');
  
  return (
    <div className="animate-in">
      <style>{`
        .period-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }
      `}</style>
      <p className="page-subtitle">
        📚 {category.name.replace(/^📚\s*/, '')}
      </p>
      <h1 className="page-title">Edebi Dönemler</h1>
      <p className="page-subtitle">
        Bir dönemi seçerek o dönemin yazarlarını incele.
      </p>

      <div className="periods-grid stagger">
        {category.periods.map((period) => {
          const cls = periodClassMap[period.id] || '';
          const colorVar = periodColorVar[period.id] || 'var(--violet)';
          const bgVar   = periodBgVar[period.id]   || 'var(--violet-dim)';
          const emoji = period.name.match(/^(\p{Emoji})/u)?.[1] ?? '📖';
          const cleanName = period.name.replace(/^[\p{Emoji}\s]+/u, '');

          return (
            <Link
              key={period.id}
              to={`/${categorySlug}/${period.id}`}
              className={`period-card period-link ${cls} glass`}
              style={{ '--c': colorVar, '--bg': bgVar }}
              aria-label={`${cleanName} dönemini aç`}
            >
              <motion.div whileHover={{ y: -5, scale: 1.02 }}>
                <span className="period-icon">{emoji}</span>
                <div className="period-name">{cleanName}</div>
                <div className="period-count">
                  👤 {period.authors.length} yazar
                </div>
                <span className="period-arrow" aria-hidden="true">
                  <ChevronRight size={18} />
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {category.periods.length > 1 && (
        <section className="related-periods" style={{ marginTop: '64px', borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
          <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>
            <Compass size={20} style={{ marginRight: '8px', color: 'var(--amber)' }} />
            Diğer Edebi Dönemler
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {category.periods.map(p => (
              <Link 
                key={p.id} 
                to={`/${categorySlug}/${p.id}`}
                className="glass"
                style={{ 
                  padding: '10px 20px', 
                  borderRadius: '20px', 
                  textDecoration: 'none', 
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                {p.name.replace(/^[\p{Emoji}\s]+/u, '')}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
