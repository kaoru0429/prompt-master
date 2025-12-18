import React from 'react';

const PromptCardSkeleton: React.FC = () => {
  return (
    <div className="prompt-card skeleton-container" style={{ minHeight: '180px' }}>
      <div className="prompt-card-header">
        <div className="skeleton-line" style={{ width: '60%', height: '20px', marginBottom: '12px' }} />
        <div className="skeleton-line" style={{ width: '90%', height: '14px', marginBottom: '8px' }} />
        <div className="skeleton-line" style={{ width: '40%', height: '14px' }} />
      </div>
      <div className="prompt-card-meta">
        <div className="skeleton-line" style={{ width: '30%', height: '12px' }} />
      </div>
      <div className="prompt-card-tags">
        <div className="skeleton-line" style={{ width: '20%', height: '24px', borderRadius: '12px' }} />
        <div className="skeleton-line" style={{ width: '25%', height: '24px', borderRadius: '12px' }} />
      </div>
      <div className="prompt-card-actions">
        <div className="skeleton-line" style={{ width: '30%', height: '32px' }} />
        <div className="skeleton-line" style={{ width: '30%', height: '32px' }} />
      </div>
    </div>
  );
};

export default PromptCardSkeleton;
