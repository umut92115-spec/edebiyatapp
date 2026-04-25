import { useState, useEffect, useRef } from 'react';
import { fetchAuthorWikipediaData } from '../services/wikipediaApi';

// Uygulama genelinde paylaşılan in-memory cache
// (her hook instance'ı aynı nesneyi okuyacak)
const photoCache = {};
const pendingRequests = {};

/**
 * Tek bir yazar için Wikipedia fotoğrafını lazy yükler.
 * - Aynı yazar için paralel istekler engellenir.
 * - Cache'lenmiş veri anında döner.
 * - Hata durumunda null döner, uygulama çökmez.
 */
export function useAuthorPhoto(authorName, explicitPageTitle = null) {
  const cacheKey = explicitPageTitle || authorName;
  
  const [imageUrl, setImageUrl] = useState(() => {
    // Eğer cache'de varsa hemen dön (null dahil)
    return photoCache[cacheKey] !== undefined
      ? photoCache[cacheKey]
      : undefined; // undefined = henüz yüklenmedi
  });

  const [loading, setLoading] = useState(imageUrl === undefined);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    if (!authorName) return;

    // Cache'de zaten var mı?
    if (Object.prototype.hasOwnProperty.call(photoCache, cacheKey)) {
      setImageUrl(photoCache[cacheKey]);
      setLoading(false);
      return;
    }

    // Başka bir instance zaten istek atıyor mu?
    if (pendingRequests[cacheKey]) {
      pendingRequests[cacheKey].then((url) => {
        if (mounted.current) {
          setImageUrl(url);
          setLoading(false);
        }
      });
      return;
    }

    // Yeni istek
    setLoading(true);

    const promise = fetchAuthorWikipediaData(authorName, explicitPageTitle).then((data) => {
      const url = data?.imageUrl || null;
      photoCache[cacheKey] = url;
      delete pendingRequests[cacheKey];
      return url;
    }).catch(() => {
      photoCache[cacheKey] = null;
      delete pendingRequests[cacheKey];
      return null;
    });

    pendingRequests[cacheKey] = promise;

    promise.then((url) => {
      if (mounted.current) {
        setImageUrl(url);
        setLoading(false);
      }
    });
  }, [authorName, explicitPageTitle, cacheKey]);

  return { imageUrl, loading };
}
