import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export function AutoBreadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb-nav">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <Link to="/" className="breadcrumb-link">
            <Home size={14} />
            <span>Ana Sayfa</span>
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          const labelMap = {
            'hakkimizda': 'Hakkımızda',
            'iletisim': 'İletişim',
            'blog': 'Edebiyat Blogu',
            'quiz': 'Edebiyat Quiz'
          };

          const label = labelMap[value] || value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

          return (
            <li key={to} className="breadcrumb-item">
              <ChevronRight size={14} className="breadcrumb-separator" />
              {last ? (
                <span className="breadcrumb-current" aria-current="page">{label}</span>
              ) : (
                <Link to={to} className="breadcrumb-link">{label}</Link>
              )}
            </li>
          );
        })}
      </ol>

      <style>{`
        .breadcrumb-nav {
          margin-bottom: 24px;
          font-size: 0.85rem;
        }
        .breadcrumb-list {
          display: flex;
          align-items: center;
          list-style: none;
          padding: 0;
          margin: 0;
          flex-wrap: wrap;
          gap: 8px;
        }
        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
        }
        .breadcrumb-link {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .breadcrumb-link:hover {
          color: var(--amber);
        }
        .breadcrumb-separator {
          opacity: 0.5;
        }
        .breadcrumb-current {
          color: var(--text-primary);
          font-weight: 600;
        }
      `}</style>
    </nav>
  );
}
