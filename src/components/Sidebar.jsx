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
  Moon
} from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange }) => {
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

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'pain-tracking', label: 'Pain Tracking', icon: Activity },
    { id: 'exercises', label: 'Exercises', icon: TrendingUp },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'education', label: 'Education', icon: BookOpen },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>BackPain Manager Pro</h1>
        <p>Professional Pain Management System</p>
      </div>
      
      <nav>
        <ul className="sidebar-nav">
          {navigationItems.map(item => {
            const IconComponent = item.icon;
            return (
              <li key={item.id}>
                <button
                  className={activeTab === item.id ? 'active' : ''}
                  onClick={() => onTabChange(item.id)}
                  aria-label={item.label}
                  aria-current={activeTab === item.id ? 'page' : undefined}
                  title={item.label}
                >
                  <IconComponent className="icon" />
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <button 
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <>
            <Moon size={18} />
            Dark Mode
          </>
        ) : (
          <>
            <Sun size={18} />
            Light Mode
          </>
        )}
      </button>
    </div>
  );
};

export default Sidebar;