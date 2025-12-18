
import React, { useState, useEffect } from 'react';
import {
  Search, Plus, Heart, Copy, Sparkles, Tag, Settings,
  FolderOpen, TrendingUp, Star, X, Check, Wand2, Edit, Trash2,
  Download, Upload, FolderPlus, Folder, RefreshCw, ExternalLink
} from 'lucide-react';
import { usePromptStore } from '../stores/promptStore';
import { analyzePrompt } from '../services/gemini';
import { samplePrompts } from '../data/samplePrompts';
import type { Prompt, Variable, Collection } from '../types';

import { generateId } from '../utils/common';


// 解析變數
const parseVariables = (content: string): Variable[] => {
  const regex = /\{\{([^}]+)\}\}|\[([^\]]+)\]|\{([^}]+)\}/g;
  const variables: Variable[] = [];
  const seen = new Set<string>();

  let match;
  while ((match = regex.exec(content)) !== null) {
    const name = match[1] || match[2] || match[3];
    if (!seen.has(name)) {
      seen.add(name);
      variables.push({
        name,
        description: `請輸入 ${name}`,
        type: 'text',
        required: true
      });
    }
  }

  return variables;
};

// 替換變數
const replaceVariables = (content: string, values: Record<string, string>): string => {
  let result = content;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}|\\[${key}\\]|\\{${key}\\}`, 'g'), value);
  }
  return result;
};

// 頁面類型
type PageType = 'all' | 'favorites' | 'trending' | 'tags' | 'settings' | 'collections';

// Sidebar 元件
const Sidebar: React.FC<{
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}> = ({ currentPage, onPageChange }) => {
  const { prompts, sources, toggleSource, collections } = usePromptStore();
  const favorites = prompts.filter(p => p.isFavorite).length;

  return (
    <aside className="sidebar">
      <div className="logo">
        <Sparkles size={28} color="#6366f1" />
        <h2>Prompt Master</h2>
      </div>

      <nav className="nav-section">
        <div className="nav-section-title">主選單</div>
        <div
          className={`nav-item ${currentPage === 'all' ? 'active' : ''}`}
          onClick={() => onPageChange('all')}
        >
          <FolderOpen size={18} /> 所有 Prompts
          <span style={{ marginLeft: 'auto', opacity: 0.6 }}>{prompts.length}</span>
        </div>
        <div
          className={`nav-item ${currentPage === 'favorites' ? 'active' : ''}`}
          onClick={() => onPageChange('favorites')}
        >
          <Heart size={18} /> 收藏
          <span style={{ marginLeft: 'auto', opacity: 0.6 }}>{favorites}</span>
        </div>
        <div
          className={`nav-item ${currentPage === 'collections' ? 'active' : ''}`}
          onClick={() => onPageChange('collections')}
        >
          <Folder size={18} /> 收藏集
          <span style={{ marginLeft: 'auto', opacity: 0.6 }}>{collections.length}</span>
        </div>
        <div
          className={`nav-item ${currentPage === 'trending' ? 'active' : ''}`}
          onClick={() => onPageChange('trending')}
        >
          <TrendingUp size={18} /> 熱門庫
        </div>
        <div
          className={`nav-item ${currentPage === 'tags' ? 'active' : ''}`}
          onClick={() => onPageChange('tags')}
        >
          <Tag size={18} /> 標籤瀏覽
        </div>
      </nav>

      <nav className="nav-section">
        <div className="nav-section-title">Prompt 來源</div>
        {sources.map(source => (
          <div
            key={source.id}
            className="nav-item"
            onClick={() => toggleSource(source.id)}
            style={{ opacity: source.enabled ? 1 : 0.5 }}
          >
            <input
              type="checkbox"
              checked={source.enabled}
              onChange={() => toggleSource(source.id)}
              style={{ accentColor: '#6366f1' }}
            />
            {source.name}
            {source.isNSFW && <span className="tag nsfw" style={{ marginLeft: 'auto' }}>18+</span>}
          </div>
        ))}
      </nav>

      <nav className="nav-section">
        <div
          className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`}
          onClick={() => onPageChange('settings')}
        >
          <Settings size={18} /> 設定
        </div>
      </nav>
    </aside>
  );
};

import PromptCard from '../components/PromptCard';

