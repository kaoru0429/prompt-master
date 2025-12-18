import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePromptStore } from '../stores/promptStore';

const TagsPage: React.FC = () => {
  const { prompts, setFilter } = usePromptStore();
  const navigate = useNavigate();

  const handleTagClick = (tag: string) => {
    setFilter('search', tag);
    navigate('/');
  };

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
        {sortedTags.length === 0 && (
          <p style={{ color: 'var(--text-muted)' }}>尚未建立任何標籤</p>
        )}
        {sortedTags.map(([tag, count]) => (
          <div
            key={tag}
            className="tag"
            onClick={() => handleTagClick(tag)}
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

export default TagsPage;
