import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { usePromptStore } from '../stores/promptStore';
import type { Prompt } from '../types';
import PromptCard from '../components/PromptCard';
import ViewEditPromptModal from '../components/modals/ViewEditPromptModal';
import UsePromptModal from '../components/modals/UsePromptModal';

const CollectionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { collections, prompts, toggleFavorite, updatePrompt, deletePrompt } = usePromptStore();

  const [viewPrompt, setViewPrompt] = useState<Prompt | null>(null);
  const [usePrompt, setUsePrompt] = useState<Prompt | null>(null);

  const collection = collections.find((c) => c.id === id);
  const collectionPrompts = prompts.filter((p) => collection?.promptIds.includes(p.id));

  if (!collection) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h3>找不到該收藏集</h3>
        <button className="btn btn-secondary" onClick={() => navigate('/collections')}>返回</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => navigate('/collections')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            cursor: 'pointer',
            padding: '4px 0',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          <ArrowLeft size={16} /> 返回收藏集列表
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <span style={{ fontSize: '48px' }}>{collection.icon}</span>
        <div>
          <h2 style={{ margin: 0 }}>{collection.name}</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>{collection.description}</p>
        </div>
      </div>

      {collectionPrompts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <Sparkles size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <h3 style={{ marginBottom: '8px' }}>收藏集是空的</h3>
          <p>在 Prompt 詳情頁中將其加入此收藏集</p>
        </div>
      ) : (
        <div className="prompt-grid">
          {collectionPrompts.map((prompt) => (
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

export default CollectionDetailsPage;
