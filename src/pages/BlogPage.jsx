import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import blogData from '../data/blogData.json';
import literatureData from '../data/literatureData.json';
import { Calendar, User, ChevronRight, BookOpen, PenTool, Scroll as ScrollIcon, Search } from 'lucide-react';

export default function BlogPage() {
  const slugify = (text) => {
    const map = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U' };
    if (!text) return '';
    return text.split('').map(char => map[char] || char).join('').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  const getRepresentativeImage = (post) => {
    let foundImage = null;
    literatureData.categories.forEach(cat => {
      cat.periods.forEach(per => {
        per.authors.forEach(auth => {
          if (foundImage) return;
          const hasMatch = auth.movements?.some(m => slugify(m.name) === post.id) || 
                           slugify(post.category || '') === slugify(per.name) ||
                           slugify(post.title || '').includes(slugify(auth.name));
          
          if (hasMatch && auth.image && auth.image.trim() !== "" && !auth.image.includes('placeholder')) {
            foundImage = auth.image;
          }
        });
      });
    });
    return foundImage;
  };

  const featuredPost = blogData[0];
  const featuredImage = featuredPost ? getRepresentativeImage(featuredPost) : null;
  const remainingPosts = blogData.slice(1);

  return (
    <div className="blog-page-container animate-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative' }}>
      <Helmet>
        <title>Edebiyat Blogu — Sınav İpuçları ve Yazar Analizleri | edebiyatdonemler.com.tr</title>
        <meta name="description" content="AYT Edebiyat hazırlık, yazar özetleri, eser analizleri ve sınav stratejileri hakkında güncel içerikler." />
      </Helmet>

      {/* Decorative Background Elements */}
      <div className="bg-decorations">
        <div className="bg-element float-element" style={{ top: '15%', right: '5%', opacity: 0.1 }}>
          <PenTool size={120} color="var(--amber)" />
        </div>
        <div className="bg-element float-element-slow" style={{ bottom: '20%', left: '5%', opacity: 0.1 }}>
          <ScrollIcon size={140} color="var(--rose)" />
        </div>
      </div>

      <div style={{ marginBottom: '80px', textAlign: 'center', paddingTop: '60px' }}>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-eyebrow"
          style={{ marginBottom: '24px' }}
        >
          <BookOpen size={16} /> Edebiyat Atlası Akademi
        </motion.div>
        <h1 className="hero-title" style={{ marginBottom: '24px' }}>
          Edebiyat <span className="gradient-text">Blogu</span>
        </h1>
        <p className="hero-desc">
          Sınav yolculuğunda size rehberlik edecek, derinlemesine analizler ve pratik bilgiler.
        </p>
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="featured-post-card glass-premium"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '0',
            borderRadius: '32px',
            overflow: 'hidden',
            marginBottom: '80px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ 
            height: '400px', 
            background: 'var(--bg-surface)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {featuredImage ? (
              <img 
                src={featuredImage} 
                alt="Öne Çıkan" 
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
              />
            ) : (
              <ScrollIcon size={120} style={{ color: 'var(--amber)', opacity: 0.15 }} />
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.4), transparent)' }} />
            <div style={{
              position: 'absolute',
              top: '30px',
              left: '30px',
              background: 'var(--amber)',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '99px',
              fontSize: '0.85rem',
              fontWeight: 800,
              boxShadow: '0 4px 15px rgba(193, 127, 42, 0.3)'
            }}>
              ÖNE ÇIKAN REHBER
            </div>
          </div>
          <div style={{ padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} /> {featuredPost.date}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={16} /> {featuredPost.author}</span>
            </div>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontFamily: 'var(--font-display)', 
              marginBottom: '24px', 
              lineHeight: '1.2',
              color: 'var(--text-primary)' 
            }}>{featuredPost.title}</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '40px' }}>
              {featuredPost.excerpt}
            </p>
            <Link 
              to={`/blog/${featuredPost.id}`} 
              className="btn-primary" 
              style={{ alignSelf: 'flex-start', padding: '16px 36px', borderRadius: '16px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              Hemen Oku <ChevronRight size={20} />
            </Link>
          </div>
        </motion.div>
      )}

      {/* Posts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px', paddingBottom: '100px' }}>
        {remainingPosts.map((post, i) => (
          <motion.article 
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            whileHover={{ y: -10 }}
            className="blog-card glass"
            style={{ 
              borderRadius: '28px', 
              overflow: 'hidden', 
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
              height: '100%',
              boxShadow: 'var(--shadow-md)',
              background: 'var(--bg-card)'
            }}
          >
            <div style={{ 
              height: '220px', 
              background: 'var(--bg-surface)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {getRepresentativeImage(post) ? (
                <img 
                  src={getRepresentativeImage(post)} 
                  alt={post.title} 
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} 
                />
              ) : (
                <PenTool size={48} style={{ color: 'var(--amber)', opacity: 0.1 }} />
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
              <div style={{
                position: 'absolute',
                bottom: '15px',
                left: '20px',
                background: 'var(--bg-glass)',
                padding: '5px 12px',
                borderRadius: '10px',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                border: '1px solid var(--border)',
                textTransform: 'uppercase'
              }}>
                {post.category}
              </div>
            </div>

            <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {post.date}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14} /> {post.author}</span>
              </div>
              
              <h3 style={{ 
                fontSize: '1.4rem', 
                marginBottom: '16px', 
                lineHeight: '1.3', 
                fontFamily: 'var(--font-display)',
                color: 'var(--text-primary)',
                fontWeight: 700
              }}>{post.title}</h3>
              
              <p style={{ 
                color: 'var(--text-secondary)', 
                marginBottom: '24px', 
                lineHeight: '1.6', 
                flex: 1,
                fontSize: '1rem'
              }}>{post.excerpt}</p>
              
              <Link 
                to={`/blog/${post.id}`}
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  color: 'var(--amber)', 
                  fontWeight: 800,
                  textDecoration: 'none',
                  fontSize: '0.95rem'
                }}
                className="blog-link"
              >
                İncele <ChevronRight size={18} />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
