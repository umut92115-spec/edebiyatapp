import { useState, useEffect } from 'react';

/**
 * useLocalStorage — Generic LocalStorage state hook.
 * İlk değer olarak initialValue ya da LS'deki değeri kullanır.
 */
export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const toStore = value instanceof Function ? value(stored) : value;
      setStored(toStore);
      window.localStorage.setItem(key, JSON.stringify(toStore));
    } catch (err) {
      console.warn('LocalStorage yazma hatası:', err);
    }
  };

  return [stored, setValue];
}

/**
 * useFavorites — Favori eserleri yönetir.
 * Her eser için key: `${authorId}__${workId}`
 */
export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage('edebiyat_favorites', {});

  const isFavorite = (authorId, workId) =>
    !!favorites[`${authorId}__${workId}`];

  const toggleFavorite = (authorId, workId) => {
    const key = `${authorId}__${workId}`;
    setFavorites(prev => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  };

  return { favorites, isFavorite, toggleFavorite };
}

/**
 * useAuthorFavorites — Favori yazarları yönetir.
 */
export function useAuthorFavorites() {
  const [favAuthors, setFavAuthors] = useLocalStorage('edebiyat_fav_authors', {});

  const isAuthorFavorite = (authorId) => !!favAuthors[authorId];

  const toggleAuthorFavorite = (authorId) => {
    setFavAuthors(prev => {
      const next = { ...prev };
      if (next[authorId]) delete next[authorId];
      else next[authorId] = true;
      return next;
    });
  };

  return { favAuthors, isAuthorFavorite, toggleAuthorFavorite };
}

/**
 * useEdits — Yazar ve eser düzenlemelerini (CRUD) yönetir.
 * Yapı: { [authorId]: { notes: string, works: { [workId]: { name, description } } } }
 */
export function useEdits() {
  const [edits, setEdits] = useLocalStorage('edebiyat_edits', {});

  const getAuthorNotes = (authorId) =>
    edits[authorId]?.notes ?? '';

  const saveAuthorNotes = (authorId, notes) => {
    setEdits(prev => ({
      ...prev,
      [authorId]: { ...prev[authorId], notes },
    }));
  };

  const getWorkEdit = (authorId, workId) =>
    edits[authorId]?.works?.[workId] ?? null;

  const saveWorkEdit = (authorId, workId, data) => {
    setEdits(prev => ({
      ...prev,
      [authorId]: {
        ...prev[authorId],
        works: {
          ...prev[authorId]?.works,
          [workId]: data,
        },
      },
    }));
  };

  const deleteWorkEdit = (authorId, workId) => {
    setEdits(prev => {
      if (!prev[authorId]?.works?.[workId]) return prev;
      const works = { ...prev[authorId].works };
      delete works[workId];
      return { ...prev, [authorId]: { ...prev[authorId], works } };
    });
  };

  return { getAuthorNotes, saveAuthorNotes, getWorkEdit, saveWorkEdit, deleteWorkEdit };
}

/**
 * useQuizScores — Quiz skorlarını yönetir.
 */
export function useQuizScores() {
  const [scores, setScores] = useLocalStorage('edebiyat_quiz_scores', {
    bestStreak: 0,
    totalAnswered: 0,
    correctAnswers: 0
  });

  const updateScore = (isCorrect) => {
    setScores(prev => ({
      ...prev,
      totalAnswered: prev.totalAnswered + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      bestStreak: isCorrect ? Math.max(prev.bestStreak, (prev.currentStreak || 0) + 1) : prev.bestStreak,
      currentStreak: isCorrect ? (prev.currentStreak || 0) + 1 : 0
    }));
  };

  return { scores, updateScore };
}
