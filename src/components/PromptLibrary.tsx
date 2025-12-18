import React from 'react';
import { Search, FolderOpen, Heart, Star, Sparkles } from 'lucide-react';
import { usePromptStore } from '../stores/promptStore';
import { usePromptFilters } from '../hooks/usePromptFilters';
import PromptCard from './PromptCard';
import PromptCardSkeleton from './PromptCardSkeleton';
import type { Prompt } from '../types';

interface PromptLibraryProps {
  onViewPrompt: (prompt: Prompt) => void;
  onUsePrompt: (prompt: Prompt) => void;
  onToggleFavorite: (id: string) => void;
}

const PromptLibrary: React.FC<PromptLibraryProps> = ({
  onViewPrompt,
  onUsePrompt,
  onToggleFavorite,
}) => {
  const { prompts, setFilter, isLoading } = usePromptStore();
  const { filteredPrompts, filters, activeTab, setActiveTab } = usePromptFilters();

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
          <span className="count">{prompts.filter((p) => p.isFavorite).length}</span>
        </button>
        <button
          className={`tab ${activeTab === 'nsfw' ? 'active' : ''}`}
          onClick={() => setActiveTab('nsfw')}
        >
          <Star size={16} /> NSFW
          <span className="count">{prompts.filter((p) => p.isNSFW).length}</span>
        </button>
      </div>

      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input
          className="search-input"
          placeholder="搜尋 prompts..."
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
        />
      </div>

      <div className="filters">
        <select
          className="filter-select"
          value={filters.category}
          onChange={(e) => setFilter('category', e.target.value)}
        >
          <option value="">所有分類</option>
          <option value="Coding">💻 Coding</option>
          <option value="Writing">✍️ Writing</option>
          <option value="Marketing">📈 Marketing</option>
          <option value="Image">🎨 Image</option>
          <option value="Research">🔬 Research</option>
          <option value="Productivity">⚡ Productivity</option>
          <option value="Creative">🎭 Creative</option>
          <option value="Business">💼 Business</option>
          <option value="Education">📚 Education</option>
          <option value="Entertainment">🎮 Entertainment</option>
          <option value="Roleplay">🎲 Roleplay</option>
          <option value="Adult">🔞 Adult</option>
          <option value="Other">📦 Other</option>
        </select>

        <select
          className="filter-select"
          value={filters.model}
          onChange={(e) => setFilter('model', e.target.value)}
        >
          <option value="">所有模型</option>
          <option value="ChatGPT">🟢 ChatGPT</option>
          <option value="Claude">🟣 Claude</option>
          <option value="Gemini">🔵 Gemini</option>
          <option value="Midjourney">🎨 Midjourney</option>
          <option value="Stable Diffusion">🖼️ Stable Diffusion</option>
          <option value="DALL-E">🌈 DALL-E</option>
        </select>

        <label className="filter-select" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={filters.showNSFW}
            onChange={(e) => setFilter('showNSFW', e.target.checked)}
          />
          顯示 NSFW
        </label>
      </div>

      {isLoading ? (
        <div className="prompt-grid">
          {[...Array(6)].map((_, i) => (
            <PromptCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredPrompts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <Sparkles size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <h3 style={{ marginBottom: '8px' }}>還沒有 Prompt</h3>
          <p>點擊右上角「新增 Prompt」開始建立您的收藏</p>
        </div>
      ) : (
        <div className="prompt-grid">
          {filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              searchTerm={filters.search}
              onView={() => onViewPrompt(prompt)}
              onUse={() => onUsePrompt(prompt)}
              onToggleFavorite={() => onToggleFavorite(prompt.id)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default PromptLibrary;
