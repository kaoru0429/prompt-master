import React, { useState } from 'react';
import { Check, Copy, Heart, Wand2 } from 'lucide-react';
import type { Prompt } from '../types';
import TextHighlighter from './TextHighlighter';

interface PromptCardProps {
  prompt: Prompt;
  searchTerm?: string;
  onView: () => void;
  onUse: () => void;
  onToggleFavorite: () => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, searchTerm = '', onView, onUse, onToggleFavorite }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardClick = () => {
    // 確保點擊卡片本體時開啟查看詳情
    onView();
  };

  const handleUseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUse();
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite();
  };

  return (
    <div className="prompt-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="prompt-card-header">
        <h3 className="prompt-card-title">
          {prompt.isNSFW && <span className="tag nsfw">18+</span>}
          <TextHighlighter text={prompt.title} highlight={searchTerm} />
        </h3>
        <p className="prompt-card-description">
          <TextHighlighter text={prompt.description} highlight={searchTerm} />
        </p>
      </div>

      <div className="prompt-card-tags">
        {prompt.tags.slice(0, 4).map(tag => (
          <span key={tag} className="tag">
            <TextHighlighter text={tag} highlight={searchTerm} />
          </span>
        ))}
        {prompt.tags.length > 4 && (
          <span className="tag">+{prompt.tags.length - 4}</span>
        )}
      </div>

      <div className="prompt-card-meta">
        <span>{prompt.model}</span>
        <span>•</span>
        <span>{prompt.category}</span>
        {prompt.variables.length > 0 && (
          <>
            <span>•</span>
            <span>{prompt.variables.length} 變數</span>
          </>
        )}
      </div>

      <div className="prompt-card-actions" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="action-btn" onClick={handleCopy} title="複製原始內容">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? '已複製' : '複製'}
          </button>
          <button className="action-btn" onClick={handleFavoriteClick} title="收藏">
            <Heart size={16} fill={prompt.isFavorite ? '#ef4444' : 'none'} color={prompt.isFavorite ? '#ef4444' : 'currentColor'} />
          </button>
        </div>
        <button className="action-btn primary" onClick={handleUseClick} title="填入變數後使用">
          <Wand2 size={16} /> 使用
        </button>
      </div>
    </div>
  );
};

export default PromptCard;
