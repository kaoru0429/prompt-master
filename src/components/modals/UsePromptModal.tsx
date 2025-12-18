import React, { useState } from 'react';
import { X, Check, Copy } from 'lucide-react';
import type { Prompt } from '../../types';
import { replaceVariables } from '../../utils/variableUtils';
import { useClipboard } from '../../hooks/useClipboard';

interface UsePromptModalProps {
  prompt: Prompt;
  onClose: () => void;
}

const UsePromptModal: React.FC<UsePromptModalProps> = ({ prompt, onClose }) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const { copied, copyToClipboard } = useClipboard();

  const finalPrompt = replaceVariables(prompt.content, values);

  const handleCopy = () => {
    copyToClipboard(finalPrompt);
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

                  {variable.type === 'select' && variable.options ? (
                    <select
                      className="form-input"
                      value={values[variable.name] || ''}
                      onChange={e => setValues({ ...values, [variable.name]: e.target.value })}
                    >
                      <option value="">選擇 {variable.name}...</option>
                      {variable.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : variable.type === 'textarea' ? (
                    <textarea
                      className="form-textarea"
                      value={values[variable.name] || ''}
                      onChange={e => setValues({ ...values, [variable.name]: e.target.value })}
                      placeholder={variable.description}
                      style={{ minHeight: '80px' }}
                    />
                  ) : (
                    <input
                      className="form-input"
                      type={variable.type === 'number' ? 'number' : 'text'}
                      value={values[variable.name] || ''}
                      onChange={e => setValues({ ...values, [variable.name]: e.target.value })}
                      placeholder={variable.description}
                    />
                  )}

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

export default UsePromptModal;
