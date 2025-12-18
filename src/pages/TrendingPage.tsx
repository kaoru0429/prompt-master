import React, { useState } from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { usePromptStore } from '../stores/promptStore';

const TrendingPage: React.FC = () => {
  const { sources, syncSource } = usePromptStore();
  const [syncing, setSyncing] = useState<string | null>(null);

  const handleSync = async (sourceId: string) => {
    setSyncing(sourceId);
    await syncSource(sourceId);
    setSyncing(null);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>熱門庫</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        從熱門 Prompt 來源同步最新內容
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sources.filter(s => s.enabled).map(source => (
          <div
            key={source.id}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>{source.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {source.url}
                {source.lastSync && (
                  <span style={{ marginLeft: '12px' }}>
                    上次同步: {new Date(source.lastSync).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ExternalLink size={14} /> 訪問
              </a>
              <button
                className="btn btn-primary"
                onClick={() => handleSync(source.id)}
                disabled={syncing === source.id}
              >
                <RefreshCw size={14} className={syncing === source.id ? 'spinning' : ''} />
                {syncing === source.id ? '同步中...' : '同步'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '24px', padding: '16px', background: 'var(--bg-card)', borderRadius: 'var(--radius)', color: 'var(--text-muted)' }}>
        <p>💡 <strong>提示：</strong>同步功能目前會記錄同步時間。完整的爬蟲整合正在開發中。</p>
      </div>
    </div>
  );
};

export default TrendingPage;
