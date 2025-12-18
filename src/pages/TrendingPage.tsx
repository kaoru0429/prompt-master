import React, { useState } from 'react';
import { ExternalLink, RefreshCw, Star, TrendingUp, Filter } from 'lucide-react';
import { usePromptStore } from '../stores/promptStore';

const TrendingPage: React.FC = () => {
  const { sources, syncSource } = usePromptStore();
  const [syncing, setSyncing] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'sfw' | 'nsfw'>('all');

  const handleSync = async (sourceId: string) => {
    setSyncing(sourceId);
    await syncSource(sourceId);
    setSyncing(null);
  };

  const filteredSources = sources.filter(s => {
    if (!s.enabled) return false;
    if (filter === 'sfw') return !s.isNSFW;
    if (filter === 'nsfw') return s.isNSFW;
    return true;
  });

  const sortedSources = [...filteredSources].sort((a, b) => (b.promptCount ?? 0) - (a.promptCount ?? 0));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={24} /> 熱門庫
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            從熱門 Prompt 來源同步最新內容 · 共 {sources.length} 個來源
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            全部
          </button>
          <button
            className={`btn ${filter === 'sfw' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('sfw')}
          >
            SFW
          </button>
          <button
            className={`btn ${filter === 'nsfw' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('nsfw')}
          >
            🔞 NSFW
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
        {sortedSources.map((source, index) => (
          <div
            key={source.id}
            style={{
              background: 'var(--bg-card)',
              border: `1px solid ${source.isNSFW ? 'rgba(239, 68, 68, 0.3)' : 'var(--border)'}`,
              borderRadius: 'var(--radius)',
              padding: '20px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {index < 3 && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Star size={12} /> TOP {index + 1}
              </div>
            )}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {source.name}
                {source.isNSFW && (
                  <span style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11px',
                    fontWeight: 500
                  }}>18+</span>
                )}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {source.url}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)' }}>
                {(source.promptCount ?? 0).toLocaleString()}+
                <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '4px' }}>prompts</span>
              </div>
              {source.lastSync && (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {new Date(source.lastSync).toLocaleDateString()}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <ExternalLink size={14} /> 訪問
              </a>
              <button
                className="btn btn-primary"
                onClick={() => handleSync(source.id)}
                disabled={syncing === source.id}
                style={{ flex: 1 }}
              >
                <RefreshCw size={14} className={syncing === source.id ? 'spinning' : ''} />
                {syncing === source.id ? '同步中...' : '同步'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSources.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
          <Filter size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
          <p>沒有符合條件的來源。請在設定中啟用更多來源。</p>
        </div>
      )}

      <div style={{ marginTop: '24px', padding: '16px', background: 'var(--bg-card)', borderRadius: 'var(--radius)', color: 'var(--text-muted)' }}>
        <p>💡 <strong>提示：</strong>同步功能目前會記錄同步時間。完整的爬蟲整合正在開發中。前往設定頁面可以啟用或停用來源。</p>
      </div>
    </div>
  );
};

export default TrendingPage;
