import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Mail, MessageCircle, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="static-page-container"
      style={{
        maxWidth: '1000px',
        margin: '40px auto',
        padding: '40px'
      }}
    >
      <Helmet>
        <title>İletişim | Türk Edebiyatı Atlası</title>
        <meta name="description" content="Sorularınız, önerileriniz veya iş birliği talepleriniz için bizimle iletişime geçin. Türk Edebiyatı Atlası ekibi size en kısa sürede dönüş yapacaktır." />
        <link rel="canonical" href="https://edebiyatapp.vercel.app/iletisim" />
        <meta property="og:title" content="İletişim | Türk Edebiyatı Atlası" />
        <meta property="og:description" content="Bizimle iletişime geçin." />
        <meta property="og:url" content="https://edebiyatapp.vercel.app/iletisim" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '24px' }}>Bize Ulaşın</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: '1.6' }}>
            Sitemizle ilgili her türlü geri bildiriminiz bizim için çok değerli. 
            Hatalı bir bilgi gördüğünüzde veya yeni özellik önerileriniz olduğunda çekinmeden yazabilirsiniz.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ padding: '12px', background: 'var(--rose-dim)', borderRadius: '12px', color: 'var(--rose)' }}>
                <Mail size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>E-posta</div>
                <div style={{ color: 'var(--text-secondary)' }}>info@edebiyatdonemler.com.tr</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ padding: '12px', background: 'var(--teal-dim)', borderRadius: '12px', color: 'var(--teal)' }}>
                <MessageCircle size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>Destek</div>
                <div style={{ color: 'var(--text-secondary)' }}>@edebiyat_atlasi (Instagram)</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ padding: '12px', background: 'var(--amber-dim)', borderRadius: '12px', color: 'var(--amber)' }}>
                <MapPin size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>Konum</div>
                <div style={{ color: 'var(--text-secondary)' }}>İstanbul, Türkiye</div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-premium" style={{ padding: '40px', borderRadius: '24px', border: '1px solid var(--border-light)' }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={e => e.preventDefault()}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Adınız Soyadınız</label>
              <input 
                type="text" 
                placeholder="Örn: Ahmet Yılmaz"
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>E-posta Adresiniz</label>
              <input 
                type="email" 
                placeholder="orn: ahmet@mail.com"
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Mesajınız</label>
              <textarea 
                rows={5}
                placeholder="Size nasıl yardımcı olabiliriz?"
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', resize: 'none' }}
              />
            </div>
            <button className="btn-primary" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Send size={18} /> Mesajı Gönder
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
