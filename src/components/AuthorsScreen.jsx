import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, Search, ArrowLeft, ChevronRight, Info, X } from 'lucide-react';
import { useAuthorPhoto } from '../hooks/useAuthorPhoto';
import { usePeriodDescription } from '../hooks/usePeriodDescription';
import { MovementModal } from './MovementModal';
import { PeriodDescSkeleton } from './Skeleton';

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

function getInitials(name) {
  return name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}


const RELEVANT_TAGS = {
  'tanzimat': ['Tanzimat 1. Dönem', 'Tanzimat 2. Dönem', 'Tanzimat Dönemi'],
  'servet-i-funun': ['Servet-i Fünun'],
  'fecr-i-ati': ['Fecr-i Âti'],
  'milli-edebiyat': ['Milli Edebiyat'],
  'cumhuriyet-donemi': [
    'Cumhuriyet Dönemi', 'Saf Şiir', 'Yedi Meşaleciler', 'Toplumcu Gerçekçiler', 
    'Milli Edebiyat Zevki', 'Garip Akımı', 'Maviciler', 'İkinci Yeni', 
    'Hisarcılar', 'Dini-Mistik Şiir', 'Beş Hececiler', 'Garip Dışında',
    'Bireyin İç Dünyasını Esas Alan Roman', 'Modernist Roman'
  ],
  'turk-cocuk-edebiyati': ['Türk Çocuk Edebiyatı'],
  'dunya-cocuk-edebiyati': ['Dünya Çocuk Edebiyatı'],
  'asik-tarzi': ['Âşık Edebiyatı'],
  'dini-tasavvufi': ['Tekke Edebiyatı']
};

function AuthorCard({ author, periodId, colorVar, bgVar, onSelect, onSelectMovement }) {
  const { categorySlug, periodSlug } = useParams();
  const { imageUrl: wikiUrl, loading: wikiLoading } = useAuthorPhoto(author.name, author.wikiPage);
  const isCumhuriyet = periodId === 'cumhuriyet-donemi';
  const displayUrl = author.image || wikiUrl;
  const isLoading = author.image ? false : wikiLoading;

  const filteredMovements = (author.movements || []).filter(m => {
    if (!periodId || !RELEVANT_TAGS[periodId]) return true;
    return RELEVANT_TAGS[periodId].includes(m.name);
  });

  return (
    <Link
      to={`/${categorySlug}/${periodSlug}/${author.id}`}
      className="author-card author-link glass"
      style={{ '--c': colorVar, '--bg': bgVar, textDecoration: 'none', color: 'inherit' }}
      aria-label={`${author.name} detaylarını aç`}
    >
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -5, scale: 1.02 }}
      >
        <div className="author-avatar">
          {isLoading ? (
            <div className="author-avatar-skeleton" />
          ) : displayUrl ? (
            <img
              src={displayUrl}
              alt={`${author.name} fotoğrafı`}
              className="author-avatar-img"
              loading="lazy"
              onError={e => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <span
            className="author-avatar-initials"
            style={{ display: (isLoading || displayUrl) ? 'none' : 'flex' }}
          >
            {getInitials(author.name)}
          </span>
        </div>
        <div className="author-name">{author.name}</div>
        {filteredMovements.length > 0 && (
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px', justifyContent: 'center'}}>
            {filteredMovements.map(m => (
              <span 
                key={m.name} 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onSelectMovement) {
                    onSelectMovement(m);
                  }
                }}
                style={{
                  fontSize: '0.65rem', 
                  padding: '2px 8px', 
                  borderRadius: '10px', 
                  background: m.color, 
                  color: '#fff', 
                  whiteSpace: 'nowrap', 
                  cursor: 'pointer', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  fontWeight: 600
                }}
              >
                {m.name}
              </span>
            ))}
          </div>
        )}
        <div className="author-work-count">
          <BookOpen size={12} />
          {author.works.length} eser
        </div>
      </motion.div>
    </Link>
  );
}

