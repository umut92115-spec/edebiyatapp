import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Link } from 'react-router-dom';

export function GlobalSearch({ allCategories, onSelectAuthor }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results = useMemo(() => {
    const q = query.toLocaleLowerCase('tr-TR').trim();
    if (q.length < 2) return [];

    const matches = [];
    allCategories.forEach(cat => {
      cat.periods.forEach(period => {
        period.authors.forEach(author => {
          const authorMatch = author.name.toLocaleLowerCase('tr-TR').includes(q);
          const matchedWorks = author.works.filter(w => 
            w.name.toLocaleLowerCase('tr-TR').includes(q) ||
            w.type.toLocaleLowerCase('tr-TR').includes(q)
          );

          if (authorMatch || matchedWorks.length > 0) {
            matches.push({
              author,
              period,
              category: cat,
              matchedWorks,
              authorMatch
            });
          }
        });
      });
    });
    return matches.slice(0, 10); // Limit results
  }, [allCategories, query]);

  const handleSelect = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="global-search-container" ref={containerRef}>
      <div className="global-search-wrapper">
        <Search className="global-search-icon" size={16} />
        <input
          type="text"
          className="global-search-input"
          placeholder="Tüm atlası ara..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <button className="global-search-clear" onClick={() => setQuery('')}>
            <X size={14} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && query.length >= 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="global-search-results animate-in-fast"
          >
            {results.length > 0 ? (
              results.map((res, idx) => (
                <Link 
                  key={`${res.author.id}-${idx}`} 
                  to={`/${res.category.id}/${res.period.id}/${res.author.id}`}
                  className="search-result-item"
                  onClick={handleSelect}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <div className="result-main">
                    <span className="result-name">{res.author.name}</span>
                    <span className="result-period">{res.period.name.replace(/^[\p{Emoji}\s]+/u, '')}</span>
                  </div>
                  {res.matchedWorks.length > 0 && (
                    <div className="result-works">
                      {res.matchedWorks.slice(0, 2).map(w => (
                        <span key={w.id} className="result-work-tag">{w.name}</span>
                      ))}
                      {res.matchedWorks.length > 2 && <span className="result-more">+{res.matchedWorks.length - 2}</span>}
                    </div>
                  )}
                </Link>
              ))
            ) : (
              <div className="search-no-results">Sonuç bulunamadı.</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
