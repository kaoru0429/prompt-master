import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

const Layout: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="app-container">
      <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <Sidebar onMobileItemClick={() => setIsMobileMenuOpen(false)} />
      </div>
      <MobileNav
        isOpen={isMobileMenuOpen}
        onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      <main className="main-content">
        <div key={location.pathname} className="page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
