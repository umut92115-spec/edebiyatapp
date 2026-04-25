import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { 
  X, Edit3, Trash2, Save, RotateCcw, 
  ExternalLink, Star, Plus, Award, 
  BookOpen, Hash, MapPin, Globe, Info, Book, Settings
} from 'lucide-react';
import { useWikipedia } from '../hooks/useWikipedia';
import { useFavorites, useAuthorFavorites, useEdits } from '../hooks/useLocalStorage';
import { dataService } from '../services/dataService';
import movementsData from '../data/movementsData.json';

const periodColorVar = {
  'tanzimat':       'var(--amber)',
  'servet-i-funun': 'var(--teal)',
  'fecr-i-ati':     'var(--rose)',
  'milli-edebiyat': 'var(--violet)',
  'cumhuriyet-donemi': 'var(--indigo)',
  'turk-cocuk-edebiyati': 'var(--emerald)',
  'dunya-cocuk-edebiyati': 'var(--sky)',
};

const ASIK_KOLLARI = {
  // Şenlik Kolu
  "Âşık Şenlik": { kol: "Şenlik Kolu", usta: "Âşık Şenlik" },
  "Aşık Şenlik": { kol: "Şenlik Kolu", usta: "Aşık Şenlik" },
  "Bala Kişi": { kol: "Şenlik Kolu", usta: "Aşık Şenlik" },
  "İbrahim": { kol: "Şenlik Kolu", usta: "Aşık Şenlik" },
  "Gazeli": { kol: "Şenlik Kolu", usta: "Aşık Şenlik" },
  "Ali": { kol: "Şenlik Kolu", usta: "Aşık Şenlik" },
  "Bala Mehmet": { kol: "Şenlik Kolu", usta: "Aşık Şenlik" },
  "Namaz": { kol: "Şenlik Kolu", usta: "Aşık Şenlik" },
  "Kasım": { kol: "Şenlik Kolu", usta: "Aşık Şenlik" },
  "Asker": { kol: "Şenlik Kolu", usta: "Aşık Şenlik" },
  "Mevlüt": { kol: "Şenlik Kolu", usta: "Aşık Şenlik" },
  "Nesib": { kol: "Şenlik Kolu", usta: "Aşık Şenlik" },
  "Süleyman": { kol: "Şenlik Kolu", usta: "Aşık Şenlik" },
  "Hüseyin": { kol: "Şenlik Kolu", usta: "Aşık Şenlik" },
  "Gülistan": { kol: "Şenlik Kolu", usta: "Aşık Şenlik" },

  // Sümmani Kolu
  "Sümmani": { kol: "Sümmani Kolu", usta: "Sümmani" },
  "Şevki Çavuş": { kol: "Sümmani Kolu", usta: "Sümmani" },
  "Fahri Çavuş": { kol: "Sümmani Kolu", usta: "Sümmani" },
  "Ahmet Çavuş": { kol: "Sümmani Kolu", usta: "Sümmani" },

  // Ruhsatî Kolu
  "Ruhsati": { kol: "Ruhsatî Kolu", usta: "Ruhsati" },
  "Meslekî": { kol: "Ruhsatî Kolu", usta: "Ruhsati" },
  "Minhacî": { kol: "Ruhsatî Kolu", usta: "Ruhsati" },
  "Emsalî": { kol: "Ruhsatî Kolu", usta: "Ruhsati" },

  // Emrah Kolu
  "Erzurumlu Emrah": { kol: "Emrah Kolu", usta: "Erzurumlu Emrah" },
  "Gedaî": { kol: "Emrah Kolu", usta: "Erzurumlu Emrah" },
  "Meydanî": { kol: "Emrah Kolu", usta: "Erzurumlu Emrah" },
  "Tokatlı Nuri": { kol: "Emrah Kolu", usta: "Erzurumlu Emrah" },

  // Dertli Kolu
  "Dertli": { kol: "Dertli Kolu", usta: "Dertli" },
  "Geredeli Figanî": { kol: "Dertli Kolu", usta: "Dertli" },
  "Pinhani": { kol: "Dertli Kolu", usta: "Dertli" },
  "Yorgansız Hakkı": { kol: "Dertli Kolu", usta: "Dertli" },

  // Huzuri Kolu
  "Huzuri": { kol: "Huzuri Kolu", usta: "Huzuri" },
  "İzharî": { kol: "Huzuri Kolu", usta: "Huzuri" },
  "Zuhurî": { kol: "Huzuri Kolu", usta: "Huzuri" },
  "Fahrî": { kol: "Huzuri Kolu", usta: "Huzuri" },

  // Derviş Muhammed Kolu
  "Derviş Muhammed": { kol: "Derviş Muhammed Kolu", usta: "Derviş Muhammed" },
  "Âşıkî": { kol: "Derviş Muhammed Kolu", usta: "Derviş Muhammed" },
  "Aşıkî": { kol: "Derviş Muhammed Kolu", usta: "Derviş Muhammed" },
  "Şah Sultan": { kol: "Derviş Muhammed Kolu", usta: "Derviş Muhammed" },
  "Bektaş Kaymaz": { kol: "Derviş Muhammed Kolu", usta: "Derviş Muhammed" },
  "Hasan Hüseyin": { kol: "Derviş Muhammed Kolu", usta: "Derviş Muhammed" },

  // Deli Derviş Feryadi Kolu
  "Deli Derviş Feryadi": { kol: "Deli Derviş Feryadi Kolu", usta: "Deli Derviş Feryadi" },
  "Fahri (Süleyman)": { kol: "Deli Derviş Feryadi Kolu", usta: "Deli Derviş Feryadi" },
  "Suzanî": { kol: "Deli Derviş Feryadi Kolu", usta: "Deli Derviş Feryadi" },
  "Revanî": { kol: "Deli Derviş Feryadi Kolu", usta: "Deli Derviş Feryadi" },
  "Efganî": { kol: "Deli Derviş Feryadi Kolu", usta: "Deli Derviş Feryadi" },
  "Figanî (Abidin Şimşek)": { kol: "Deli Derviş Feryadi Kolu", usta: "Deli Derviş Feryadi" },
  "Cemal Koçak": { kol: "Deli Derviş Feryadi Kolu", usta: "Deli Derviş Feryadi" },
  "Cemal Özcan": { kol: "Deli Derviş Feryadi Kolu", usta: "Deli Derviş Feryadi" }
};

