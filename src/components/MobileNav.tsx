import React from 'react';
import { Menu, X } from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onToggle }) => {
  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={onToggle}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 60,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px',
          color: 'var(--text-primary)',
          cursor: 'pointer',
        }}
      >
        {isOpen ? <X size={20} color="#fafafa" /> : <Menu size={20} color="#fafafa" />}
      </button>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onToggle}
      />
    </>
  );
};

export default MobileNav;
