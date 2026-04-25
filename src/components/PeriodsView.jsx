import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PeriodsScreen from './PeriodsScreen';

function PeriodsView({ categories }) {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const category = categories.find(c => c.id === categorySlug);
  const cleanCatName = category?.name?.replace(/^[\p{Emoji}\s]+/u, '') ?? '';
  const currentUrl = `https://edebiyatapp.vercel.app${location.pathname}`;

  const pageTitle = `${cleanCatName} Yazarları ve Eserleri | Türk Edebiyatı Atlası`;
  const pageDesc = `${cleanCatName} döneminin temsilci yazarları, eserleri ve genel özellikleri.`;

  if (!category) {
    return <div className="screen-error">Kategori bulunamadı.</div>;
  }

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
        "item": currentUrl
      }
    ]
  };

  // JSON-LD EducationalResource Schema
  const eduSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalResource",
    "name": `${cleanCatName} Edebiyatı`,
    "description": pageDesc,
    "educationalLevel": "Lise",
    "inLanguage": "tr"
  };

  const handleSelectPeriod = (period) => {
    navigate(`/${categorySlug}/${period.id}`);
  };

  const handleBack = () => {
    navigate('/');
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
        <meta property="og:site_name" content="Türk Edebiyatı Atlası" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(eduSchema)}</script>
      </Helmet>
      <PeriodsScreen
        category={category}
        onSelectPeriod={handleSelectPeriod}
        onBack={handleBack}
      />
    </>
  );
}

export default PeriodsView;
