import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Activity, 
  TrendingUp, 
  Calendar, 
  Pill, 
  BookOpen,
  FileText,
  Settings,
  Sun,
  Moon,
  X,
  Menu
} from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange, isOpen = false, onToggle }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Load theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleNavClick = (tabId) => {
    onTabChange(tabId);
    // Sidebar will be closed by the main app on mobile
  };

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      description: 'Overview & insights'
    },
    {
      id: 'pain-tracking',
      label: 'Pain Tracking',
      icon: TrendingUp,
      description: 'Log & monitor pain levels'
    },
    {
      id: 'exercises',
      label: 'Exercises',
      icon: Activity,
      description: 'Guided routines & workouts'
    },
    {
      id: 'medications',
      label: 'Medications',
      icon: Pill,
      description: 'Track medication schedule'
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: Calendar,
      description: 'Manage healthcare visits'
    },
    {
      id: 'education',
      label: 'Education',
      icon: BookOpen,
      description: 'Learn pain management'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      description: 'Analytics & progress'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Customize your experience'
    }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h1>BackPain Pro</h1>
        <p>Professional Pain Management</p>
      </div>

      <nav className="sidebar-nav">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              className={isActive ? 'active' : ''}
              onClick={() => handleNavClick(item.id)}
              title={item.description}
              aria-label={`Navigate to ${item.label}`}
            >
              <IconComponent size={20} />
              <div className="nav-item-content">
                <span className="nav-item-label">{item.label}</span>
                <span className="nav-item-description">{item.description}</span>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          <span>
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;