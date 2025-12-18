import React, { useState } from 'react';
import { X, Sparkles, Plus } from 'lucide-react';
import { analyzePrompt } from '../../services/gemini';
import { generateId } from '../../utils/common';
import { parseVariables } from '../../utils/variableUtils';
import type { Prompt } from '../../types';
import { usePromptStore } from '../../stores/promptStore';
import AIEditor from '../AIEditor';

interface AddPromptModalProps {
  onClose: () => void;
  onSave: (prompt: Prompt) => void;
}

const AddPromptModal: React.FC<AddPromptModalProps> = ({ onClose, onSave }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState('Other');
  const [model, setModel] = useState('All');
  const [isNSFW, setIsNSFW] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

  const { collections, addToCollection } = usePromptStore();

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

    // Save to selected collections
    selectedCollections.forEach(collectionId => {
      addToCollection(collectionId, prompt.id);
    });

    onClose();
  };

  const toggleCollection = (id: string) => {
    setSelectedCollections(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
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
            <AIEditor
              value={content}
              onChange={setContent}
              placeholder="貼上您的 Prompt...&#10;支援變數格式: {{variable}} 或 [variable]&#10;按 / 呼叫 AI 助手"
              minHeight="200px"
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
            <label className="form-label">加入收藏集</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {collections.map(c => {
                const isSelected = selectedCollections.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleCollection(c.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '13px',
                      border: `1px solid ${isSelected ? c.color : 'var(--border)'}`,
                      background: isSelected ? `${c.color}20` : 'transparent',
                      color: isSelected ? c.color : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {c.icon} {c.name}
                  </button>
                );
              })}
              {collections.length === 0 && (
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>尚未建立收藏集</span>
              )}
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

export default AddPromptModal;
