import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Trash2, Heart, User, Book, Edit3 } from 'lucide-react';
import { useFavorites, useAuthorFavorites, useEdits } from '../hooks/useLocalStorage';
import { Link } from 'react-router-dom';

export function FavoritesSidebar({ allCategories, onSelectAuthor }) {
  const { favorites, toggleFavorite } = useFavorites();
  const { favAuthors, toggleAuthorFavorite } = useAuthorFavorites();
  const { getAuthorNotes } = useEdits();
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('works'); // 'works' or 'authors'
  const overlayRef = useRef(null);

  // ESC ile kapat
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    if (isOpen) {
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) setIsOpen(false);
  };

  const favWorksList = useMemo(() => {
    const list = [];
    Object.keys(favorites).forEach(key => {
      if (!favorites[key]) return;
      const [authorId, workId] = key.split('__');
      
      let found = null;
      for (const cat of allCategories) {
        for (const period of cat.periods || []) {
          const author = period.authors?.find(a => a.id === authorId);
          if (author) {
            const work = author.works?.find(w => w.id === workId);
            if (work) {
              found = { 
                authorName: author.name, 
                workName: work.name, 
                authorId, 
                workId,
                periodName: period.name,
                fullAuthor: author,
                fullPeriod: period,
                fullCategory: cat
              };
              break;
            }
          }
        }
        if (found) break;
      }
      if (found) list.push(found);
    });
    return list;
  }, [favorites, allCategories]);

  const favAuthorsList = useMemo(() => {
    const list = [];
    Object.keys(favAuthors).forEach(authorId => {
      if (!favAuthors[authorId]) return;
      
      let found = null;
      for (const cat of allCategories) {
        for (const period of cat.periods || []) {
          const author = period.authors?.find(a => a.id === authorId);
          if (author) {
            found = {
              name: author.name,
              id: authorId,
              periodName: period.name,
              fullAuthor: author,
              fullPeriod: period,
              fullCategory: cat,
              hasNote: !!getAuthorNotes(authorId)
            };
            break;
          }
        }
        if (found) break;
      }
      if (found) list.push(found);
    });
    return list;
  }, [favAuthors, allCategories, getAuthorNotes]);

  const handleCardClick = () => {
    setIsOpen(false);
  };

  const totalFavs = favWorksList.length + favAuthorsList.length;

  return (
    <>
      <button 
        className="favorites-toggle-btn" 
        onClick={() => setIsOpen(true)}
        title="Favorilerimi Göster"
      >
        <Heart size={16} fill={totalFavs > 0 ? "currentColor" : "none"} /> 
        Favorilerim {totalFavs > 0 && <span className="fav-count">{totalFavs}</span>}
      </button>

      {typeof document !== 'undefined' && isOpen && createPortal(
        <AnimatePresence>
          <div 
            className="modal-overlay" 
            ref={overlayRef} 
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
          >
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="modal-panel favorites-modal-panel glass"
            >
              <div className="modal-header fav-modal-header">
                <h2 className="modal-author-name"><Heart size={20} fill="var(--rose)" color="var(--rose)" /> Kütüphanem</h2>
                <button 
                  className="modal-close" 
                  onClick={() => setIsOpen(false)}
                  aria-label="Modalı kapat"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="fav-tabs">
                <button 
                  className={`fav-tab ${activeTab === 'works' ? 'active' : ''}`}
                  onClick={() => setActiveTab('works')}
                >
                  <Book size={14} /> Eserler ({favWorksList.length})
                </button>
                <button 
                  className={`fav-tab ${activeTab === 'authors' ? 'active' : ''}`}
                  onClick={() => setActiveTab('authors')}
                >
                  <User size={14} /> Yazarlar ({favAuthorsList.length})
                </button>
              </div>
              
              <div className="modal-body fav-modal-body">
                {activeTab === 'works' ? (
                  favWorksList.length === 0 ? (
                    <div className="empty-state">
                      <span className="empty-icon"><Book size={48} opacity={0.2} /></span>
                      <p>Henüz favori eseriniz bulunmuyor.</p>
                    </div>
                  ) : (
                    <div className="fav-list-container">
                      {allCategories.map(cat => {
                        const catWorks = favWorksList.filter(f => f.fullCategory.id === cat.id);
                        if (catWorks.length === 0) return null;
                        return (
                          <div key={cat.id} className="fav-category-group" style={{ marginBottom: '30px' }}>
                            <h3 style={{ 
                              fontSize: '0.8rem', 
                              textTransform: 'uppercase', 
                              letterSpacing: '0.1em', 
                              color: 'var(--text-muted)',
                              marginBottom: '16px',
                              paddingBottom: '8px',
                              borderBottom: '1px solid var(--border)'
                            }}>
                              {cat.name.replace(/^[\p{Emoji}\s]+/u, '')}
                            </h3>
                            <div className="fav-grid">
                              <AnimatePresence>
                                {catWorks.map(fav => (
                                  <motion.div 
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={`${fav.authorId}__${fav.workId}`} 
                                    className="fav-grid-card"
                                  >
                                    <Link 
                                      to={`/${fav.fullCategory.id}/${fav.fullPeriod.id}/${fav.authorId}`}
                                      className="fav-card-content" 
                                      onClick={handleCardClick} 
                                      style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                                    >
                                      <div className="fav-work-name" title={fav.workName}>{fav.workName}</div>
                                      <div className="fav-author-name">{fav.authorName}</div>
                                      <div className="fav-period-name">{fav.periodName.replace(/^[\p{Emoji}\s]+/u, '')}</div>
                                    </Link>
                                    <button 
                                      className="fav-card-remove"
                                      onClick={() => toggleFavorite(fav.authorId, fav.workId)}
                                      title="Favorilerden Çıkar"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (
                  favAuthorsList.length === 0 ? (
                    <div className="empty-state">
                      <span className="empty-icon"><User size={48} opacity={0.2} /></span>
                      <p>Henüz favori yazarınız bulunmuyor.</p>
                    </div>
                  ) : (
                    <div className="fav-list-container">
                      {allCategories.map(cat => {
                        const catAuthors = favAuthorsList.filter(f => f.fullCategory.id === cat.id);
                        if (catAuthors.length === 0) return null;
                        return (
                          <div key={cat.id} className="fav-category-group" style={{ marginBottom: '30px' }}>
                            <h3 style={{ 
                              fontSize: '0.8rem', 
                              textTransform: 'uppercase', 
                              letterSpacing: '0.1em', 
                              color: 'var(--text-muted)',
                              marginBottom: '16px',
                              paddingBottom: '8px',
                              borderBottom: '1px solid var(--border)'
                            }}>
                              {cat.name.replace(/^[\p{Emoji}\s]+/u, '')}
                            </h3>
                            <div className="fav-grid">
                              <AnimatePresence>
                                {catAuthors.map(fav => (
                                  <motion.div 
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={fav.id} 
                                    className="fav-grid-card"
                                  >
                                    <Link 
                                      to={`/${fav.fullCategory.id}/${fav.fullPeriod.id}/${fav.id}`}
                                      className="fav-card-content" 
                                      onClick={handleCardClick} 
                                      style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                                    >
                                      <div className="fav-author-name" style={{ fontSize: '1rem', fontWeight: 700 }}>{fav.name}</div>
                                      <div className="fav-period-name">{fav.periodName.replace(/^[\p{Emoji}\s]+/u, '')}</div>
                                      {fav.hasNote && (
                                        <div className="fav-note-indicator">
                                          <Edit3 size={12} /> Notun var
                                        </div>
                                      )}
                                    </Link>
                                    <button 
                                      className="fav-card-remove"
                                      onClick={() => toggleAuthorFavorite(fav.id)}
                                      title="Favorilerden Çıkar"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                )}
              </div>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
