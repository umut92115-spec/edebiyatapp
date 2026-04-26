import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Trophy, ArrowLeft, CheckCircle2, XCircle, Brain, Target, BookOpen } from 'lucide-react';
import { useQuizScores } from '../hooks/useLocalStorage';

export default function QuizScreen({ categories, onBack }) {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate('/'));
  const { scores, updateScore } = useQuizScores();
  
  const currentUrl = "https://edebiyatapp.vercel.app/quiz";
  const pageTitle = "🖋️ Edebiyat Quiz — Bilgini Test Et | Türk Edebiyatı Atlası";
  const pageDesc = "Türk edebiyatı yazarları ve eserleri üzerine interaktif quiz. 🖋️ YKS AYT edebiyat hazırlığı için kendinizi test edin.";

  const [gameState, setGameState] = useState('START'); // START, PLAYING, RESULT
  const [mode, setMode] = useState('NORMAL'); // NORMAL, EXAM
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerState, setAnswerState] = useState(null); // null, 'CORRECT', 'WRONG'
  const [streak, setStreak] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showExplanation, setShowExplanation] = useState(false);

  // Veriden rastgele yazar ve eser seçimi
  const allAuthors = useMemo(() => {
    const authors = [];
    categories.forEach(cat => {
      cat.periods.forEach(period => {
        period.authors.forEach(author => {
          authors.push({ ...author, categoryId: cat.id, periodName: period.name });
        });
      });
    });
    return authors;
  }, [categories]);

  const filteredAuthors = useMemo(() => {
    if (selectedCategory === 'ALL') return allAuthors;
    return allAuthors.filter(a => a.categoryId === selectedCategory);
  }, [allAuthors, selectedCategory]);

  const examAuthors = useMemo(() => {
    return filteredAuthors.filter(a => a.examCount > 0);
  }, [filteredAuthors]);

  const generateQuestion = (forcedMode) => {
    setAnswerState(null);
    const activeMode = forcedMode || mode;
    const pool = activeMode === 'EXAM' ? examAuthors : filteredAuthors;
    
    if (pool.length < 4) {
      alert("Seçilen kategoride yeterli yazar bulunamadı! Lütfen başka bir kategori seçin.");
      setGameState('START');
      return;
    }

    // Doğru cevap
    const correctAuthor = pool[Math.floor(Math.random() * pool.length)];
    const work = correctAuthor.works[Math.floor(Math.random() * correctAuthor.works.length)];
    
    // Yanlış cevaplar - Aynı tag (akım) ve döneme sahip olanları önceliklendir
    const distractors = [];
    const correctMovements = (correctAuthor.movements || []).map(m => m.name);
    
    // Aday havuzlarını oluştur (Tüm yazarlar arasından seçebiliriz ama aynı kategoriden olanları yine önceliklendirmeliyiz)
    const sameMovementAuthors = allAuthors.filter(a => 
      a.id !== correctAuthor.id && 
      (a.movements || []).some(m => correctMovements.includes(m.name))
    );
    
    const samePeriodAuthors = allAuthors.filter(a => 
      a.id !== correctAuthor.id && 
      a.periodName === correctAuthor.periodName &&
      !sameMovementAuthors.some(sa => sa.id === a.id)
    );

    const sameCategoryAuthors = allAuthors.filter(a => 
      a.id !== correctAuthor.id && 
      a.categoryId === correctAuthor.categoryId &&
      !sameMovementAuthors.some(sa => sa.id === a.id) &&
      !samePeriodAuthors.some(sa => sa.id === a.id)
    );

    const otherAuthors = allAuthors.filter(a => 
      a.id !== correctAuthor.id &&
      !sameMovementAuthors.some(sa => sa.id === a.id) &&
      !samePeriodAuthors.some(sa => sa.id === a.id) &&
      !sameCategoryAuthors.some(sa => sa.id === a.id)
    );

    // Öncelik sırasına göre doldur
    const combinedPool = [
      ...sameMovementAuthors.sort(() => Math.random() - 0.5),
      ...samePeriodAuthors.sort(() => Math.random() - 0.5),
      ...sameCategoryAuthors.sort(() => Math.random() - 0.5),
      ...otherAuthors.sort(() => Math.random() - 0.5)
    ];

    while (distractors.length < 3 && combinedPool.length > 0) {
      const candidate = combinedPool.shift();
      if (!distractors.some(d => d.id === candidate.id)) {
        distractors.push(candidate);
      }
    }

    const options = [...distractors, correctAuthor].sort(() => Math.random() - 0.5);

    setCurrentQuestion({
      work,
      correctAuthor,
      options
    });
    setGameState('PLAYING');
    setShowExplanation(false);
  };

  const handleStartQuiz = (m) => {
    setMode(m);
    generateQuestion(m);
  };

  const handleAnswer = (authorId) => {
    if (answerState) return;

    const isCorrect = authorId === currentQuestion.correctAuthor.id;
    setAnswerState(isCorrect ? 'CORRECT' : 'WRONG');
    setShowExplanation(true);
    
    if (isCorrect) {
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }

    updateScore(isCorrect);
  };

  const handleNextQuestion = () => {
    generateQuestion();
  };

  return (
    <div className="quiz-container animate-in">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={currentUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://edebiyatapp.vercel.app/og-image.png" />
        <meta property="og:site_name" content="Türk Edebiyatı Atlası" />
      </Helmet>

      <header className="quiz-header">
        <button className="header-back-btn" onClick={handleBack}>
          <ArrowLeft size={20} />
        </button>
        <div className="quiz-stats">
          <div className="stat-item">
            <Trophy size={16} /> En İyi: {scores.bestStreak}
          </div>
          <div className="stat-item streak">
            🔥 Seri: {streak}
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {gameState === 'START' && (
          <motion.div 
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="quiz-start-screen"
          >
            <div className="quiz-hero">
              <Brain size={64} className="quiz-hero-icon" />
              <h1>Edebiyat Quiz</h1>
              <p>Bilgini test et, edebiyat atlasında ustalaş!</p>
            </div>

            <div className="category-selector-wrap">
              <span className="selector-label">Soru Havuzu Seçin</span>
              <div className="category-chips">
                <button 
                  className={`chip ${selectedCategory === 'ALL' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('ALL')}
                >
                  🌐 Tüm Dönemler
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    className={`chip ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="quiz-modes">
              <button 
                className="quiz-mode-card glass"
                onClick={() => handleStartQuiz('NORMAL')}
              >
                <BookOpen size={32} />
                <h3>Eser-Yazar Eşleştirme</h3>
                <p>Seçili kategoriden karma sorular.</p>
              </button>

              <button 
                className="quiz-mode-card glass premium"
                onClick={() => handleStartQuiz('EXAM')}
              >
                <Target size={32} />
                <h3>Sınav Maratonu</h3>
                <p>ÖSYM'nin en çok sorduğu yazarlar.</p>
              </button>
            </div>
          </motion.div>
        )}

        {gameState === 'PLAYING' && currentQuestion && (
          <motion.div 
            key="playing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="quiz-play-screen"
          >
            <div className="question-card glass-premium">
              <span className="question-label">Bu eser kime ait?</span>
              <h2 className="question-work-name">"{currentQuestion.work.name}"</h2>
              {currentQuestion.work.type && (
                <span className="question-work-type">{currentQuestion.work.type}</span>
              )}
            </div>

            <div className="options-grid">
              {currentQuestion.options.map(option => {
                const isCorrect = option.id === currentQuestion.correctAuthor.id;
                const isSelected = answerState && option.id === (answerState === 'CORRECT' ? currentQuestion.correctAuthor.id : null); // Simple check for visual feedback
                
                let btnClass = "option-btn glass";
                if (answerState) {
                  if (isCorrect) btnClass += " correct";
                  else if (option.id !== currentQuestion.correctAuthor.id && answerState === 'WRONG') {
                    // We don't track which one they clicked specifically in state yet, 
                    // but we can color the correct one and show feedback.
                  }
                }

                return (
                  <button
                    key={option.id}
                    className={btnClass}
                    onClick={() => handleAnswer(option.id)}
                    disabled={!!answerState}
                  >
                    {option.name}
                    {answerState && isCorrect && <CheckCircle2 size={18} className="feedback-icon" />}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {showExplanation && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="explanation-card glass-premium"
                >
                  <div className="explanation-header">
                    {answerState === 'CORRECT' ? (
                      <span className="feedback-badge success"><CheckCircle2 size={16} /> Doğru!</span>
                    ) : (
                      <span className="feedback-badge error"><XCircle size={16} /> Yanlış</span>
                    )}
                    <h3>{currentQuestion.correctAuthor.name}</h3>
                  </div>
                  
                  <div className="explanation-content">
                    {currentQuestion.work.description ? (
                      <p className="work-desc">
                        <strong>Eser Hakkında:</strong> {currentQuestion.work.description}
                      </p>
                    ) : (
                      <p className="author-bio">
                        {currentQuestion.correctAuthor.bio && (
                          <><strong>Yazar Hakkında:</strong> {currentQuestion.correctAuthor.bio.slice(0, 200)}...</>
                        )}
                      </p>
                    )}
                  </div>

                  <button className="btn-next-quiz" onClick={handleNextQuestion}>
                    Sıradaki Soru <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .quiz-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          min-height: 70vh;
        }
        .quiz-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }
        .quiz-stats {
          display: flex;
          gap: 16px;
        }
        .stat-item {
          background: var(--bg-card);
          padding: 8px 16px;
          border-radius: 99px;
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--border);
        }
        .stat-item.streak {
          background: var(--amber-dim);
          color: var(--amber);
          border-color: var(--amber);
        }
        .quiz-start-screen {
          text-align: center;
          padding: 40px 0;
        }
        .quiz-hero-icon {
          color: var(--amber);
          margin-bottom: 24px;
        }
        .quiz-start-screen h1 {
          font-family: var(--font-display);
          font-size: 3rem;
          margin-bottom: 12px;
        }
        .quiz-start-screen p {
          color: var(--text-muted);
          font-size: 1.2rem;
          margin-bottom: 48px;
        }
        .category-selector-wrap {
          margin-bottom: 48px;
          text-align: left;
          background: var(--bg-card);
          padding: 24px;
          border-radius: 24px;
          border: 1px solid var(--border);
        }
        .selector-label {
          display: block;
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-muted);
          margin-bottom: 16px;
        }
        .category-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .chip {
          padding: 10px 20px;
          border-radius: 99px;
          border: 1px solid var(--border);
          background: var(--bg-surface);
          color: var(--text-primary);
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .chip:hover {
          border-color: var(--amber);
        }
        .chip.active {
          background: var(--amber);
          color: white;
          border-color: var(--amber);
          box-shadow: 0 4px 12px rgba(193, 127, 42, 0.3);
        }
        .quiz-modes {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .quiz-mode-card {
          padding: 40px 32px;
          border-radius: 24px;
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .quiz-mode-card:hover {
          transform: translateY(-8px);
          border-color: var(--amber);
        }
        .quiz-mode-card.premium {
          background: linear-gradient(135deg, var(--bg-card) 0%, var(--amber-dim) 100%);
        }
        .quiz-mode-card h3 {
          font-size: 1.3rem;
          margin: 0;
        }
        .quiz-mode-card p {
          font-size: 0.9rem;
          margin: 0;
          opacity: 0.7;
        }
        .question-card {
          padding: 64px 40px;
          border-radius: 24px;
          text-align: center;
          margin-bottom: 32px;
          border: 2px solid var(--border);
        }
        .question-label {
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 16px;
          display: block;
        }
        .question-work-name {
          font-family: var(--font-display);
          font-size: 2.5rem;
          margin-bottom: 12px;
        }
        .question-work-type {
          background: var(--bg-surface);
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .option-btn {
          padding: 24px;
          border-radius: 16px;
          font-family: var(--font-body);
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          position: relative;
        }
        .option-btn:hover:not(:disabled) {
          border-color: var(--amber);
          transform: translateY(-2px);
        }
        .option-btn.correct {
          background: #dcfce7;
          border-color: #22c55e;
          color: #166534;
        }
        .option-btn.correct .feedback-icon {
          color: #22c55e;
        }
        .explanation-card {
          margin-top: 32px;
          padding: 32px;
          border-radius: 24px;
          border: 1px solid var(--border);
          text-align: left;
          animation: slideUp 0.4s ease-out;
        }
        .explanation-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        .explanation-header h3 {
          font-family: var(--font-display);
          font-size: 1.5rem;
          margin: 0;
        }
        .feedback-badge {
          padding: 4px 12px;
          border-radius: 99px;
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          text-transform: uppercase;
        }
        .feedback-badge.success {
          background: #dcfce7;
          color: #166534;
        }
        .feedback-badge.error {
          background: #fee2e2;
          color: #991b1b;
        }
        .explanation-content {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: 24px;
        }
        .btn-next-quiz {
          width: 100%;
          padding: 16px;
          background: var(--amber);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.2s;
        }
        .btn-next-quiz:hover {
          background: var(--gold);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(193, 127, 42, 0.2);
        }
        .wrong-feedback {
          display: none; /* Replaced by explanation card */
        }
        @media (max-width: 768px) {
          .quiz-start-screen h1 { font-size: 2.2rem; }
          .quiz-modes { grid-template-columns: 1fr; }
          .question-work-name { font-size: 1.8rem; }
          .options-grid { grid-template-columns: 1fr; }
          .quiz-header { padding: 0; }
        }
      `}</style>
    </div>
  );
}
