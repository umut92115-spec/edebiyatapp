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
  const currentUrl = `https://edebiyatdonemler.com.tr${location.pathname}`;

  const pageTitle = `${cleanCatName} — Türk Edebiyatı Dönemleri | edebiyatdonemler.com.tr`;
  const pageDesc = `${cleanCatName} döneminin özellikleri, temsilci yazarları ve önemli eserleri.`;

  if (!category) {
    return <div className="screen-error">Kategori bulunamadı.</div>;
  }

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
