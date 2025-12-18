import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import type { Collection } from '../../types';
import { generateId } from '../../utils/common';

interface CollectionModalProps {
  onClose: () => void;
  onSave: (collection: Collection) => void;
  existingCollection?: Collection;
}

const CollectionModal: React.FC<CollectionModalProps> = ({ onClose, onSave, existingCollection }) => {
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

export default CollectionModal;
