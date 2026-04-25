import { useState, useEffect } from 'react';

const WIKIPEDIA_SEARCH_API = 'https://tr.wikipedia.org/w/api.php';
const WIKIPEDIA_API_BASE   = 'https://tr.wikipedia.org/api/rest_v1';

// In-memory cache — sayfa yenilenmeden tekrar istek gitmez
const descriptionCache = {};

/**
 * Edebi dönem adı ve varsa başlangıç açıklamasını alır.
 * Eğer başlangıç açıklaması varsa onu döner, yoksa Türkçe Wikipedia'dan kısa açıklama çeker.
 */
export function usePeriodDescription(periodName, initialDescription = null) {
  const [description, setDescription] = useState(() => 
    initialDescription || descriptionCache[periodName]
  );
  const [loading, setLoading] = useState(!description);

  useEffect(() => {
    if (!periodName) return;
    
    // Eğer verimiz zaten varsa (build sırasında gelmişse veya cache'de varsa) isteğe gerek yok
    if (initialDescription) {
      setDescription(initialDescription);
      setLoading(false);
      return;
    }

    if (Object.prototype.hasOwnProperty.call(descriptionCache, periodName)) {
      setDescription(descriptionCache[periodName]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        // 1. Adım: Arama ile en iyi Wikipedia makalesini bul
        const searchParams = new URLSearchParams({
          action: 'query',
          list: 'search',
          srsearch: `${periodName} edebiyatı`,
          srlimit: 1,
          format: 'json',
          origin: '*',
        });
        const searchRes = await fetch(`${WIKIPEDIA_SEARCH_API}?${searchParams}`);
        if (!searchRes.ok) throw new Error('Arama başarısız');
        const searchData = await searchRes.json();
        const pageTitle = searchData?.query?.search?.[0]?.title;
        if (!pageTitle) throw new Error('Makale bulunamadı');

        // 2. Adım: Sayfa özetini çek
        const summaryRes = await fetch(
          `${WIKIPEDIA_API_BASE}/page/summary/${encodeURIComponent(pageTitle)}`
        );
        if (!summaryRes.ok) throw new Error('Özet alınamadı');
        const summaryData = await summaryRes.json();

        // İlk 3 cümleyi al (çok uzun olmasın)
        const fullExtract = summaryData.extract || '';
        const sentences = fullExtract.match(/[^.!?]*[.!?]+/g) || [];
        const short = sentences.slice(0, 3).join(' ').trim();

        const result = {
          text: short || fullExtract.slice(0, 320),
          pageUrl: summaryData.content_urls?.desktop?.page || null,
        };

        descriptionCache[periodName] = result;
        if (!cancelled) {
          setDescription(result);
          setLoading(false);
        }
      } catch {
        descriptionCache[periodName] = null;
        if (!cancelled) {
          setDescription(null);
          setLoading(false);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [periodName]);

  return { description, loading };
}