export default function AuthorsScreen({ period, onSelectAuthor, onBack }) {
  const cleanPeriodName = period.name.replace(/^[\p{Emoji}\s]+/u, '');
  

  const [search, setSearch] = React.useState('');
  const [selectedMovement, setSelectedMovement] = React.useState(null);

  const colorVar = periodColorVar[period.id] || 'var(--teal)';
  const bgVar    = periodBgVar[period.id]    || 'var(--teal-dim)';
  const emoji = period.name.match(/^(\p{Emoji})/u)?.[1] ?? '📖';
  const cleanName = period.name.replace(/^[\p{Emoji}\s]+/u, '');

  const { description, loading: descLoading } = usePeriodDescription(cleanName, period.description);

  const filtered = React.useMemo(() => {
    const query = search.toLocaleLowerCase('tr-TR').trim();
    if (!query) return period.authors;
    
    return period.authors.filter(a => {
      const authorMatch = a.name.toLocaleLowerCase('tr-TR').includes(query);
      const workMatch   = a.works.some(w => 
        w.name.toLocaleLowerCase('tr-TR').includes(query) || 
        w.type.toLocaleLowerCase('tr-TR').includes(query)
      );
      return authorMatch || workMatch;
    });
  }, [period.authors, search]);

  const sortedFiltered = React.useMemo(() => {
    const list = [...filtered];
    if (true) { // Tüm dönemlerde movement bazlı sıralama yapılsın
      list.sort((a, b) => {
        const orderA = a.movements && a.movements.length > 0 ? a.movements[0].order : 999;
        const orderB = b.movements && b.movements.length > 0 ? b.movements[0].order : 999;
        if (orderA !== orderB) return orderA - orderB;
        return a.name.localeCompare(b.name, 'tr-TR');
      });
    } else {
      list.sort((a, b) => a.name.localeCompare(b.name, 'tr-TR'));
    }
    return list;
  }, [filtered, period.id]);

  return (
    <div className="animate-in">
      <div className="section-header">
        <div>
          <div
            className="section-period-badge"
            style={{ '--c': colorVar, '--bg': bgVar }}
          >
            {emoji} {cleanName}
          </div>
          <h1 className="page-title">{cleanName} Yazarları</h1>
          <p className="page-subtitle">
            {sortedFiltered.length} yazar listeleniyor — bir yazara tıkla, detayları keşfet.
          </p>
        </div>

        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input
            id="author-search"
            className="search-input"
            type="search"
            placeholder="Yazar veya eser ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Yazar veya eser ara"
          />
          {search && (
            <button 
              className="search-clear" 
              onClick={() => setSearch('')}
              aria-label="Aramayı temizle"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Dönem Açıklaması */}
      {descLoading ? (
        <PeriodDescSkeleton />
      ) : (
        <div
          className="period-description-banner animate-in glass-premium"
          style={{ '--c': colorVar, '--bg': bgVar }}
        >
          <span className="period-desc-icon">{emoji}</span>
          <div className="period-desc-body">
            {description?.text ? (
              <>
                <p className="period-desc-text">{description.text}</p>
                {description.pageUrl && (
                  <a
                    href={description.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="period-desc-link"
                  >
                    Wikipedia'da oku →
                  </a>
                )}
              </>
            ) : (
              <p className="period-desc-text period-desc-empty">
                Bu dönem için açıklama bulunamadı.
              </p>
            )}
          </div>
        </div>
      )}

      {sortedFiltered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔎</span>
          <p>"{search}" ile eşleşen yazar bulunamadı.</p>
        </div>
      ) : (
        <div className="authors-grid stagger">
          {sortedFiltered.map((author) => (
            <AuthorCard
              key={author.id}
              author={author}
              periodId={period.id}
              colorVar={colorVar}
              bgVar={bgVar}
              onSelect={onSelectAuthor}
              onSelectMovement={setSelectedMovement}
            />
          ))}
        </div>
      )}
      
      {selectedMovement && (
        <MovementModal 
          movement={selectedMovement} 
          onClose={() => setSelectedMovement(null)} 
        />
      )}
    </div>
  );
}
