import React from 'react';
import { 
  Home, 
  Activity, 
  TrendingUp, 
  Calendar, 
  Pill, 
  BookOpen,
  FileText,
  Settings
} from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange }) => {
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
                >
                  <IconComponent className="icon" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;