const isValidInfo = (info) => {
  if (!info) return false;
  const s = info.trim().toLowerCase();
  return s !== '' && s !== '-' && s !== 'yok' && s !== 'yoktur' && s !== 'bilinmiyor';
};

const renderMarkdownSimple = (text) => {
  return text.split('\n').map((line, i) => {
    let htmlLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    if (htmlLine.startsWith('*   ')) {
      return <li key={i} dangerouslySetInnerHTML={{ __html: htmlLine.substring(4) }} style={{marginLeft: '15px'}} />;
    }
    return <p key={i} dangerouslySetInnerHTML={{ __html: htmlLine }} style={{marginBottom: '6px', marginTop: '4px'}} />;
  });
};

const RELEVANT_TAGS = {
  'tanzimat': ['Tanzimat 1. Dönem', 'Tanzimat 2. Dönem', 'Tanzimat Dönemi'],
  'servet-i-funun': ['Servet-i Fünun'],
  'fecr-i-ati': ['Fecr-i Âti'],
  'milli-edebiyat': ['Milli Edebiyat'],
  'cumhuriyet-donemi': [
    'Cumhuriyet Dönemi', 'Saf Şiir', 'Yedi Meşaleciler', 'Toplumcu Gerçekçiler', 
    'Milli Edebiyat Zevki', 'Garip Akımı', 'Maviciler', 'İkinci Yeni', 
    'Hisarcılar', 'Dini-Mistik Şiir', 'Beş Hececiler', 'Garip Dışında',
    'Bireyin İç Dünyasını Esas Alan Roman', 'Modernist Roman'
  ],
  'turk-cocuk-edebiyati': ['Türk Çocuk Edebiyatı'],
  'dunya-cocuk-edebiyati': ['Dünya Çocuk Edebiyatı'],
  'asik-tarzi': ['Âşık Edebiyatı'],
  'dini-tasavvufi': ['Tekke Edebiyatı']
};

