import { useState, useCallback, useRef } from 'react';
import { fetchAuthorWikipediaData } from '../services/wikipediaApi';

/**
 * useWikipedia Hook
 *
 * Lazy loading + In-memory caching mantığıyla çalışır:
 * - Uygulama açılışında hiçbir istek atılmaz.
 * - fetchAuthor(authorName) çağrıldığında istek atılır.
 * - Aynı yazara ikinci kez tıklanırsa cache'den anında döner (0 API isteği).
 * - Yükleme süresince isLoading=true olur (skeleton/spinner için).
 * - Hata durumunda error state dolar ama uygulama çökmez.
 */
export function useWikipedia() {
  // Cache: { [authorName]: WikipediaData | null }
  // useRef kullanıyoruz; re-render tetiklememesi için.
  const cache = useRef({});

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAuthor, setCurrentAuthor] = useState(null);

  const fetchAuthor = useCallback(async (authorName, explicitPageTitle = null) => {
    if (!authorName) return;

    // Cache key: use explicit title if provided, otherwise name
    const cacheKey = explicitPageTitle || authorName;

    // Aynı yazar tekrar tıklandıysa hiçbir şey yapma
    if (currentAuthor === cacheKey && data !== undefined) return;

    // Cache kontrolü: veri zaten varsa anında set et
    if (Object.prototype.hasOwnProperty.call(cache.current, cacheKey)) {
      setCurrentAuthor(cacheKey);
      setData(cache.current[cacheKey]);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Yeni istek: loading başlat
    setCurrentAuthor(cacheKey);
    setIsLoading(true);
    setError(null);
    setData(null);

    const result = await fetchAuthorWikipediaData(authorName, explicitPageTitle);

    // Cache'e yaz (null olsa bile; bulunamadı bilgisi de cache'lenir)
    cache.current[cacheKey] = result;

    setData(result);
    setIsLoading(false);
  }, [currentAuthor, data]);

  /**
   * Modal kapatıldığında state'i temizler ama cache'i korur.
   */
  const clearAuthor = useCallback(() => {
    setData(null);
    setCurrentAuthor(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    wikipediaData: data,
    isLoading,
    error,
    currentAuthor,
    fetchAuthor,
    clearAuthor,
  };
}
