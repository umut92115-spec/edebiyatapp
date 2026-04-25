import React from 'react';

export function Skeleton({ width, height, borderRadius = '4px', className = '' }) {
  return (
    <div 
      className={`skeleton-base ${className}`}
      style={{ 
        width: width || '100%', 
        height: height || '20px', 
        borderRadius 
      }} 
    />
  );
}

export function AuthorCardSkeleton() {
  return (
    <div className="author-card skeleton-card">
      <div className="author-avatar">
        <Skeleton width="100%" height="100%" borderRadius="50%" />
      </div>
      <div className="skeleton-text-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Skeleton width="120px" height="18px" />
        <Skeleton width="80px" height="14px" />
      </div>
    </div>
  );
}

export function PeriodDescSkeleton() {
  return (
    <div className="period-description-banner skeleton-banner" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Skeleton width="48px" height="48px" borderRadius="12px" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Skeleton width="100%" height="16px" />
        <Skeleton width="90%" height="16px" />
        <Skeleton width="40%" height="14px" />
      </div>
    </div>
  );
}