function AuthorInfoBox({ author, isEditing, isCumhuriyet, isTanzimat, periodId }) {
  const examWorks = author.works?.filter(w => isValidInfo(w.examInfo)) || [];
  const awards = (author.awards || []).filter(a => isValidInfo(a));
  const asikInfo = ASIK_KOLLARI[author.name];
  const examCount = author.examCount || 0;
  
  // Filtreleme mantığı: Eğer periodId varsa sadece o döneme ait tagleri göster
  const filteredMovements = (author.movements || []).filter(m => {
    if (!periodId || !RELEVANT_TAGS[periodId]) return true; // Bilinmeyen dönemse hepsini göster
    return RELEVANT_TAGS[periodId].includes(m.name);
  });

  const hasMovements = filteredMovements.length > 0;

  if (examWorks.length === 0 && awards.length === 0 && !asikInfo && examCount === 0 && !hasMovements && !isEditing) return null;

  return (
    <div className="author-infobox animate-in-fast glass-premium">
      {asikInfo && (
        <div className="infobox-section infobox-asik">
          <div className="infobox-label">🌳 Âşıklık Kolu</div>
          <div className="infobox-items">
            <span className="infobox-badge infobox-badge-asik" style={{ background: 'var(--emerald)', color: '#fff' }}>
              🪕 {asikInfo.kol}
            </span>
            {asikInfo.usta && asikInfo.usta !== author.name && (
              <span className="infobox-badge" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', marginLeft: '8px' }}>
                👨‍🏫 Ustası: {asikInfo.usta}
              </span>
            )}
          </div>
        </div>
      )}
      {hasMovements && (
        <div className="infobox-section infobox-movements">
          <div className="infobox-label">📌 Akım / Topluluk</div>
          <div className="infobox-items" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredMovements.map((m, i) => {
              const data = movementsData[m.name];
              return (
                <div key={i} className="infobox-movement-card" style={{ borderLeft: `3px solid ${m.color}`, paddingLeft: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span className="infobox-badge" style={{ background: m.color, color: '#fff' }}>🏷️ {m.name}</span>
                    {data?.examCount > 0 && (
                      <span className="infobox-badge" style={{ background: 'var(--amber)', color: '#000' }}>🎯 Bu akım {data.examCount} kez soruldu</span>
                    )}
                  </div>
                  {data && (
                    <div style={{ fontSize: '0.85rem', lineHeight: '1.5', opacity: 0.9 }}>
                      {renderMarkdownSimple(data.description)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {awards.length > 0 && (
        <div className="infobox-section infobox-awards">
          <div className="infobox-label">🏆 Ödüller</div>
          <div className="infobox-items">
            {awards.map((award, i) => (
              <span key={i} className="infobox-badge infobox-badge-award">🏅 {award}</span>
            ))}
          </div>
        </div>
      )}
      {examCount > 0 && (
        <div className="infobox-section infobox-exam-count">
          <div className="infobox-label">📌 ÖSYM Sınav Geçmişi</div>
          <div className="infobox-items">
            <span className="infobox-badge infobox-badge-exam-count" style={{ background: 'var(--amber)', color: '#000' }}>🎯 bu yazar <strong>{examCount}</strong> kez soruldu!</span>
          </div>
        </div>
      )}
      {examWorks.length > 0 && (
        <div className="infobox-section infobox-exams">
          <div className="infobox-label">📝 Sınavda Çıkan Eserler</div>
          <div className="infobox-items">
            {examWorks.map((w, i) => (
              <span key={i} className="infobox-badge infobox-badge-exam">📋 <strong>{w.name}</strong> — {w.examInfo}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function AuthorModal({ author: initialAuthor, period, onClose }) {
  const { wikipediaData, isLoading: wikiLoading, fetchAuthor, clearAuthor } = useWikipedia();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAuthorFavorite, toggleAuthorFavorite } = useAuthorFavorites();
  const { getAuthorNotes, saveAuthorNotes } = useEdits();
  const accentColor = periodColorVar[period?.id] || 'var(--violet)';
  const overlayRef = useRef();
  const isCumhuriyet = period?.id === 'cumhuriyet-donemi';
  const isTanzimat = period?.id === 'tanzimat';

  const [isEditing, setIsEditing] = useState(false);
  const [author, setAuthor] = useState(initialAuthor);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [showTagSelect, setShowTagSelect] = useState(false);
  const [showNotes, setShowNotes] = useState(!!getAuthorNotes(initialAuthor?.id)); // Not varsa açık gelsin

  const isAdmin = localStorage.getItem('is_admin_active') === 'true';

  useEffect(() => {
    setAuthor(initialAuthor);
    if (initialAuthor) {
      fetchAuthor(initialAuthor.name, initialAuthor.wikiPage);
      setShowNotes(!!getAuthorNotes(initialAuthor.id));
    }
    return () => clearAuthor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAuthor?.id]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && !isEditing) onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, isEditing]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current && !isEditing) onClose();
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const cleanedAuthor = {
        ...author,
        awards: (author.awards || []).map(a => a.trim()).filter(a => a !== '')
      };
      await dataService.updateAuthor(initialAuthor.name, cleanedAuthor);
      setMessage({ type: 'success', text: 'Değişiklikler kalıcı olarak kaydedildi!' });
      setTimeout(() => {
        setMessage(null);
        setIsEditing(false);
        window.location.reload(); 
      }, 1500);
    } catch (err) {
      console.error('Save error:', err);
      setMessage({ 
        type: 'error', 
        text: err.message.includes('Production') 
          ? '⚠️ Düzenleme modu sadece yerel geliştirme (npm run dev) ortamında çalışır.' 
          : `❌ Hata: ${err.message}` 
      });
      setSaving(false);
    }
  };

  const updateWork = (workId, field, value) => {
    setAuthor(prev => ({
      ...prev,
      works: prev.works.map(w => w.id === workId ? { ...w, [field]: value } : w)
    }));
  };

  const addWork = () => {
    setAuthor(prev => ({
      ...prev,
      works: [
        ...prev.works,
        { id: `new_${Date.now()}`, name: '', type: '', description: '', examInfo: '' }
      ]
    }));
  };

  const removeWork = (workId) => {
    setAuthor(prev => ({
      ...prev,
      works: prev.works.filter(w => w.id !== workId)
    }));
  };

  const addMovement = (name) => {
    if (!name) return;
    if (author.movements?.some(m => m.name === name)) {
      setShowTagSelect(false);
      return;
    }
    setAuthor(prev => ({
      ...prev,
      movements: [...(prev.movements || []), { name, color: '#6366f1', order: 50 }]
    }));
    setShowTagSelect(false);
  };

  const removeMovement = (name) => {
    setAuthor(prev => ({
      ...prev,
      movements: (prev.movements || []).filter(m => m.name !== name)
    }));
  };

  const handleDeleteAuthor = async () => {
    setSaving(true);
    try {
      await dataService.deleteAuthor(initialAuthor.name);
      setMessage({ type: 'success', text: 'Yazar başarıyla silindi!' });
      setTimeout(() => {
        setMessage(null);
        onClose();
        window.location.reload(); 
      }, 1500);
    } catch (err) {
      setMessage({ type: 'error', text: 'Silinirken bir hata oluştu.' });
      setSaving(false);
    }
  };

  if (!author) return null;

  const periodEmoji = period?.name?.match(/^(\p{Emoji})/u)?.[1] ?? '📖';
  const periodName  = period?.name?.replace(/^[\p{Emoji}\s]+/u, '') ?? '';
  const displayPhoto = author.image || wikipediaData?.imageUrl;

  const { categorySlug, periodSlug } = useParams();

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="modal-panel modal-panel-premium" 
        style={{ '--accent': accentColor }}
      >
        {/* PREMIUM HERO SECTION */}
        <div className="modal-hero">
          <div className="modal-hero-bg">
            <img 
              src={displayPhoto || 'https://images.unsplash.com/photo-1457369804590-52c616b78c4d?auto=format&fit=crop&q=80'} 
              alt={`${author.name} Arka Plan`} 
              loading="lazy"
            />
          </div>
          
          <button className="modal-close glass" onClick={onClose} style={{ top: '24px', right: '24px', position: 'absolute', zIndex: 10 }}>
            <X size={20} />
          </button>

          <div className="modal-hero-content">
            <div className="modal-hero-photo-wrap">
              {displayPhoto ? (
                <img 
                  src={displayPhoto} 
                  alt={author.name} 
                  className="modal-hero-photo" 
                  loading="lazy"
                />
              ) : (
                <div className="author-photo-fallback" style={{ width: '100%', height: '100%', borderRadius: '0' }}>{author.name.charAt(0)}</div>
              )}
            </div>
            
            <div className="modal-hero-text">
              <Link 
                to={`/${categorySlug}/${periodSlug}`}
                className="modal-period-badge glass" 
                style={{ marginBottom: '12px', textDecoration: 'none', color: 'inherit', display: 'inline-block' }}
              >
                {periodEmoji} {periodName}
              </Link>
              {isEditing ? (
                <div className="edit-author-header-inputs">
                  <input 
                    className="edit-author-name"
                    value={author.name}
                    onChange={e => setAuthor({...author, name: e.target.value})}
                    placeholder="Yazar Adı"
                    style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid #fff', color: '#fff', marginBottom: '8px' }}
                  />
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input 
                      className="edit-author-image"
                      value={author.image || ''}
                      onChange={e => setAuthor({...author, image: e.target.value})}
                      placeholder="Görsel URL (Boş bırakılabilir)"
                      style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: '0.8rem', padding: '6px 12px', borderRadius: '12px', flex: 1 }}
                    />
                    {author.image && (
                      <button 
                        onClick={() => setAuthor({...author, image: ''})}
                        style={{ background: 'var(--rose)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        ✕ Görseli Kaldır
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="modal-hero-name">{author.name} Eserleri</h1>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {wikipediaData?.pageUrl && (
                      <a href={wikipediaData.pageUrl} target="_blank" rel="noopener noreferrer" className="wiki-link glass" style={{ padding: '4px 12px', borderRadius: '20px', color: '#fff' }}>
                        <Globe size={14} /> Wikipedia
                      </a>
                    )}
                    
                    <button 
                      className={`glass ${showNotes ? 'active' : ''}`} 
                      onClick={() => setShowNotes(!showNotes)}
                      style={{ 
                        color: showNotes ? 'var(--amber)' : '#000', 
                        border: 'none', 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px' 
                      }}
                    >
                      <Edit3 size={14} /> 
                      {showNotes ? 'Notları Kapat' : 'Notlarım'}
                    </button>

                    <button 
                      className={`glass ${isAuthorFavorite(author.id) ? 'active' : ''}`} 
                      onClick={() => toggleAuthorFavorite(author.id)}
                      style={{ 
                        color: isAuthorFavorite(author.id) ? 'var(--amber)' : '#000', 
                        border: 'none', 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px' 
                      }}
                    >
                      <Star size={14} fill={isAuthorFavorite(author.id) ? 'currentColor' : 'none'} /> 
                      {isAuthorFavorite(author.id) ? 'Favorilerimde' : 'Favoriye Ekle'}
                    </button>

                    {isAdmin && !isEditing && (
                      <button className="glass" onClick={() => setIsEditing(true)} style={{ color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Settings size={14} /> Admin: Düzenle
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="edit-sticky-bar glass" style={{ padding: '12px 32px', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderBottom: '1px solid var(--border)' }}>
            <button className="btn-save-all" onClick={handleSaveAll} disabled={saving} style={{ background: 'var(--amber)', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
              {saving ? '...' : <><Save size={16} /> Değişiklikleri Kaydet</>}
            </button>
            <button className="btn-cancel-all" onClick={() => setIsEditing(false)} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer' }}>
              İptal
            </button>
            <button onClick={() => {
              if (window.confirm(`${author.name} adlı yazarı silmek istediğinize emin misiniz?`)) handleDeleteAuthor();
            }} style={{ background: 'var(--rose)', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer' }}>
              <Trash2 size={16} /> Sil
            </button>
          </div>
        )}

        {message && <div className={`modal-status-message ${message.type}`}>{message.text}</div>}

        <div className="modal-body" style={{ background: 'var(--bg-glass)', paddingTop: '40px' }}>
          
          <div className="modal-content-grid">
            
            <div className="modal-main-column">
              {/* ÇALIŞMA NOTLARI BÖLÜMÜ */}
              <AnimatePresence>
                {showNotes && !isEditing && (
                  <motion.section 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="modal-section" 
                    style={{ marginBottom: '32px', overflow: 'hidden' }}
                  >
                    <div className="modal-section-title" style={{ color: 'var(--amber)' }}>
                      <Edit3 size={16} /> Çalışma Notlarım
                    </div>
                    <div className="personal-notes-container" style={{ padding: '16px', borderRadius: '16px' }}>
                      <textarea
                        placeholder="Bu yazar hakkında kendine özel notlar al... (Örn: 'Sınavda sorulabilir', 'Bu eserle karıştırma')"
                        value={getAuthorNotes(author.id)}
                        onChange={(e) => saveAuthorNotes(author.id, e.target.value)}
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-primary)',
                          fontFamily: 'inherit',
                          fontSize: '0.95rem',
                          minHeight: '120px',
                          outline: 'none',
                          resize: 'vertical'
                        }}
                      />
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'right' }}>
                        ✍️ Notların sadece bu tarayıcıda saklanır (LocalStorage).
                      </div>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              <section className="modal-section">
                <h2 className="modal-section-title"><Info size={16} /> Yazar Hakkında</h2>
                {isEditing ? (
                  <textarea 
                    className="edit-bio-textarea"
                    placeholder="Yazar hakkında genel bilgiler..."
                    value={author.bio || ''}
                    onChange={e => setAuthor({...author, bio: e.target.value})}
                    rows={6}
                    style={{ width: '100%', padding: '16px', borderRadius: '12px' }}
                  />
                ) : (
                  <div className="author-bio-text" style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                    {author.bio ? <p>{author.bio}</p> : <p className="empty-info">Henüz biyografi eklenmemiş.</p>}
                  </div>
                )}
              </section>

              <section className="modal-section" style={{ marginTop: '40px' }}>
                <h2 className="modal-section-title"><Book size={16} /> Başlıca Eserleri <span className="works-count-badge">{author.works.length}</span></h2>
                
                {/* Semantic List for SEO */}
                <div className="sr-only" aria-hidden="false">
                  <ul>
                    {author.works.map(work => (
                      <li key={work.id}>
                        <strong>{work.name}</strong> ({work.type}): {work.description}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="works-list">
                   {author.works.map(work => (
                    <div 
                      key={work.id} 
                      id={work.id}
                      className={`work-card ${isEditing ? 'editing' : ''} glass`} 
                      style={{ '--accent': accentColor, marginBottom: '12px' }}
                    >
                      {isEditing ? (
                          <div className="work-edit-fields">
                            <div className="edit-row">
                              <input value={work.name} onChange={e => updateWork(work.id, 'name', e.target.value)} placeholder="Eser Adı" />
                              <input value={work.type} onChange={e => updateWork(work.id, 'type', e.target.value)} placeholder="Tür" className="small" />
                              <button onClick={() => removeWork(work.id)} title="Eseri Sil" style={{ background: 'var(--rose)', color: 'white', border: 'none', padding: '0 10px', borderRadius: '6px', cursor: 'pointer' }}>✕</button>
                            </div>
                            <div className="edit-row" style={{ marginTop: '8px' }}>
                              <input 
                                value={work.examInfo || ''} 
                                onChange={e => updateWork(work.id, 'examInfo', e.target.value)} 
                                placeholder="Sınav Bilgisi (Örn: 2021 AYT, 3 kez çıktı)" 
                                style={{ flex: 1, fontSize: '0.85rem', background: 'var(--amber-dim)', border: '1px solid var(--amber)' }}
                              />
                            </div>
                            <textarea value={work.description || ''} onChange={e => updateWork(work.id, 'description', e.target.value)} placeholder="Açıklama" rows={2} style={{ marginTop: '8px' }} />
                          </div>
                      ) : (
                        <>
                          <div className="work-card-top">
                            <div className="work-info">
                              <div className="work-name" style={{ fontSize: '1.1rem' }}><strong>{work.name}</strong></div>
                              <span className="work-type-badge glass">{work.type}</span>
                            </div>
                            <button className={`btn-fav glass ${isFavorite(author.id, work.id) ? 'active' : ''}`} onClick={() => toggleFavorite(author.id, work.id)}>
                              {isFavorite(author.id, work.id) ? '⭐' : '☆'}
                            </button>
                          </div>
                          {work.description && <p className="work-desc" style={{ borderTop: '1px solid var(--border-light)' }}>{work.description}</p>}
                          {isValidInfo(work.examInfo) && <div className="work-exam-badge glass" style={{ background: 'var(--amber-dim)', color: 'var(--text-primary)', marginTop: '8px', padding: '4px 12px', borderRadius: '8px', fontSize: '0.8rem' }}>🎯 {work.examInfo}</div>}
                        </>
                      )}
                    </div>
                  ))}
                </div>
                {isEditing && (
                  <button onClick={addWork} style={{ marginTop: '16px', background: 'var(--teal)', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>
                    ➕ Yeni Eser Ekle
                  </button>
                )}
              </section>
            </div>

            <div className="modal-sidebar-column">
              <AuthorInfoBox 
            author={author} 
            isEditing={isEditing} 
            isCumhuriyet={isCumhuriyet} 
            isTanzimat={isTanzimat} 
            periodId={period?.id}
          />
              
              {isEditing && (
                <section className="modal-section admin-metadata-editor glass-premium" style={{ padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
                  <div className="modal-section-title"><Settings size={16} /> Sınav & Akım Yönetimi</div>
                  
                  <div className="admin-field-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>ÖSYM Sorulma Sayısı</label>
                    <input 
                      type="number"
                      value={author.examCount || 0}
                      onChange={e => setAuthor({...author, examCount: parseInt(e.target.value) || 0})}
                      style={{ width: '100px', padding: '8px', borderRadius: '8px', border: '1px solid var(--amber)', background: 'var(--amber-dim)' }}
                    />
                  </div>

                  <div className="admin-field-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>Akımlar / Topluluklar</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                      {author.movements?.map((m, i) => (
                        <span key={i} className="infobox-badge" style={{ background: m.color, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {m.name}
                          <button onClick={() => removeMovement(m.name)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex' }}><X size={12} /></button>
                        </span>
                      ))}
                      <button 
                        onClick={() => setShowTagSelect(!showTagSelect)}
                        style={{ background: 'var(--bg-surface)', border: '1px dashed var(--border)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        + Akım Ekle
                      </button>
                    </div>

                    {showTagSelect && (
                      <div className="tag-selector-dropdown glass" style={{ padding: '12px', borderRadius: '12px', position: 'absolute', zIndex: 100, width: '250px', maxHeight: '300px', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                        {Object.keys(movementsData).map(mName => (
                          <div 
                            key={mName} 
                            className="tag-option"
                            onClick={() => addMovement(mName)}
                            style={{ padding: '8px', borderRadius: '6px', cursor: 'pointer', transition: 'background 0.2s' }}
                          >
                            {mName}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="admin-field-group">
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', opacity: 0.8 }}>Ödüller (Virgülle ayırın)</label>
                    <textarea 
                      value={(author.awards || []).join(', ')}
                      onChange={e => setAuthor({...author, awards: e.target.value.split(',').map(s => s.trim())})}
                      placeholder="Nobel, Sedat Simavi, vb."
                      rows={2}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px' }}
                    />
                  </div>
                </section>
              )}

              <section className="modal-section wiki-section glass-premium" style={{ padding: '20px', borderRadius: '16px' }}>
                <div className="modal-section-title"><Globe size={16} /> Wikipedia Özeti</div>
                {wikiLoading ? (
                  <div className="wiki-skeleton-simple">Yükleniyor...</div>
                ) : wikipediaData?.extract ? (
                  <p className="wiki-extract" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {wikipediaData.extract.slice(0, 350)}…
                  </p>
                ) : (
                  <p className="wiki-not-found">Wikipedia verisi bulunamadı.</p>
                )}
              </section>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
