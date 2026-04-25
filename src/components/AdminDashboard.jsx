import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, FileText, Package, 
  Trash2, Plus, Database, Settings, 
  Search, FileJson, CheckCircle, AlertCircle
} from 'lucide-react';
import { dataService } from '../services/dataService';

export default function AdminDashboard({ onBack }) {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate('/'));
  const [sourceData, setSourceData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isAuthorized) {
      loadData();
    }
  }, [isAuthorized]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'edebiyat2025') {
      setIsAuthorized(true);
      localStorage.setItem('is_admin_active', 'true');
    } else {
      setMessage({ type: 'error', text: 'Hatalı şifre!' });
    }
  };

  if (!isAuthorized) {
    return (
      <div className="admin-login-overlay">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-login-card glass"
        >
          <Settings size={48} className="admin-login-icon" />
          <h2>Yönetici Girişi</h2>
          <p>Devam etmek için şifreyi girin.</p>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Şifre" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
            <button type="submit">Giriş Yap</button>
            <button type="button" className="btn-cancel" onClick={handleBack}>Vazgeç</button>
          </form>
          {message && <div className="admin-message error">{message.text}</div>}
        </motion.div>
      </div>
    );
  }

  const loadData = async () => {
    try {
      const data = await dataService.fetchSourceData();
      setSourceData(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Veriler yüklenemedi!' });
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    setSaving(true);
    try {
      const file = sourceData[selectedFile];
      await dataService.saveFile(`data/${selectedFile}`, file.type, file.content);
      setMessage({ type: 'success', text: 'Dosya başarıyla kaydedildi ve uygulama güncellendi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Kaydedilirken bir hata oluştu!' });
    } finally {
      setSaving(false);
    }
  };

  const updateTxtRow = (index, field, value) => {
    const newData = { ...sourceData };
    newData[selectedFile].content[index][field] = value;
    setSourceData(newData);
  };

  const addTxtRow = () => {
    const newData = { ...sourceData };
    newData[selectedFile].content.push({ author: '', work: '', type: '', unused: '', description: '' });
    setSourceData(newData);
  };

  const removeTxtRow = (index) => {
    const newData = { ...sourceData };
    newData[selectedFile].content.splice(index, 1);
    setSourceData(newData);
  };

  if (loading) return <div className="admin-loading">📊 Veriler Hazırlanıyor...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="admin-dashboard animate-in"
    >
      <div className="admin-header">
        <button className="btn-back" onClick={handleBack}>
          <ArrowLeft size={16} /> Uygulamaya Dön
        </button>
        <h2><Settings size={20} /> Veri Yönetim Paneli</h2>
      </div>

      {message && (
        <div className={`admin-message ${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      <div className="admin-layout">
        <aside className="admin-sidebar glass">
          <h3><Database size={16} /> Kaynak Dosyalar</h3>
          <ul className="file-list">
            {Object.keys(sourceData).map(fileName => (
              <li 
                key={fileName} 
                className={selectedFile === fileName ? 'active' : ''}
                onClick={() => setSelectedFile(fileName)}
              >
                {fileName.endsWith('.txt') ? <FileText size={14} /> : <FileJson size={14} />} 
                {fileName}
              </li>
            ))}
          </ul>
        </aside>

        <main className="admin-editor">
          {selectedFile ? (
            <div className="editor-container">
              <div className="editor-header">
                <h3>Düzenleniyor: <code>{selectedFile}</code></h3>
                <button 
                  className="btn-save-lg" 
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? '...' : <><Save size={16} /> Değişiklikleri Kaydet</>}
                </button>
              </div>

              {selectedFile === 'movementsData.json' ? (
                <div className="tag-manager-editor">
                  <p className="info-text">Sistemdeki akımları ve toplulukları yönetin:</p>
                  <div className="tag-list">
                    {Object.entries(sourceData[selectedFile].content).map(([tagName, data], idx) => (
                      <div key={tagName} className="tag-edit-card glass-premium" style={{ padding: '15px', borderRadius: '12px', marginBottom: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <strong style={{ fontSize: '1.1rem', color: 'var(--amber)' }}>{tagName}</strong>
                          <button className="btn-delete-sm" onClick={() => {
                            const newData = { ...sourceData };
                            delete newData[selectedFile].content[tagName];
                            setSourceData(newData);
                          }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="admin-field-group">
                          <label>Başlık</label>
                          <input 
                            value={data.title} 
                            onChange={e => {
                              const newData = { ...sourceData };
                              newData[selectedFile].content[tagName].title = e.target.value;
                              setSourceData(newData);
                            }}
                          />
                        </div>
                        <div className="admin-field-group" style={{ marginTop: '10px' }}>
                          <label>Açıklama</label>
                          <textarea 
                            value={data.description} 
                            style={{ minHeight: '100px' }}
                            onChange={e => {
                              const newData = { ...sourceData };
                              newData[selectedFile].content[tagName].description = e.target.value;
                              setSourceData(newData);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn-add-row" onClick={() => {
                    const newTagName = prompt('Yeni akım/etiket adını girin (Örn: İkinci Yeni):');
                    if (newTagName && !sourceData[selectedFile].content[newTagName]) {
                      const newData = { ...sourceData };
                      newData[selectedFile].content[newTagName] = {
                        title: newTagName.toUpperCase(),
                        description: '',
                        examCount: 0
                      };
                      setSourceData(newData);
                    }
                  }}>
                    <Plus size={16} /> Yeni Akım/Etiket Ekle
                  </button>
                </div>
              ) : sourceData[selectedFile].type === 'txt' ? (
                <div className="txt-editor">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Yazar</th>
                        <th>Eser</th>
                        <th>Tür</th>
                        <th>Açıklama</th>
                        <th>İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sourceData[selectedFile].content.map((row, idx) => (
                        <tr key={idx}>
                          <td>
                            <input 
                              value={row.author} 
                              onChange={e => updateTxtRow(idx, 'author', e.target.value)}
                            />
                          </td>
                          <td>
                            <input 
                              value={row.work} 
                              onChange={e => updateTxtRow(idx, 'work', e.target.value)}
                            />
                          </td>
                          <td>
                            <input 
                              value={row.type} 
                              onChange={e => updateTxtRow(idx, 'type', e.target.value)}
                            />
                          </td>
                          <td>
                            <textarea 
                              value={row.description} 
                              onChange={e => updateTxtRow(idx, 'description', e.target.value)}
                            />
                          </td>
                          <td>
                            <button className="btn-delete-sm" onClick={() => removeTxtRow(idx)}>
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button className="btn-add-row" onClick={addTxtRow}>
                    <Plus size={16} /> Yeni Satır Ekle
                  </button>
                </div>
              ) : (
                <div className="json-editor">
                  <p className="info-text">JSON dosyaları için doğrudan metin düzenleyici (Lütfen formatı bozmayın):</p>
                  <textarea
                    className="json-textarea"
                    value={JSON.stringify(sourceData[selectedFile].content, null, 2)}
                    onChange={e => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        const newData = { ...sourceData };
                        newData[selectedFile].content = parsed;
                        setSourceData(newData);
                      } catch (err) {
                        // Just let them keep typing
                      }
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="editor-placeholder">
              <div className="placeholder-content">
                <Package size={48} opacity={0.2} style={{ marginBottom: '20px' }} />
                📁 Düzenlemek istediğiniz dosyayı soldan seçin.
                <p>Burada yaptığınız değişiklikler doğrudan kaynak dosyalarına kaydedilir.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </motion.div>
  );
}
