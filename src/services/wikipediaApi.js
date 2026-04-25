const WIKIPEDIA_API_BASE = 'https://tr.wikipedia.org/api/rest_v1';
const WIKIPEDIA_SEARCH_API = 'https://tr.wikipedia.org/w/api.php';

/**
 * Yazar adına göre Wikipedia'da arama yapar ve en iyi eşleşmenin başlığını döner.
 */
async function searchAuthorPage(authorName) {
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: authorName,
    srlimit: 1,
    format: 'json',
    origin: '*',
  });

  const response = await fetch(`${WIKIPEDIA_SEARCH_API}?${params}`);
  if (!response.ok) throw new Error('Wikipedia arama isteği başarısız.');

  const data = await response.json();
  const results = data?.query?.search;

  if (!results || results.length === 0) return null;
  return results[0].title;
}

/**
 * Wikipedia sayfa başlığına göre özet (summary) bilgisini çeker.
 * İçeriğe şunlar dahildir: extract (biyografi metni), originalimage (fotoğraf).
 */
async function fetchAuthorSummary(pageTitle) {
  const encodedTitle = encodeURIComponent(pageTitle);
  const response = await fetch(
    `${WIKIPEDIA_API_BASE}/page/summary/${encodedTitle}`
  );

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Wikipedia veri çekme başarısız: ${response.status}`);
  }

  const data = await response.json();

  return {
    title: data.title || pageTitle,
    extract: data.extract || '',
    imageUrl: data.originalimage?.source || data.thumbnail?.source || null,
    pageUrl: data.content_urls?.desktop?.page || null,
  };
}

/**
 * Ana fonksiyon: Yazar adı veya doğrudan sayfa adı alır, Wikipedia'dan biyografi + fotoğraf döner.
 * Hata durumunda null döner (uygulama çökmez).
 * @param {string} authorName - Yazarın tam adı (arama için)
 * @param {string} [explicitPageTitle] - İsteğe bağlı, doğrudan gidilecek Wikipedia sayfasının tam başlığı
 */
export async function fetchAuthorWikipediaData(authorName, explicitPageTitle = null) {
  try {
    let pageTitle = explicitPageTitle;
    
    // Eğer tam link verildiyse (örn: https://tr.wikipedia.org/wiki/Nâmık_Kemal) içinden başlığı çıkar
    if (pageTitle && pageTitle.includes('/wiki/')) {
      pageTitle = pageTitle.split('/wiki/').pop();
      try {
        pageTitle = decodeURIComponent(pageTitle);
      } catch (e) {
        // ignore malformed URI
      }
    }
    
    // Eğer doğrudan bir sayfa başlığı verilmediyse arama yap
    if (!pageTitle) {
      pageTitle = await searchAuthorPage(authorName);
    }
    
    if (!pageTitle) return null;

    const summary = await fetchAuthorSummary(pageTitle);
    return summary;
  } catch (error) {
    console.warn(`Wikipedia verisi alınamadı (${explicitPageTitle || authorName}):`, error.message);
    return null;
  }
}