// 查看/編輯 Prompt Modal
const ViewEditPromptModal: React.FC<{
  prompt: Prompt;
  onClose: () => void;
  onSave: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onUse: () => void;
}> = ({ prompt, onClose, onSave, onDelete, onUse }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(prompt.content);
  const [title, setTitle] = useState(prompt.title);
  const [description, setDescription] = useState(prompt.description);
  const [tags, setTags] = useState<string[]>(prompt.tags);
  const [category, setCategory] = useState(prompt.category);
  const [model, setModel] = useState(prompt.model);
  const [isNSFW, setIsNSFW] = useState(prompt.isNSFW);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (copied) {
      timeout = setTimeout(() => setCopied(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
  };

  const handleSave = () => {
    const variables = parseVariables(content);
    onSave({
      ...prompt,
      title,
      description,
      content,
      tags,
      category,
      model,
      variables,
      isNSFW,
      updatedAt: new Date().toISOString()
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('確定要刪除這個 Prompt 嗎？')) {
      onDelete(prompt.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <h2>{isEditing ? '編輯 Prompt' : prompt.title}</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            {!isEditing && (
              <button className="action-btn" onClick={() => setIsEditing(true)} title="編輯">
                <Edit size={18} />
              </button>
            )}
            <button className="action-btn" onClick={handleDelete} style={{ color: '#ef4444' }} title="刪除">
              <Trash2 size={18} />
            </button>
            <button className="action-btn" onClick={onClose} title="關閉">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          {isEditing ? (
            <>
              <div className="form-group">
                <label className="form-label">標題</label>
                <input
                  className="form-input"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">描述</label>
                <input
                  className="form-input"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Prompt 內容</label>
                <textarea
                  className="form-textarea"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  style={{ minHeight: '250px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">標籤 (逗號分隔)</label>
                <input
                  className="form-input"
                  value={tags.join(', ')}
                  onChange={e => setTags(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">分類</label>
                  <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="Coding">Coding</option>
                    <option value="Writing">Writing</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Image">Image</option>
                    <option value="Research">Research</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Creative">Creative</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">模型</label>
                  <select className="form-input" value={model} onChange={e => setModel(e.target.value)}>
                    <option value="All">All</option>
                    <option value="ChatGPT">ChatGPT</option>
                    <option value="Claude">Claude</option>
                    <option value="Gemini">Gemini</option>
                  </select>
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={isNSFW} onChange={e => setIsNSFW(e.target.checked)} />
                <span>NSFW 內容</span>
              </label>
            </>
          ) : (
            <>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{prompt.description}</p>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {prompt.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
                <span>📁 {prompt.category}</span>
                <span>🤖 {prompt.model}</span>
                {prompt.variables.length > 0 && <span>📝 {prompt.variables.length} 變數</span>}
                {prompt.isNSFW && <span className="tag nsfw">18+</span>}
              </div>

              <h4 style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>Prompt 內容</h4>
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px',
                  fontFamily: "'Fira Code', monospace",
                  fontSize: '13px',
                  lineHeight: '1.7',
                  whiteSpace: 'pre-wrap',
                  maxHeight: '350px',
                  overflow: 'auto'
                }}
              >
                {prompt.content}
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          {isEditing ? (
            <>
              <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleSave}>
                <Check size={16} /> 儲存變更
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={handleCopy}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? '已複製!' : '複製原始內容'}
              </button>
              <button className="btn btn-primary" onClick={onUse}>
                <Wand2 size={16} /> 使用此 Prompt
              </button>
            </>
          )}
        </div>
      </div>

      {copied && <div className="copy-success">✓ 已複製到剪貼簿</div>}
    </div>
  );
};

// 新增 Prompt Modal
const AddPromptModal: React.FC<{
  onClose: () => void;
  onSave: (prompt: Prompt) => void;
}> = ({ onClose, onSave }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState('Other');
  const [model, setModel] = useState('All');
  const [isNSFW, setIsNSFW] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!content.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzePrompt(content);
      setTitle(result.title);
      setDescription(result.description);
      setTags(result.tags);
      setCategory(result.category);
      setModel(result.model);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
    setIsAnalyzing(false);
  };

  const handleSave = () => {
    const variables = parseVariables(content);

    const prompt: Prompt = {
      id: generateId(),
      title: title || '未命名 Prompt',
      description,
      content,
      tags,
      category,
      model,
      mode: 'text',
      variables,
      isFavorite: false,
      isNSFW,
      source: 'local',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(prompt);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>新增 Prompt</h2>
          <button className="action-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Prompt 內容 *</label>
            <textarea
              className="form-textarea"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="貼上您的 Prompt...&#10;支援變數格式: {{variable}} 或 [variable]"
              style={{ minHeight: '200px' }}
            />
          </div>

          <button
            className="btn btn-secondary"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !content.trim()}
            style={{ marginBottom: '20px' }}
          >
            <Sparkles size={16} />
            {isAnalyzing ? 'AI 分析中...' : 'AI 自動分析'}
          </button>

          <div className="form-group">
            <label className="form-label">標題</label>
            <input
              className="form-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Prompt 標題"
            />
          </div>

          <div className="form-group">
            <label className="form-label">描述</label>
            <input
              className="form-input"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="簡短描述"
            />
          </div>

          <div className="form-group">
            <label className="form-label">標籤 (用逗號分隔)</label>
            <input
              className="form-input"
              value={tags.join(', ')}
              onChange={e => setTags(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
              placeholder="coding, productivity, creative"
            />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">分類</label>
              <select
                className="form-input"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="Coding">Coding</option>
                <option value="Writing">Writing</option>
                <option value="Marketing">Marketing</option>
                <option value="Image">Image</option>
                <option value="Research">Research</option>
                <option value="Productivity">Productivity</option>
                <option value="Creative">Creative</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">模型</label>
              <select
                className="form-input"
                value={model}
                onChange={e => setModel(e.target.value)}
              >
                <option value="All">All</option>
                <option value="ChatGPT">ChatGPT</option>
                <option value="Claude">Claude</option>
                <option value="Gemini">Gemini</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isNSFW}
                onChange={e => setIsNSFW(e.target.checked)}
                style={{ accentColor: '#ef4444' }}
              />
              <span className="form-label" style={{ margin: 0 }}>NSFW 內容</span>
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>取消</button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Plus size={16} /> 儲存 Prompt
          </button>
        </div>
      </div>
    </div>
  );
};

// 使用 Prompt Modal (變數填入)
const UsePromptModal: React.FC<{
  prompt: Prompt;
  onClose: () => void;
}> = ({ prompt, onClose }) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const finalPrompt = replaceVariables(prompt.content, values);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (copied) {
      timeout = setTimeout(() => setCopied(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(finalPrompt);
    setCopied(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{prompt.title}</h2>
          <button className="action-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {prompt.variables.length > 0 && (
            <>
              <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>填入變數</h3>
              {prompt.variables.map(variable => (
                <div key={variable.name} className="variable-input">
                  <label>{'{{' + variable.name + '}}'}</label>
                  <input
                    className="form-input"
                    value={values[variable.name] || ''}
                    onChange={e => setValues({ ...values, [variable.name]: e.target.value })}
                    placeholder={variable.description}
                  />
                  <div className="hint">{variable.description}</div>
                </div>
              ))}
            </>
          )}

          <h3 style={{ marginBottom: '12px', marginTop: '20px', fontSize: '16px' }}>
            完成的 Prompt
          </h3>
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              fontFamily: "'Fira Code', monospace",
              fontSize: '13px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              maxHeight: '300px',
              overflow: 'auto'
            }}
          >
            {finalPrompt}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>關閉</button>
          <button className="btn btn-primary" onClick={handleCopy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? '已複製!' : '複製到剪貼簿'}
          </button>
        </div>
      </div>

      {copied && <div className="copy-success">✓ 已複製到剪貼簿</div>}
    </div>
  );
};

// 匯入/匯出 Modal
const ImportExportModal: React.FC<{
  onClose: () => void;
  prompts: Prompt[];
  onImport: (prompts: Prompt[]) => void;
}> = ({ onClose, prompts, onImport }) => {
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

// 收藏集 Modal
const CollectionModal: React.FC<{
  onClose: () => void;
  onSave: (collection: Collection) => void;
  existingCollection?: Collection;
}> = ({ onClose, onSave, existingCollection }) => {
  const [name, setName] = useState(existingCollection?.name || '');
  const [description, setDescription] = useState(existingCollection?.description || '');
  const [icon, setIcon] = useState(existingCollection?.icon || '📁');
  const [color, setColor] = useState(existingCollection?.color || '#6366f1');

  const handleSave = () => {
    const collection: Collection = {
      id: existingCollection?.id || generateId(),
      name: name || '未命名收藏集',
      description,
      icon,
      color,
      promptIds: existingCollection?.promptIds || [],
      isVirtual: false,
      createdAt: existingCollection?.createdAt || new Date().toISOString()
    };
    onSave(collection);
    onClose();
  };

  const icons = ['📁', '💼', '🎨', '💻', '📝', '🚀', '⭐', '🔥', '💡', '🎯'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2>{existingCollection ? '編輯收藏集' : '新增收藏集'}</h2>
          <button className="action-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">圖示</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {icons.map(i => (
                <button
                  key={i}
                  onClick={() => setIcon(i)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '20px',
                    background: icon === i ? 'var(--accent)' : 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer'
                  }}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">名稱</label>
            <input
              className="form-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="收藏集名稱"
            />
          </div>

          <div className="form-group">
            <label className="form-label">描述</label>
            <input
              className="form-input"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="簡短描述"
            />
          </div>

          <div className="form-group">
            <label className="form-label">顏色</label>
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              style={{ width: '60px', height: '40px', cursor: 'pointer' }}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>取消</button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Check size={16} /> 儲存
          </button>
        </div>
      </div>
    </div>
  );
};

// 標籤瀏覽頁面
const TagsPage: React.FC<{ onTagClick: (tag: string) => void }> = ({ onTagClick }) => {
  const { prompts } = usePromptStore();

  // 計算標籤統計
  const tagStats = prompts.reduce((acc, p) => {
    p.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const sortedTags = Object.entries(tagStats).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>標籤瀏覽</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {sortedTags.map(([tag, count]) => (
          <div
            key={tag}
            className="tag"
            onClick={() => onTagClick(tag)}
            style={{
              cursor: 'pointer',
              padding: '8px 16px',
              fontSize: '14px'
            }}
          >
            {tag} <span style={{ opacity: 0.6 }}>({count})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 收藏集頁面
const CollectionsPage: React.FC<{
  onCollectionClick: (collection: Collection) => void;
  onAddCollection: () => void;
}> = ({ onCollectionClick, onAddCollection }) => {
  const { collections, deleteCollection } = usePromptStore();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>收藏集</h2>
        <button className="btn btn-primary" onClick={onAddCollection}>
          <FolderPlus size={16} /> 新增收藏集
        </button>
      </div>

      {collections.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <Folder size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <h3 style={{ marginBottom: '8px' }}>還沒有收藏集</h3>
          <p>建立收藏集來整理您的 Prompts</p>
        </div>
      ) : (
        <div className="prompt-grid">
          {collections.map(collection => (
            <div
              key={collection.id}
              className="prompt-card"
              onClick={() => onCollectionClick(collection)}
              style={{ cursor: 'pointer' }}
            >
              <div className="prompt-card-header">
                <h3 className="prompt-card-title">
                  <span style={{ fontSize: '24px', marginRight: '8px' }}>{collection.icon}</span>
                  {collection.name}
                </h3>
                <p className="prompt-card-description">{collection.description}</p>
              </div>
              <div className="prompt-card-meta">
                <span style={{ color: collection.color }}>●</span>
                <span>{collection.promptIds.length} 個 Prompts</span>
              </div>
              <div className="prompt-card-actions" onClick={e => e.stopPropagation()}>
                <button
                  className="action-btn"
                  onClick={() => {
                    if (confirm('確定要刪除這個收藏集嗎？')) {
                      deleteCollection(collection.id);
                    }
                  }}
                  style={{ color: '#ef4444' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 熱門庫頁面 (含同步功能)
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

// 設定頁面
const SettingsPage: React.FC<{ onOpenImportExport: () => void }> = ({ onOpenImportExport }) => {
  const { sources, toggleSource } = usePromptStore();

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>設定</h2>

      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>📦 備份與還原</h3>
        <button className="btn btn-secondary" onClick={onOpenImportExport}>
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
    </div>
  );
};

// 主元件
const HomePage: React.FC = () => {
  console.log('HomePage rendering...');
  const { prompts, filters, setFilter, addPrompt, updatePrompt, deletePrompt, toggleFavorite, loadPrompts, addCollection } = usePromptStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportExportModal, setShowImportExportModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [usePrompt, setUsePrompt] = useState<Prompt | null>(null);
  const [viewPrompt, setViewPrompt] = useState<Prompt | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'nsfw'>('all');

  useEffect(() => {
    console.log('HomePage useEffect loadPrompts...');
    loadPrompts().then(() => {
      console.log('loadPrompts success');
      const state = usePromptStore.getState();
      if (state.prompts.length === 0) {
        samplePrompts.forEach(p => state.addPrompt(p));
      }
    }).catch(err => {
      console.error('loadPrompts failed:', err);
    });
  }, []);

  // 處理標籤點擊
  const handleTagClick = (tag: string) => {
    setFilter('search', tag);
    setCurrentPage('all');
  };

  // 處理批量匯入
  const handleBulkImport = (importedPrompts: Prompt[]) => {
    importedPrompts.forEach(p => addPrompt(p));
  };

  // 過濾 prompts
  const filteredPrompts = prompts.filter(p => {
    if (activeTab === 'favorites' && !p.isFavorite) return false;
    if (activeTab === 'nsfw' && !p.isNSFW) return false;
    if (!filters.showNSFW && p.isNSFW && activeTab !== 'nsfw') return false;

    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (!p.title.toLowerCase().includes(search) &&
        !p.description.toLowerCase().includes(search) &&
        !p.tags.some(t => t.toLowerCase().includes(search))) {
        return false;
      }
    }

    if (filters.category && p.category !== filters.category) return false;
    if (filters.model && p.model !== filters.model) return false;

    return true;
  });

  // 根據 currentPage 設置 activeTab
  useEffect(() => {
    if (currentPage === 'favorites') {
      setActiveTab('favorites');
    } else if (currentPage === 'all') {
      setActiveTab('all');
    }
  }, [currentPage]);

  const renderContent = () => {
    if (currentPage === 'tags') {
      return <TagsPage onTagClick={handleTagClick} />;
    }

    if (currentPage === 'settings') {
      return <SettingsPage onOpenImportExport={() => setShowImportExportModal(true)} />;
    }

    if (currentPage === 'trending') {
      return <TrendingPage />;
    }

    if (currentPage === 'collections') {
      return (
        <CollectionsPage
          onCollectionClick={(collection) => {
            // TODO: 顯示收藏集內的 Prompts
            console.log('View collection:', collection);
          }}
          onAddCollection={() => setShowCollectionModal(true)}
        />
      );
    }

    return (
      <>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <FolderOpen size={16} /> 全部
            <span className="count">{prompts.length}</span>
          </button>
          <button
            className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <Heart size={16} /> 收藏
            <span className="count">{prompts.filter(p => p.isFavorite).length}</span>
          </button>
          <button
            className={`tab ${activeTab === 'nsfw' ? 'active' : ''}`}
            onClick={() => setActiveTab('nsfw')}
          >
            <Star size={16} /> NSFW
            <span className="count">{prompts.filter(p => p.isNSFW).length}</span>
          </button>
        </div>

        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            className="search-input"
            placeholder="搜尋 prompts..."
            value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
          />
        </div>

        <div className="filters">
          <select
            className="filter-select"
            value={filters.category}
            onChange={e => setFilter('category', e.target.value)}
          >
            <option value="">所有分類</option>
            <option value="Coding">Coding</option>
            <option value="Writing">Writing</option>
            <option value="Marketing">Marketing</option>
            <option value="Image">Image</option>
            <option value="Research">Research</option>
            <option value="Productivity">Productivity</option>
            <option value="Creative">Creative</option>
          </select>

          <select
            className="filter-select"
            value={filters.model}
            onChange={e => setFilter('model', e.target.value)}
          >
            <option value="">所有模型</option>
            <option value="ChatGPT">ChatGPT</option>
            <option value="Claude">Claude</option>
            <option value="Gemini">Gemini</option>
          </select>

          <label className="filter-select" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={filters.showNSFW}
              onChange={e => setFilter('showNSFW', e.target.checked)}
            />
            顯示 NSFW
          </label>
        </div>

        {filteredPrompts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <Sparkles size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h3 style={{ marginBottom: '8px' }}>還沒有 Prompt</h3>
            <p>點擊右上角「新增 Prompt」開始建立您的收藏</p>
          </div>
        ) : (
          <div className="prompt-grid">
            {filteredPrompts.map(prompt => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onView={() => setViewPrompt(prompt)}
                onUse={() => setUsePrompt(prompt)}
                onToggleFavorite={() => toggleFavorite(prompt.id)}
              />
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="app-container">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="main-content">
        <div className="header">
          <h1>Prompt Master</h1>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> 新增 Prompt
          </button>
        </div>
        {renderContent()}
      </main>

      {showAddModal && (
        <AddPromptModal
          onClose={() => setShowAddModal(false)}
          onSave={addPrompt}
        />
      )}

      {showImportExportModal && (
        <ImportExportModal
          onClose={() => setShowImportExportModal(false)}
          prompts={prompts}
          onImport={handleBulkImport}
        />
      )}

      {showCollectionModal && (
        <CollectionModal
          onClose={() => setShowCollectionModal(false)}
          onSave={addCollection}
        />
      )}

      {viewPrompt && (
        <ViewEditPromptModal
          prompt={viewPrompt}
          onClose={() => setViewPrompt(null)}
          onSave={(updatedPrompt: Prompt) => {
            updatePrompt(updatedPrompt.id, updatedPrompt);
            setViewPrompt(null);
          }}
          onDelete={deletePrompt}
          onUse={() => {
            setUsePrompt(viewPrompt);
            setViewPrompt(null);
          }}
        />
      )}

      {usePrompt && (
        <UsePromptModal
          prompt={usePrompt}
          onClose={() => setUsePrompt(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
