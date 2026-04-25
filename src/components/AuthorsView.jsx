import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import AuthorsScreen from './AuthorsScreen';
import AuthorModal from './AuthorModal';

function AuthorsView({ categories }) {
  const { categorySlug, periodSlug, authorSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const category = categories.find(c => c.id === categorySlug);
  const period = category?.periods.find(p => p.id === periodSlug);
  const author = period?.authors.find(a => a.id === authorSlug);

  const cleanPeriodName = period?.name?.replace(/^[\p{Emoji}\s]+/u, '') ?? '';
  const authorName = author?.name ?? '';
  const currentUrl = `https://edebiyatdonemler.com.tr${location.pathname}`;

  // SEO Titles & Descriptions
  const pageTitle = authorSlug && author 
    ? `${authorName} Eserleri ve Hayatı — ${cleanPeriodName} | edebiyatdonemler.com.tr`
    : `${cleanPeriodName} Edebiyatı — Yazarlar ve Eserler | edebiyatdonemler.com.tr`;
  
  const pageDesc = authorSlug && author
    ? `${authorName}'nın tüm eserleri, hayatı ve ${cleanPeriodName} edebiyatındaki yeri. ${author?.works?.slice(0, 3).map(w => w.name).join(', ')} hakkında bilgi.`
    : `${cleanPeriodName} edebiyatının genel özellikleri, ${period?.authors?.slice(0, 3).map(a => a.name).join(', ')} gibi temsilci yazarlar ve eserleri.`;

  // JSON-LD for Author
  const schemaOrg = authorSlug && author ? {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": author.name,
    "description": author.bio?.substring(0, 160),
    "nationality": "Turkish",
    "knowsAbout": `${cleanPeriodName} edebiyatı`,
    "sameAs": author.wikiPage || undefined
  } : null;

  if (!category || !period) {
    return <div className="screen-error">Dönem bulunamadı.</div>;
  }

  const handleSelectAuthor = (selectedAuthor) => {
    navigate(`/${categorySlug}/${periodSlug}/${selectedAuthor.id}`);
  };

  const handleCloseModal = () => {
    navigate(`/${categorySlug}/${periodSlug}`);
  };

  const handleBack = () => {
    navigate(`/${categorySlug}`);
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={currentUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        {schemaOrg && <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>}
      </Helmet>
      
      <AuthorsScreen
        period={period}
        onSelectAuthor={handleSelectAuthor}
        onBack={handleBack}
      />
      <AnimatePresence>
        {authorSlug && author && (
          <AuthorModal
            author={author}
            period={period}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default AuthorsView;
