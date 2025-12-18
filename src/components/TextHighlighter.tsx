import React from 'react';

interface TextHighlighterProps {
  text: string;
  highlight: string;
}

const TextHighlighter: React.FC<TextHighlighterProps> = ({ text, highlight }) => {
  if (!highlight.trim()) {
    return <>{text}</>;
  }

  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark
            key={i}
            style={{
              backgroundColor: 'rgba(99, 102, 241, 0.3)',
              color: 'var(--text-primary)',
              padding: '0 2px',
              borderRadius: '2px'
            }}
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

export default TextHighlighter;
