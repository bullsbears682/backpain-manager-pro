import React, { createContext, useContext, useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type,
      timestamp: Date.now()
    };

    setNotifications(prev => [...prev, notification]);

    // Auto remove notification
    setTimeout(() => {
      removeNotification(id);
    }, duration);

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ 
      showNotification, 
      removeNotification, 
      clearAll 
    }}>
      {children}
      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = ({ notifications, onRemove }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

const NotificationToast = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Enter animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(notification.id), 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle2 className="notification-icon" />;
      case 'error':
        return <AlertCircle className="notification-icon" />;
      case 'warning':
        return <AlertTriangle className="notification-icon" />;
      default:
        return <Info className="notification-icon" />;
    }
  };

  const getColorClass = () => {
    switch (notification.type) {
      case 'success':
        return 'notification-success';
      case 'error':
        return 'notification-error';
      case 'warning':
        return 'notification-warning';
      default:
        return 'notification-info';
    }
  };

  return (
    <div 
      className={`
        notification-toast 
        ${getColorClass()} 
        ${isVisible ? 'notification-visible' : ''} 
        ${isExiting ? 'notification-exiting' : ''}
      `}
    >
      <div className="notification-content">
        {getIcon()}
        <span className="notification-message">{notification.message}</span>
      </div>
      <button 
        className="notification-close"
        onClick={handleRemove}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};