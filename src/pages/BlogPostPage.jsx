import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import blogData from '../data/blogData.json';
import literatureData from '../data/literatureData.json';
import { ArrowLeft, Calendar, User, Tag, Clock, Image as ImageIcon } from 'lucide-react';

export default function BlogPostPage() {
  const { postId } = useParams();
  const post = blogData.find(p => p.id === postId);

  // Get author images for this blog post
  const getAuthorImages = () => {
    if (!post) return [];
    
    // 1. Try to find movement/tag that matches this post
    const slugify = (text) => {
      const map = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U' };
      return text.split('').map(char => map[char] || char).join('').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    };

    // Find authors whose movement name matches the post category or id
    const foundAuthors = [];
    literatureData.categories.forEach(cat => {
      cat.periods.forEach(per => {
        per.authors.forEach(auth => {
          const hasMatch = auth.movements?.some(m => slugify(m.name) === post.id) || 
                           slugify(post.category || '') === slugify(per.name);
          
          if (hasMatch && auth.image && auth.image.trim() !== "" && !auth.image.includes('placeholder')) {
            if (!foundAuthors.find(a => a.id === auth.id)) {
              foundAuthors.push(auth);
            }
          }
        });
      });
    });

    return foundAuthors.slice(0, 4); // Take up to 4 representative authors
  };

  const authorImages = getAuthorImages();

  if (!post) return <div className="screen-error">Yazı bulunamadı.</div>;

  const currentUrl = `https://edebiyatapp.vercel.app/blog/${post.id}`;

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
        "name": "Blog",
        "item": "https://edebiyatapp.vercel.app/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": currentUrl
      }
    ]
  };

  const renderContent = (text) => {
    return text.split('\n').map((line, i) => {
      // Always handle bolding for every line
      let htmlLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      if (line.startsWith('### ')) {
        return <h3 key={i} style={{ 
          fontSize: '2rem', 
          marginTop: '48px', 
          marginBottom: '24px',
          fontFamily: 'var(--font-display)',
          color: 'var(--text-primary)',
          fontWeight: 700,
          borderLeft: '4px solid var(--amber)',
          paddingLeft: '20px'
        }}>{line.substring(4)}</h3>;
      }

      if (line.startsWith('* ')) {
        return (
          <li key={i} style={{ 
            marginBottom: '12px', 
            marginLeft: '24px', 
            fontSize: '1.15rem', 
            lineHeight: '1.7',
            color: 'var(--text-secondary)',
            listStyleType: 'none',
            position: 'relative',
            paddingLeft: '20px'
          }}>
            <span style={{ position: 'absolute', left: 0, color: 'var(--amber)' }}>•</span>
            <span dangerouslySetInnerHTML={{ __html: htmlLine.substring(2) }} />
          </li>
        );
      }
      
      if (!line.trim()) return <div key={i} style={{ height: '20px' }} />;
      
      return <p key={i} dangerouslySetInnerHTML={{ __html: htmlLine }} style={{ 
        marginBottom: '20px', 
        lineHeight: '1.9', 
        fontSize: '1.25rem',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-body)'
      }} />;
    });
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', paddingBottom: '100px' }}>
      <article style={{ maxWidth: '850px', margin: '0 auto', padding: '60px 20px' }}>
        <Helmet>
          <title>{post.title} | Türk Edebiyatı Atlası</title>
          <meta name="description" content={post.excerpt} />
          <link rel="canonical" href={currentUrl} />
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={post.excerpt} />
          <meta property="og:url" content={currentUrl} />
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content="Türk Edebiyatı Atlası" />
          <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        </Helmet>

        <Link 
          to="/blog" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: 'var(--text-muted)', 
            textDecoration: 'none', 
            marginBottom: '60px',
            fontSize: '0.95rem',
            fontWeight: 600,
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={e => e.target.style.color = 'var(--amber)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={18} /> Blog Yazılarına Dön
        </Link>

        <motion.header 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '60px' }}
        >
          {/* Author Portraits Header Section */}
          {authorImages.length > 0 && (
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              marginBottom: '40px', 
              padding: '24px', 
              background: 'var(--bg-glass)', 
              borderRadius: '32px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-md)',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.05 }}>
                <ImageIcon size={120} />
              </div>
              {authorImages.map((auth, idx) => (
                <motion.div 
                  key={auth.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  style={{ textAlign: 'center', flex: 1, maxWidth: '100px' }}
                >
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '20px', 
                    overflow: 'hidden', 
                    border: '3px solid white', 
                    boxShadow: 'var(--shadow-sm)',
                    margin: '0 auto 10px',
                    background: 'var(--bg-surface)'
                  }}>
                    <img 
                      src={auth.image} 
                      alt={auth.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', lineHeight: '1.2' }}>{auth.name}</div>
                </motion.div>
              ))}
              <div style={{ flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '20px', borderLeft: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--amber)', textTransform: 'uppercase', marginBottom: '4px' }}>Temsilci Yazarlar</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Bu rehberde incelenen dönemin anahtar isimleri ve eser sahipleri.
                </div>
              </div>
            </div>
          )}

          <div style={{ 
            display: 'inline-flex', 
            gap: '20px', 
            fontSize: '0.85rem', 
            color: 'var(--amber)', 
            marginBottom: '24px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1.5px'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Tag size={16} /> {post.category}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} /> {post.date}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} /> 6 dk okuma</span>
          </div>
          
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 3.8rem)', 
            fontWeight: 800, 
            marginBottom: '32px', 
            lineHeight: '1.1',
            fontFamily: 'var(--font-display)',
            color: 'var(--text-primary)',
            letterSpacing: '-1.5px'
          }}>{post.title}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              background: 'var(--amber)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white', 
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(193, 127, 42, 0.3)'
            }}>EA</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{post.author}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Edebiyat Atlası Baş Editörü</div>
            </div>
          </div>
        </motion.header>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ 
            color: 'var(--text-secondary)',
            position: 'relative'
          }}
        >
          <div style={{ 
            position: 'absolute', 
            left: '-40px', 
            top: 0, 
            bottom: 0, 
            width: '1px', 
            background: 'var(--border)', 
            opacity: 0.5 
          }} />
          {renderContent(post.content)}
        </motion.div>

        <footer style={{ 
          marginTop: '100px', 
          padding: '60px', 
          background: 'var(--bg-surface)',
          borderRadius: '32px',
          textAlign: 'center',
          border: '1px solid var(--border)'
        }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '16px' }}>Bu rehber yardımcı oldu mu?</h4>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.1rem' }}>Sınav yolculuğundaki diğer arkadaşlarının da faydalanması için paylaşabilirsin.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ padding: '14px 32px', borderRadius: '16px' }}>Yazıyı Paylaş</button>
            <Link to="/" className="btn-secondary" style={{ padding: '14px 32px', borderRadius: '16px', textDecoration: 'none' }}>Atlasa Geri Dön</Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
