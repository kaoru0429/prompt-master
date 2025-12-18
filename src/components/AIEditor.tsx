import React, { useState, useEffect, useRef } from 'react';
import { getInlineSuggestion, executeAICommand } from '../services/gemini';
import { toast } from 'sonner';

interface AIEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

const COMMANDS = [
  { id: 'improve', label: '優化語句', icon: '✨', description: '讓文字更通順專業' },
  { id: 'expand', label: '擴充內容', icon: '📝', description: '增加細節與說明' },
  { id: 'simplify', label: '簡化表達', icon: '📉', description: '使其更易懂' },
  { id: 'translate', label: '翻譯成中文', icon: '🌐', description: '中英互譯' },
];

const AIEditor: React.FC<AIEditorProps> = ({
  value,
  onChange,
  placeholder = '輸入 Prompt...',
  minHeight = '200px',
  className
}) => {
  const [suggestion, setSuggestion] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const commandMenuRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-complete logic
  useEffect(() => {
    if (!value || showCommands) {
      setSuggestion('');
      return;
    }

    const lastChar = value.slice(-1);
    if ([' ', '\n', '.', '，', '。'].includes(lastChar)) {
      // Clear previous timer
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      // Debounce API call
      debounceTimer.current = setTimeout(async () => {
        try {
          // Only fetch if cursor is at the end (simple implementation)
          if (textareaRef.current?.selectionStart === value.length) {
            const suggestionText = await getInlineSuggestion(value, '');
            if (suggestionText) setSuggestion(suggestionText);
          }
        } catch (e) {
          console.error(e);
        }
      }, 1000);
    } else {
      setSuggestion('');
    }

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [value, showCommands]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab to accept suggestion
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      onChange(value + suggestion);
      setSuggestion('');
      return;
    }

    // Escape to close menu
    if (e.key === 'Escape') {
      setShowCommands(false);
      setSuggestion('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Check for slash command
    const lastChar = newValue.slice(-1);
    if (lastChar === '/') {
      setShowCommands(true);
    } else if (!newValue.includes('/')) {
      setShowCommands(false);
    }
  };

  const handleCommand = async (commandId: string) => {
    setShowCommands(false);
    setLoading(true);
    toast.loading('AI 正在思考...', { id: 'ai-command' });

    try {
      const result = await executeAICommand(commandId, value, value);

      // Replace content or append? "Improve" usually replaces fully or appends.
      // Let's replace providing it's a full rewrite, or we can offer a diff view.
      // For simplicity in Phase 3, we update the content.
      onChange(result);
      toast.success('AI 處理完成', { id: 'ai-command' });
    } catch (error) {
      console.error(error);
      toast.error('AI 處理失敗', { id: 'ai-command' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`ai-editor-container ${className || ''}`} style={{ position: 'relative' }}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="form-textarea"
        style={{
          minHeight,
          background: 'var(--bg-card)',
          position: 'relative',
          zIndex: 10
        }}
        disabled={loading}
      />

      {/* Ghost text overlay (Simplified: display below or inline logic is hard with textarea) */}
      {/* We will just use a helper text below for now, or finding a way to overlay is complex without contenteditable */}
      {suggestion && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          background: 'var(--bg-elevated)',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          color: 'var(--text-muted)',
          zIndex: 20,
          pointerEvents: 'none',
          border: '1px solid var(--border)'
        }}>
          Tab 鍵接受建議：<span style={{ color: 'var(--primary)' }}>{suggestion.slice(0, 20)}...</span>
        </div>
      )}

      {/* Command Menu */}
      {showCommands && (
        <div
          ref={commandMenuRef}
          className="command-menu"
          style={{
            position: 'absolute',
            bottom: '20px', // Naive positioning
            left: '20px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 50,
            width: '240px',
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)', fontSize: '12px', color: 'var(--text-muted)' }}>
            AI 指令
          </div>
          {COMMANDS.map(cmd => (
            <div
              key={cmd.id}
              onClick={() => handleCommand(cmd.id)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: 'var(--text-primary)',
                transition: 'background 0.1s'
              }}
              className="command-item"
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span>{cmd.icon}</span>
              <div style={{ flex: 1 }}>
                <div>{cmd.label}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{cmd.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIEditor;
