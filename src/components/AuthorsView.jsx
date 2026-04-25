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

  if (!category || !period) {
    return <div className="screen-error">Dönem bulunamadı.</div>;
  }

  const cleanCatName = category.name.replace(/^[\p{Emoji}\s]+/u, '');
  const cleanPeriodName = period.name.replace(/^[\p{Emoji}\s]+/u, '');
  const authorName = author?.name ?? '';
  const currentUrl = `https://edebiyatapp.vercel.app${location.pathname}`;

  // SEO Titles & Descriptions
  const pageTitle = authorSlug && author 
    ? `🖋️ ${authorName} Eserleri ve Hayatı — ${cleanPeriodName} | Türk Edebiyatı Atlası`
    : `🖋️ ${cleanPeriodName} Yazarları ve Eserleri | Türk Edebiyatı Atlası`;
  
  const pageDesc = authorSlug && author
    ? `${authorName}'nın tüm eserleri, hayatı ve ${cleanPeriodName} edebiyatındaki yeri. 🖋️`
    : `${cleanPeriodName} döneminin temsilci yazarları, eserleri ve genel özellikleri. 🖋️`;

  // JSON-LD Person Schema
  const personSchema = authorSlug && author ? {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": author.name,
    "description": author.bio || `${author.name} hayatı ve eserleri.`,
    "nationality": "Turkish",
    "knowsAbout": `${cleanPeriodName} edebiyatı`
  } : null;

  // JSON-LD EducationalResource Schema
  const eduSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalResource",
    "name": `${cleanPeriodName} Edebiyatı`,
    "description": `${cleanPeriodName} döneminin temsilci yazarları, eserleri ve genel özellikleri.`,
    "educationalLevel": "Lise",
    "inLanguage": "tr"
  };

  // JSON-LD BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Ana Sayfa",
        "item": "https://edebiyatapp.vercel.app/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": cleanCatName,
        "item": `https://edebiyatapp.vercel.app/${categorySlug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": cleanPeriodName,
        "item": `https://edebiyatapp.vercel.app/${categorySlug}/${periodSlug}`
      }
    ]
  };

  if (authorSlug && author) {
    breadcrumbSchema.itemListElement.push({
      "@type": "ListItem",
      "position": 4,
      "name": author.name,
      "item": currentUrl
    });
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
        <meta property="og:image" content="https://edebiyatapp.vercel.app/og-image.png" />
        <meta property="og:site_name" content="Türk Edebiyatı Atlası" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {!authorSlug && <script type="application/ld+json">{JSON.stringify(eduSchema)}</script>}
        {personSchema && <script type="application/ld+json">{JSON.stringify(personSchema)}</script>}
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
