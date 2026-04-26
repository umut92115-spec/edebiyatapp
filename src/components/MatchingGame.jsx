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

  const [currentCategory, setCurrentCategory] = useState('ALL'); // 'ALL' or Category ID

  // Veriden rastgele yazar ve eser seçimi
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
    // Kategoriye göre filtrele
    const filteredAuthors = catId === 'ALL' 
      ? allAuthors 
      : allAuthors.filter(a => a.categoryId === catId);

    if (filteredAuthors.length < 3) {
      alert("Bu kategoride yeterli yazar bulunamadı! Lütfen başka bir kategori seçin.");
      setGameState('START');
      return;
    }

    // 3 Rastgele yazar seç
    const shuffledAuthors = [...filteredAuthors].sort(() => Math.random() - 0.5);
    const selectedAuthors = shuffledAuthors.slice(0, 3);
    
    // Her yazardan 1 eser + 1 tane de çeldirici veya ekstra eser
    const selectedWorks = [];
    selectedAuthors.forEach(author => {
      const randomWork = author.works[Math.floor(Math.random() * author.works.length)];
      selectedWorks.push({ ...randomWork, authorId: author.id, authorName: author.name });
    });

    // 4. Eser: Seçilen kategorideki yazarlardan birinin başka eseri
    const fourthWorkSource = filteredAuthors[Math.floor(Math.random() * filteredAuthors.length)];
    const fourthWork = fourthWorkSource.works[Math.floor(Math.random() * fourthWorkSource.works.length)];
    selectedWorks.push({ ...fourthWork, authorId: fourthWorkSource.id, authorName: fourthWorkSource.name });

    setLevelData({
      authors: selectedAuthors,
      works: selectedWorks.sort(() => Math.random() - 0.5)
    });
    setMatchedIds(new Set());
    setMatchedAuthors(new Set());
    setMatchedWorks(new Set());
    setGameState('PLAYING');
  };

  const handleDragEnd = (event, info, workId, correctAuthorId) => {
    // Mouse/Touch pozisyonunu al
    const dropX = info.point.x;
    const dropY = info.point.y;

    // Yazar elemanlarını bul ve çarpışma kontrolü yap
    const authorElements = document.querySelectorAll('.drop-target');
    let droppedOnAuthorId = null;

    authorElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (
        dropX >= rect.left &&
        dropX <= rect.right &&
        dropY >= rect.top &&
        dropY <= rect.bottom
      ) {
        droppedOnAuthorId = el.getAttribute('data-author-id');
      }
    });

    if (droppedOnAuthorId === correctAuthorId) {
      // Doğru eşleşme!
      setMatchedWorks(prev => new Set([...prev, workId]));
      setScore(s => s + 10);
    }
  };

  useEffect(() => {
    if (gameState === 'PLAYING') {
      const totalPossibleMatches = levelData.works.filter(w => 
        levelData.authors.some(a => a.id === w.authorId)
      ).length;

      if (matchedWorks.size === totalPossibleMatches && totalPossibleMatches > 0) {
        setTimeout(() => {
          setGameState('WON');
          setScore(s => s + 50);
        }, 600);
      }
    }
  }, [matchedWorks, levelData, gameState]);

  return (
    <div className="matching-game-container animate-in">
      <style>{`
        .matching-game-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          min-height: 80vh;
          display: flex;
          flex-direction: column;
        }
        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }
        .authors-row {
          display: flex;
          justify-content: space-around;
          gap: 20px;
          margin-bottom: 60px;
          min-height: 180px;
        }
        .drop-target {
          width: 160px;
          height: 160px;
          border-radius: 50%;
          border: 3px dashed var(--border);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 15px;
          background: var(--bg-card);
          transition: all 0.3s;
          position: relative;
        }
        .drop-target.active {
          border-color: var(--amber);
          background: var(--amber-dim);
          transform: scale(1.05);
        }
        .drop-target.matched {
          border-color: var(--emerald);
          background: var(--emerald-dim);
          opacity: 0;
          transform: scale(0.8);
          pointer-events: none;
        }
        .works-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-top: auto;
        }
        .work-drag-card {
          padding: 20px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          cursor: grab;
          text-align: center;
          box-shadow: var(--shadow-sm);
          font-weight: 600;
          z-index: 10;
        }
        .work-drag-card:active {
          cursor: grabbing;
        }
        .author-name-tag {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1rem;
          margin-top: 8px;
        }
        .game-won-card {
          text-align: center;
          padding: 60px;
          border-radius: 32px;
        }
        .cat-select-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          width: 100%;
          margin-top: 24px;
        }
        .cat-select-btn {
          padding: 12px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--bg-card);
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .cat-select-btn.active {
          border-color: var(--amber);
          background: var(--amber-dim);
          color: var(--text-primary);
        }
      `}</style>

      <div className="game-header">
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
              // Bu yazarın tüm eserleri eşleşti mi?
              const isMatched = levelData.works
                .filter(w => w.authorId === author.id)
                .every(w => matchedWorks.has(w.id));

              return (
                <motion.div
                  key={author.id}
                  data-author-id={author.id}
                  className={`drop-target glass ${isMatched ? 'matched' : ''}`}
                  layout
                >
                  <div className="author-photo-fallback" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                    {author.name.charAt(0)}
                  </div>
                  <div className="author-name-tag">{author.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {author.categoryName.replace(/^[\p{Emoji}\s]+/u, '')}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="works-grid">
            <AnimatePresence>
              {levelData.works.map((work) => {
                if (matchedWorks.has(work.id)) return null;

                return (
                  <motion.div
                    key={work.id}
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, info) => handleDragEnd(e, info, work.id, work.authorId)}
                    whileDrag={{ scale: 1.1, zIndex: 100, boxShadow: 'var(--shadow-lg)' }}
                    className="work-drag-card glass-premium"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
                  >
                    <div style={{ fontSize: '0.8rem', color: 'var(--amber)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                      <Book size={14} /> Eser
                    </div>
                    <div style={{ fontSize: '1.1rem' }}>{work.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                      Tür: {work.type}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="game-instructions" style={{ marginTop: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <HelpCircle size={16} /> Kartları yazarın üzerine sürükle ve bırak!
          </div>
        </>
      )}
    </div>
  );
}

