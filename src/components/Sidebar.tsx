import { NavLink } from 'react-router-dom';
import {
  Sparkles, FolderOpen, Heart, Folder, TrendingUp, Tag, Settings
} from 'lucide-react';
import { usePromptStore } from '../stores/promptStore';

const Sidebar: React.FC = () => {
  const { prompts, sources, toggleSource, collections } = usePromptStore();
  const favorites = prompts.filter(p => p.isFavorite).length;

  return (
    <aside className="sidebar">
      <div className="logo">
        <Sparkles size={28} color="#6366f1" />
        <h2>Prompt Master</h2>
      </div>

      <nav className="nav-section">
        <div className="nav-section-title">主選單</div>
        <NavLink
          to="/"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <FolderOpen size={18} /> 所有 Prompts
          <span style={{ marginLeft: 'auto', opacity: 0.6 }}>{prompts.length}</span>
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Heart size={18} /> 收藏
          <span style={{ marginLeft: 'auto', opacity: 0.6 }}>{favorites}</span>
        </NavLink>
        <NavLink
          to="/collections"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Folder size={18} /> 收藏集
          <span style={{ marginLeft: 'auto', opacity: 0.6 }}>{collections.length}</span>
        </NavLink>
        <NavLink
          to="/trending"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <TrendingUp size={18} /> 熱門庫
        </NavLink>
        <NavLink
          to="/tags"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Tag size={18} /> 標籤瀏覽
        </NavLink>
      </nav>

      <nav className="nav-section">
        <div className="nav-section-title">Prompt 來源</div>
        {sources.map(source => (
          <div
            key={source.id}
            className="nav-item"
            onClick={() => toggleSource(source.id)}
            style={{ opacity: source.enabled ? 1 : 0.5 }}
          >
            <input
              type="checkbox"
              checked={source.enabled}
              onChange={() => toggleSource(source.id)}
              style={{ accentColor: '#6366f1' }}
            />
            {source.name}
            {source.isNSFW && <span className="tag nsfw" style={{ marginLeft: 'auto' }}>18+</span>}
          </div>
        ))}
      </nav>

      <nav className="nav-section">
        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Settings size={18} /> 設定
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
