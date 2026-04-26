import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, RefreshCcw, Hand, HelpCircle, Star, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MatchingGame({ categories }) {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('START'); // START, PLAYING, WON
  const [score, setScore] = useState(0);
  const [matchedIds, setMatchedIds] = useState(new Set()); // id format: "authorId__workId"
  const [matchedAuthors, setMatchedAuthors] = useState(new Set());
  const [matchedWorks, setMatchedWorks] = useState(new Set());
  const [currentLevel, setCurrentLevel] = useState(1);

  const [currentCategory, setCurrentCategory] = useState('ALL');

  const allAuthors = useMemo(() => {
    const authors = [];
    categories.forEach(cat => {
      cat.periods.forEach(period => {
        period.authors.forEach(author => {
          if (author.works && author.works.length > 0) {
            authors.push({ ...author, categoryId: cat.id, categoryName: cat.name });
          }
        });
      });
    });
    return authors;
  }, [categories]);

  const [levelData, setLevelData] = useState({ authors: [], works: [] });

  const generateLevel = (catId = currentCategory) => {
    const filteredAuthors = catId === 'ALL' 
      ? allAuthors 
      : allAuthors.filter(a => a.categoryId === catId);

    if (filteredAuthors.length < 3) {
      alert("Bu kategoride yeterli yazar bulunamadı!");
      setGameState('START');
      return;
    }

    // 3 Rastgele yazar
    const shuffledAuthors = [...filteredAuthors].sort(() => Math.random() - 0.5);
    const selectedAuthors = shuffledAuthors.slice(0, 3);
    
    // 5 Eser seç (Seçilen 3 yazardan karma)
    const selectedWorks = [];
    for (let i = 0; i < 5; i++) {
      const randomAuthor = selectedAuthors[i % 3]; // Yazarları döndürerek eser seç
      const randomWork = randomAuthor.works[Math.floor(Math.random() * randomAuthor.works.length)];
      // Aynı eserin gelmemesi için kontrol (basit düzeyde)
      selectedWorks.push({ 
        ...randomWork, 
        authorId: randomAuthor.id, 
        authorName: randomAuthor.name,
        uniqueKey: `${randomWork.id}_${i}_${Math.random()}` 
      });
    }

    setLevelData({
      authors: selectedAuthors,
      works: selectedWorks.sort(() => Math.random() - 0.5)
    });
    setMatchedWorks(new Set());
    setGameState('PLAYING');
  };

  const handleDrag = (event, info) => {
    const { x, y } = info.point;
    const authorElements = document.querySelectorAll('.drop-target');
    
    authorElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        el.classList.add('drag-over');
      } else {
        el.classList.remove('drag-over');
      }
    });
  };

  const handleDragEnd = (event, info, workUniqueKey, correctAuthorId) => {
    // Tüm drag-over sınıflarını temizle
    document.querySelectorAll('.drop-target').forEach(el => el.classList.remove('drag-over'));
    
    const { x, y } = info.point;
    const authorElements = document.querySelectorAll('.drop-target');
    let droppedOnAuthorId = null;

    authorElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        droppedOnAuthorId = el.getAttribute('data-author-id');
      }
    });

    if (droppedOnAuthorId === correctAuthorId) {
      setMatchedWorks(prev => new Set([...prev, workUniqueKey]));
      setScore(s => s + 10);
    }
  };

  useEffect(() => {
    if (gameState === 'PLAYING') {
      if (matchedWorks.size === 5) {
        setTimeout(() => {
          setGameState('WON');
          setScore(s => s + 50);
        }, 600);
      }
    }
  }, [matchedWorks, gameState]);

  return (
    <div className="matching-game-container animate-in">
      <style>{`
        .matching-game-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 15px;
          min-height: 90vh;
          display: flex;
          flex-direction: column;
        }
        .authors-row {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 25px;
          margin-bottom: 50px;
        }
        .drop-target {
          width: 160px;
          height: 160px;
          border-radius: 32px;
          border: 4px dashed var(--border);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 15px;
          background: var(--bg-card);
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          font-size: 1rem;
          position: relative;
        }
        /* Sürükleme sırasında üzerine gelindiğinde */
        .drop-target.drag-over {
          border-color: var(--amber);
          background: var(--amber-dim);
          transform: scale(1.1);
          border-style: solid;
          box-shadow: 0 0 30px rgba(193, 127, 42, 0.2);
        }
        @media (max-width: 600px) {
          .drop-target {
            width: 135px;
            height: 135px;
            font-size: 0.8rem;
          }
          .work-drag-card {
            padding: 14px !important;
            font-size: 0.9rem !important;
          }
        }
        .drop-target.matched {
          border-color: var(--emerald);
          background: var(--emerald-dim);
          transform: scale(0.9);
          opacity: 0.5;
          pointer-events: none;
        }
        .works-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 15px;
          margin-top: auto;
          padding-bottom: 40px;
        }
        .work-drag-card {
          padding: 20px;
          background: var(--bg-card);
          border: 2px solid var(--border);
          border-radius: 16px;
          cursor: grab;
          text-align: center;
          box-shadow: var(--shadow-sm);
          font-weight: 700;
          touch-action: none;
          user-select: none;
          transition: box-shadow 0.2s;
        }
        .work-drag-card:active {
          cursor: grabbing;
          box-shadow: var(--shadow-lg);
        }
        .author-name-tag {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.9rem;
          margin-top: 8px;
        }
        .cat-select-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 10px;
          width: 100%;
          margin-top: 20px;
        }
        .cat-select-btn {
          padding: 10px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--bg-card);
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 600;
          font-size: 0.85rem;
        }
        .cat-select-btn.active {
          border-color: var(--amber);
          background: var(--amber-dim);
          color: var(--text-primary);
        }
      `}</style>

      <div className="game-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <button className="btn-back glass" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Geri
        </button>
        <div className="game-stats glass" style={{ padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold' }}>
          Skor: <span style={{ color: 'var(--amber)' }}>{score}</span>
        </div>
      </div>

      {gameState === 'START' ? (
        <div className="game-start-screen glass-premium" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px', borderRadius: '32px' }}>
          <div className="icon-pulse" style={{ background: 'var(--amber-dim)', padding: '30px', borderRadius: '50%', marginBottom: '24px' }}>
            <Hand size={48} color="var(--amber)" />
          </div>
          <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Eser Eşleştirme</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', marginBottom: '12px', fontSize: '1.1rem' }}>
            Aşağıdaki eser kartlarını doğru yazarların üzerine sürükle. 
          </p>
          
          <div style={{ width: '100%', maxWidth: '600px' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Kategori Seçin</p>
            <div className="cat-select-grid">
              <button 
                className={`cat-select-btn ${currentCategory === 'ALL' ? 'active' : ''}`}
                onClick={() => setCurrentCategory('ALL')}
              >
                Tüm Kategoriler
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  className={`cat-select-btn ${currentCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setCurrentCategory(cat.id)}
                >
                  {cat.name.replace(/^[\p{Emoji}\s]+/u, '')}
                </button>
              ))}
            </div>
          </div>

          <button className="btn-save-all" onClick={() => generateLevel()} style={{ fontSize: '1.2rem', padding: '16px 48px', marginTop: '40px' }}>
            Oyunu Başlat
          </button>
        </div>
      ) : gameState === 'WON' ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="game-won-card glass-premium"
          style={{ textAlign: 'center', padding: '60px', borderRadius: '32px' }}
        >
          <Trophy size={80} color="var(--amber)" style={{ margin: '0 auto 24px' }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Tebrikler!</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>Tüm eserleri doğru eşleştirdin.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-save-all" onClick={() => generateLevel()}>
              <RefreshCcw size={18} /> Sonraki Seviye
            </button>
            <button className="btn-secondary glass" onClick={() => setGameState('START')} style={{ borderRadius: '16px', padding: '12px 24px' }}>
              Kategori Değiştir
            </button>
            <button className="btn-back glass" onClick={() => navigate('/')} style={{ borderRadius: '16px', padding: '12px 24px' }}>
              Ana Sayfaya Dön
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="authors-row">
            {levelData.authors.map((author) => {
              // Bu yazarın tüm eserleri (bu turdaki) eşleşti mi?
              const isMatched = levelData.works
                .filter(w => w.authorId === author.id)
                .every(w => matchedWorks.has(w.uniqueKey));

              return (
                <motion.div
                  key={author.id}
                  data-author-id={author.id}
                  className={`drop-target glass ${isMatched ? 'matched' : ''}`}
                  layout
                >
                  <div className="author-photo-fallback" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                    {author.name.charAt(0)}
                  </div>
                  <div className="author-name-tag">{author.name}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {author.categoryName.replace(/^[\p{Emoji}\s]+/u, '')}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="works-grid">
            <AnimatePresence>
              {levelData.works.map((work) => {
                if (matchedWorks.has(work.uniqueKey)) return null;

                return (
                  <motion.div
                    key={work.uniqueKey}
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.1}
                    dragMomentum={false}
                    onDrag={(e, info) => handleDrag(e, info)}
                    onDragEnd={(e, info) => handleDragEnd(e, info, work.uniqueKey, work.authorId)}
                    whileDrag={{ scale: 1.05, zIndex: 100, boxShadow: 'var(--shadow-lg)' }}
                    className="work-drag-card glass-premium"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
                  >
                    <div style={{ fontSize: '0.75rem', color: 'var(--amber)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                      <Book size={14} /> Eser
                    </div>
                    <div style={{ fontSize: '1rem', lineHeight: '1.3' }}>{work.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                      {work.type}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="game-instructions" style={{ marginTop: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <HelpCircle size={16} /> Kartları yazarın üzerine sürükle ve bırak!
          </div>
        </>
      )}
    </div>
  );
}

