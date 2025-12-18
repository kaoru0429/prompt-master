import React, { useState } from 'react';
import {
  Edit, Trash2, X, Check, Copy, Wand2, FolderPlus, FolderCheck, Sparkles, RotateCcw
} from 'lucide-react';
import type { Prompt } from '../../types';
import { parseVariables } from '../../utils/variableUtils';
import { useClipboard } from '../../hooks/useClipboard';
import { usePromptStore } from '../../stores/promptStore';
import { analyzePrompt } from '../../services/gemini';
import AIEditor from '../AIEditor';

interface ViewEditPromptModalProps {
  prompt: Prompt;
  onClose: () => void;
  onSave: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onUse: () => void;
}

const ViewEditPromptModal: React.FC<ViewEditPromptModalProps> = ({
  prompt, onClose, onSave, onDelete, onUse
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(prompt.content);
  const [title, setTitle] = useState(prompt.title);
  const [description, setDescription] = useState(prompt.description);
  const [tags, setTags] = useState<string[]>(prompt.tags);
  const [category, setCategory] = useState(prompt.category);
  const [model, setModel] = useState(prompt.model);
  const [isNSFW, setIsNSFW] = useState(prompt.isNSFW);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { collections, addToCollection, removeFromCollection } = usePromptStore();
  const { copied, copyToClipboard } = useClipboard();

  const handleCopy = () => {
    copyToClipboard(content);
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

  const toggleCollection = (collectionId: string, isInCollection: boolean) => {
    if (isInCollection) {
      removeFromCollection(collectionId, prompt.id);
    } else {
      addToCollection(collectionId, prompt.id);
    }
  };

  const handleAnalyze = async () => {
    if (!content.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzePrompt(content);
      setTitle(result.title);
      setDescription(result.description);
      setTags(result.tags);
      setCategory(result.category);
      setModel(result.model);
    } catch (err) {
      console.error('AI Analysis failed:', err);
      alert('AI 分析失敗，請檢查 API Key 設定。');
    } finally {
      setIsAnalyzing(false);
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Prompt 內容</label>
                  <button
                    className="action-btn"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    style={{ color: 'var(--accent)', fontSize: '12px', gap: '4px' }}
                  >
                    <Sparkles size={14} className={isAnalyzing ? 'spin' : ''} />
                    {isAnalyzing ? '分析中...' : 'AI 優化'}
                  </button>
                  {prompt.history && prompt.history.length > 0 && (
                    <button
                      className="action-btn"
                      onClick={() => setShowHistory(!showHistory)}
                      style={{ color: 'var(--text-secondary)', fontSize: '12px', gap: '4px' }}
                    >
                      <RotateCcw size={14} />
                      歷史紀錄
                    </button>
                  )}
                </div>
                {showHistory && prompt.history && (
                  <div style={{
                    marginBottom: '12px',
                    background: 'var(--bg-primary)',
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>最近 10 次變動:</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '150px', overflow: 'auto' }}>
                      {prompt.history.map((entry) => (
                        <div
                          key={entry.id}
                          onClick={() => {
                            setContent(entry.content);
                            setShowHistory(false);
                          }}
                          style={{
                            padding: '6px 8px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            background: 'var(--bg-card)',
                            border: '1px solid transparent'
                          }}
                          onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                          onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}
                        >
                          <div style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>
                            {new Date(entry.timestamp).toLocaleString()}
                          </div>
                          <div style={{
                            color: 'var(--text-muted)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {entry.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <AIEditor
                  value={content}
                  onChange={setContent}
                  minHeight="250px"
                  placeholder="Prompt 內容..."
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

              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>收藏至</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {collections.map(c => {
                    const isInCollection = c.promptIds.includes(prompt.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleCollection(c.id, isInCollection)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '13px',
                          border: `1px solid ${isInCollection ? c.color : 'var(--border)'}`,
                          background: isInCollection ? `${c.color}20` : 'transparent',
                          color: isInCollection ? c.color : 'var(--text-muted)',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {isInCollection ? <FolderCheck size={14} /> : <FolderPlus size={14} />}
                        {c.icon} {c.name}
                      </button>
                    );
                  })}
                  {collections.length === 0 && (
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>尚未建立收藏集</span>
                  )}
                </div>
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

export default ViewEditPromptModal;
