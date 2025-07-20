import React from 'react';
import { X, Moon, Sun } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, activeTab, onTabChange, tabs }) => {
  const [theme, setTheme] = React.useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // In a real app, this would update the global theme
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleTabClick = (tabKey) => {
    onTabChange(tabKey);
    // Close sidebar on mobile after selection
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">
            <h2>Navigation</h2>
            <button 
              className="sidebar-close"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X />
            </button>
          </div>
          <p className="sidebar-subtitle">Manage your health journey</p>
        </div>

        <nav className="sidebar-nav">
          {Object.entries(tabs).map(([key, tab]) => {
            const Icon = tab.icon;
            return (
              <button
                key={key}
                className={`nav-item ${activeTab === key ? 'active' : ''}`}
                onClick={() => handleTabClick(key)}
                data-color={tab.color}
              >
                <div className="nav-item-icon">
                  <Icon />
                </div>
                <div className="nav-item-content">
                  <span className="nav-item-label">{tab.label}</span>
                  <span className="nav-item-description">{tab.description}</span>
                </div>
                {activeTab === key && <div className="nav-item-indicator" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
          >
            <div className="theme-icon">
              {theme === 'light' ? <Moon /> : <Sun />}
            </div>
            <div className="theme-content">
              <span className="theme-label">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </span>
              <span className="theme-description">
                Switch to {theme === 'light' ? 'dark' : 'light'} theme
              </span>
            </div>
          </button>
          
          <div className="sidebar-info">
            <p className="app-version">BackPain Pro v2.1</p>
            <p className="app-status">✓ All systems operational</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;