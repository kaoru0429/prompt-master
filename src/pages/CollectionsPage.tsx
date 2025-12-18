import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderPlus, Folder, Trash2 } from 'lucide-react';
import { usePromptStore } from '../stores/promptStore';
import CollectionModal from '../components/modals/CollectionModal';

const CollectionsPage: React.FC = () => {
  const { collections, deleteCollection, addCollection } = usePromptStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>收藏集</h2>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
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
              onClick={() => navigate(`/collections/${collection.id}`)}
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

      {showAddModal && (
        <CollectionModal
          onClose={() => setShowAddModal(false)}
          onSave={addCollection}
        />
      )}
    </div>
  );
};

export default CollectionsPage;
