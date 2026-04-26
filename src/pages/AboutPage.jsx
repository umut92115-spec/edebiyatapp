import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Info, Target, Heart, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="static-page-container"
      style={{
        maxWidth: '900px',
        margin: '40px auto',
        padding: '40px',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        border: '1px solid var(--border-light)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}
    >
      <Helmet>
        <title>Hakkımızda | Türk Edebiyatı Atlası</title>
        <meta name="description" content="Türk Edebiyatı Atlası'nın kuruluş amacı, vizyonu ve edebiyatı dijitalleştirme yolculuğu hakkında bilgi alın." />
        <link rel="canonical" href="https://edebiyatapp.vercel.app/hakkimizda" />
        <meta property="og:title" content="Hakkımızda | Türk Edebiyatı Atlası" />
        <meta property="og:description" content="Türk Edebiyatı Atlası'nın kuruluş amacı ve vizyonu." />
        <meta property="og:url" content="https://edebiyatapp.vercel.app/hakkimizda" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://edebiyatapp.vercel.app/og-image.png" />
      </Helmet>

      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ 
          display: 'inline-flex', 
          padding: '12px', 
          background: 'var(--indigo-dim)', 
          borderRadius: '16px', 
          color: 'var(--indigo)',
          marginBottom: '20px'
        }}>
          <Info size={32} />
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '16px' }}>Hakkımızda</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Türk edebiyatının zengin mirasını modern teknolojilerle harmanlayarak öğrenciler ve edebiyatseverler için interaktif bir atlas haline getirdik.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '60px' }}>
        <div className="about-card glass" style={{ padding: '32px', borderRadius: '20px' }}>
          <Target style={{ color: 'var(--amber)', marginBottom: '16px' }} size={24} />
          <h3 style={{ marginBottom: '12px' }}>Vizyonumuz</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Karmaşık edebiyat dönemlerini, yazar ve eser ilişkilerini görselleştirerek öğrenmeyi kolaylaştırmak ve kalıcı hale getirmek.
          </p>
        </div>
        <div className="about-card glass" style={{ padding: '32px', borderRadius: '20px' }}>
          <Heart style={{ color: 'var(--rose)', marginBottom: '16px' }} size={24} />
          <h3 style={{ marginBottom: '12px' }}>Neden Biz?</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            YKS, AYT ve okul sınavlarına hazırlanan öğrencilere, en güncel ve en rafine bilgileri interaktif bir kullanıcı deneyimiyle sunuyoruz.
          </p>
        </div>
      </div>

      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldCheck style={{ color: 'var(--teal)' }} /> Güvenilir Bilgi
        </h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          Sitemizdeki tüm veriler; MEB müfredatı, akademik kaynaklar ve ÖSYM'nin geçmiş yıllardaki soru sorma eğilimleri baz alınarak uzman ekibimiz tarafından titizlikle derlenmiştir. 
          Amacımız, bilgi kirliliğinden uzak, net ve hedefe yönelik bir edebiyat kaynağı oluşturmaktır.
        </p>
      </section>

      <div style={{ 
        padding: '30px', 
        background: 'var(--indigo-dim)', 
        borderRadius: '20px', 
        textAlign: 'center',
        border: '1px dashed var(--indigo)'
      }}>
        <p style={{ margin: 0, fontWeight: 600, color: 'var(--indigo)' }}>
          "Edebiyat, bir milletin hafızasıdır. Biz bu hafızayı dijital dünyada yaşatıyoruz."
        </p>
      </div>
    </motion.div>
  );
}
