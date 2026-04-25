import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Info, AlertCircle, BookOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import movementsData from '../data/movementsData.json';
import blogData from '../data/blogData.json';

export function MovementModal({ movement, onClose }) {
  if (!movement) return null;

  const movementName = movement.name || (typeof movement === 'string' ? movement : 'Bilinmeyen Akım');
  const data = movementsData[movementName.trim()];
  const movementColor = movement.color || 'var(--amber)';

  const slugify = (text) => {
    const map = {
      'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
      'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
    };
    return text.split('').map(char => map[char] || char).join('')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const blogId = slugify(movementName.trim());
  const blogPost = blogData.find(p => p.id === blogId);

  React.useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      // Bold handling
      let htmlLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // List item handling (support *, - or * with spaces)
      const listMatch = htmlLine.match(/^(\s*)([*•-])\s+(.*)/);
      if (listMatch) {
        const indent = listMatch[1].length;
        const content = listMatch[3]; // htmlLine already has strong tags
        return (
          <li key={i} 
            dangerouslySetInnerHTML={{ __html: content }} 
            style={{
              marginLeft: `${20 + indent * 10}px`, 
              marginBottom: '10px',
              listStyleType: indent > 0 ? 'circle' : 'disc',
              display: 'list-item',
              position: 'relative'
            }} 
          />
        );
      }
      
      // Empty line handling
      if (!htmlLine.trim()) return <div key={i} style={{ height: '10px' }} />;
      
      return <p key={i} dangerouslySetInnerHTML={{ __html: htmlLine }} style={{marginBottom: '14px'}} />;
    });
  };

  return createPortal(
    <div 
      className="modal-overlay active" 
      onClick={onClose} 
      style={{
        zIndex: 99999, // En üst katman
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="movement-floating-page glass-premium" 
        style={{
          width: '100%',
          maxWidth: '700px',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: `1px solid ${movementColor}44`,
          borderTop: `8px solid ${movementColor}`,
          borderRadius: '28px',
          padding: '40px',
          position: 'relative',
          boxShadow: '0 50px 150px rgba(0,0,0,0.4)',
          color: 'var(--text-primary)',
          background: 'var(--bg-glass)',
          pointerEvents: 'auto'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          style={{ 
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'rgba(255,255,255,0.1)', 
            border: 'none', 
            color: 'var(--text-primary)', 
            cursor: 'pointer', 
            padding: '10px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          <X size={24} />
        </button>

        {!data ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <AlertCircle size={64} color="var(--rose)" style={{ marginBottom: '24px', opacity: 0.6 }} />
            <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Veri Hazırlanıyor</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              "<strong>{movementName}</strong>" akımı için detaylı bilgiler sisteme işlenmektedir.
            </p>
            <button className="btn-primary" onClick={onClose} style={{ marginTop: '30px' }}>Anladım</button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '40px' }}>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '10px', 
                color: movementColor, 
                fontSize: '1rem', 
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginBottom: '16px'
              }}>
                <Info size={20} /> Edebi Akım & Topluluk
              </div>
              <h2 style={{ 
                margin: 0, 
                fontSize: '3rem', 
                fontWeight: 900,
                color: 'var(--text-primary)',
                lineHeight: '1.1',
                letterSpacing: '-0.02em'
              }}>{data.title || movementName}</h2>
            </div>
            
            {data.examCount > 0 && (
              <div style={{ 
                background: 'var(--amber-dim)', 
                borderLeft: '5px solid var(--amber)', 
                padding: '24px', 
                borderRadius: '20px', 
                marginBottom: '40px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px'
              }}>
                <div style={{ 
                  background: 'var(--amber)', 
                  color: '#000', 
                  padding: '12px', 
                  borderRadius: '14px',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                }}>
                  <Target size={28} />
                </div>
                <div>
                  <div style={{ color: 'var(--amber)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '6px' }}>ÖSYM Analizi</div>
                  <p style={{ margin: 0, fontSize: '1.05rem', opacity: 0.9, lineHeight: '1.5' }}>
                    Bu akım üniversite sınavlarında toplam <strong>{data.examCount} kez</strong> soru olarak karşımıza çıkmıştır.
                  </p>
                </div>
              </div>
            )}

            <div className="movement-content" style={{ 
              fontSize: '1.2rem', 
              lineHeight: '1.85', 
              color: 'var(--text-secondary)',
              textAlign: 'justify',
              fontFamily: 'inherit',
              marginBottom: blogPost ? '40px' : '0'
            }}>
              {renderMarkdown(data.description)}
            </div>

            {blogPost && (
              <div className="blog-preview-card" style={{
                background: 'rgba(99, 102, 241, 0.05)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '24px',
                padding: '30px',
                marginTop: '40px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--indigo)', marginBottom: '16px', fontWeight: 700 }}>
                  <BookOpen size={20} /> Blogdan Detaylı Rehber
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', color: 'var(--text-primary)' }}>{blogPost.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '20px' }}>
                  {blogPost.excerpt}
                </p>
                <Link 
                  to={`/blog/${blogPost.id}`}
                  onClick={onClose}
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    color: 'var(--indigo)', 
                    fontWeight: 700,
                    textDecoration: 'none',
                    padding: '12px 24px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    borderRadius: '12px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => { e.target.style.background = 'rgba(99, 102, 241, 0.2)'; }}
                  onMouseLeave={e => { e.target.style.background = 'rgba(99, 102, 241, 0.1)'; }}
                >
                  Devamını Blog'da Oku <ChevronRight size={18} />
                </Link>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>,
    document.body
  );
}
