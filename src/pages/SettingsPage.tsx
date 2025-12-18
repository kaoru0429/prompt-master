import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { usePromptStore } from '../stores/promptStore';
import ImportExportModal from '../components/modals/ImportExportModal';
import type { Prompt } from '../types';

const SettingsPage: React.FC = () => {
  const { prompts, sources, toggleSource, addPrompt } = usePromptStore();
  const [showImportExport, setShowImportExport] = useState(false);

  const handleBulkImport = (importedPrompts: Prompt[]) => {
    importedPrompts.forEach(p => addPrompt(p));
  };

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>設定</h2>

      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>📦 備份與還原</h3>
        <button className="btn btn-secondary" onClick={() => setShowImportExport(true)}>
          <Download size={16} /> 匯入 / 匯出 Prompts
        </button>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Prompt 來源管理</h3>
        {sources.map(source => (
          <div key={source.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <input
              type="checkbox"
              checked={source.enabled}
              onChange={() => toggleSource(source.id)}
              style={{ accentColor: '#6366f1' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500 }}>{source.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{source.url}</div>
            </div>
            {source.isNSFW && <span className="tag nsfw">NSFW</span>}
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '20px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>關於</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Prompt Master v1.1.0<br />
          使用 Gemini AI 進行智慧分析<br />
          資料儲存於本地 IndexedDB
        </p>
      </div>

      {showImportExport && (
        <ImportExportModal
          onClose={() => setShowImportExport(false)}
          prompts={prompts}
          onImport={handleBulkImport}
        />
      )}
    </div>
  );
};

export default SettingsPage;
