import React, { useState } from 'react';
import { Download, Upload, X } from 'lucide-react';
import type { Prompt } from '../../types';
import { generateId } from '../../utils/common';
import { parseVariables } from '../../utils/variableUtils';

interface ImportExportModalProps {
  onClose: () => void;
  prompts: Prompt[];
  onImport: (prompts: Prompt[]) => void;
}

const ImportExportModal: React.FC<ImportExportModalProps> = ({ onClose, prompts, onImport }) => {
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState('');
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExportJSON = () => {
    const data = JSON.stringify(prompts, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-master-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2000);
  };

  const handleExportMarkdown = () => {
    let md = '# Prompt Master Backup\n\n';
    md += `> Exported on ${new Date().toLocaleString()}\n\n`;
    md += `> Total prompts: ${prompts.length}\n\n---\n\n`;

    prompts.forEach((p, index) => {
      md += `## ${index + 1}. ${p.title}\n\n`;
      md += `**Description:** ${p.description}\n\n`;
      md += `**Category:** ${p.category} | **Model:** ${p.model}\n\n`;
      md += `**Tags:** ${p.tags.join(', ')}\n\n`;
      md += `### Content\n\n\`\`\`\n${p.content}\n\`\`\`\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-master-backup-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2000);
  };

  const handleImport = () => {
    setImportError('');
    try {
      const data = JSON.parse(importData);
      if (!Array.isArray(data)) {
        throw new Error('Invalid format: expected an array');
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validPrompts: Prompt[] = data.map((item: any) => ({
        id: item.id || generateId(),
        title: item.title || '匯入的 Prompt',
        description: item.description || '',
        content: item.content || '',
        tags: item.tags || [],
        category: item.category || 'Other',
        model: item.model || 'All',
        mode: item.mode || 'text',
        variables: item.variables || parseVariables(item.content || ''),
        isFavorite: item.isFavorite || false,
        isNSFW: item.isNSFW || false,
        source: 'local',
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      onImport(validPrompts);
      onClose();
    } catch (error) {
      setImportError('JSON 格式錯誤，請確認格式正確');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImportData(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>匯入 / 匯出</h2>
          <button className="action-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>
              <Download size={18} style={{ marginRight: '8px' }} />
              匯出 Prompts ({prompts.length} 個)
            </h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-secondary" onClick={handleExportJSON}>
                匯出 JSON
              </button>
              <button className="btn btn-secondary" onClick={handleExportMarkdown}>
                匯出 Markdown
              </button>
            </div>
            {exportSuccess && <span style={{ color: 'var(--success)', marginLeft: '12px' }}>✓ 匯出成功!</span>}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '20px 0' }} />

          <div>
            <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>
              <Upload size={18} style={{ marginRight: '8px' }} />
              匯入 Prompts
            </h3>
            <div className="form-group">
              <label className="form-label">選擇 JSON 檔案</label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                style={{ marginBottom: '12px' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">或直接貼上 JSON</label>
              <textarea
                className="form-textarea"
                value={importData}
                onChange={e => setImportData(e.target.value)}
                placeholder='[{"title": "...", "content": "...", ...}]'
                style={{ minHeight: '150px' }}
              />
            </div>
            {importError && <p style={{ color: 'var(--danger)', marginBottom: '12px' }}>{importError}</p>}
            <button
              className="btn btn-primary"
              onClick={handleImport}
              disabled={!importData.trim()}
            >
              <Upload size={16} /> 匯入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExportModal;
