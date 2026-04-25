import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowLeft, RefreshCcw, CheckCircle2, XCircle, Brain, Target, BookOpen } from 'lucide-react';
import { useQuizScores } from '../hooks/useLocalStorage';

export function QuizScreen({ categories, onBack }) {
  const { scores, updateScore } = useQuizScores();
  const [gameState, setGameState] = useState('START'); // START, PLAYING, RESULT
  const [mode, setMode] = useState('NORMAL'); // NORMAL, EXAM
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerState, setAnswerState] = useState(null); // null, 'CORRECT', 'WRONG'
  const [streak, setStreak] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

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
  };

  const handleStartQuiz = (m) => {
    setMode(m);
    generateQuestion(m);
  };

  const handleAnswer = (authorId) => {
    if (answerState) return;

    const isCorrect = authorId === currentQuestion.correctAuthor.id;
    setAnswerState(isCorrect ? 'CORRECT' : 'WRONG');
    
    if (isCorrect) {
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }

    updateScore(isCorrect);

    // Otomatik sonraki soruya geç
    setTimeout(() => {
      generateQuestion();
    }, 1500);
  };

  return (
    <div className="quiz-container animate-in">
      <header className="quiz-header">
        <button className="header-back-btn" onClick={onBack}>
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
            <div className="question-card glass">
              <span className="question-label">Bu eser kime ait?</span>
              <h2 className="question-work-name">"{currentQuestion.work.name}"</h2>
              {currentQuestion.work.type && (
                <span className="question-work-type">{currentQuestion.work.type}</span>
              )}
            </div>

            <div className="options-grid">
              {currentQuestion.options.map(option => {
                const isCorrect = option.id === currentQuestion.correctAuthor.id;
                let btnClass = "option-btn glass";
                if (answerState) {
                  if (isCorrect) btnClass += " correct";
                  else if (answerState === 'WRONG' && option.id !== currentQuestion.correctAuthor.id) {
                    // Opsiyonel: yanlış seçileni işaretle
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

            {answerState === 'WRONG' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="wrong-feedback"
              >
                <XCircle size={20} /> Üzgünüm, doğru cevap: <strong>{currentQuestion.correctAuthor.name}</strong>
              </motion.div>
            )}
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
          border-radius: var(--radius-full);
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
          border-radius: var(--radius-xl);
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
          border-radius: var(--radius-full);
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
          background: var(--bg-card-hover);
        }
        .chip.active {
          background: var(--amber);
          color: white;
          border-color: var(--amber);
          box-shadow: 0 4px 12px var(--amber-dim);
        }
        .quiz-modes {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .quiz-mode-card {
          padding: 40px 32px;
          border-radius: var(--radius-xl);
          border: 1px solid var(--border);
          cursor: pointer;
          transition: var(--transition);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .quiz-mode-card:hover {
          transform: translateY(-8px);
          border-color: var(--amber);
          background: var(--bg-card-hover);
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
          border-radius: var(--radius-xl);
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
          border-radius: var(--radius-lg);
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
          background: var(--bg-card-hover);
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
        .wrong-feedback {
          margin-top: 24px;
          text-align: center;
          color: var(--rose);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  );
}
