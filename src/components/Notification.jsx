import React, { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';

// Notification Context
const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

// Notification Provider
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type,
      duration,
      timestamp: new Date()
    };

    setNotifications(prev => [...prev, notification]);

    // Auto remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Convenience methods
  const showSuccess = (message, duration) => addNotification(message, 'success', duration);
  const showError = (message, duration) => addNotification(message, 'error', duration);
  const showWarning = (message, duration) => addNotification(message, 'warning', duration);
  const showInfo = (message, duration) => addNotification(message, 'info', duration);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Individual Notification Component
const NotificationItem = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(notification.id), 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
      default:
        return <Info size={20} />;
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case 'success':
        return {
          bg: '#10b981',
          border: '#059669',
          text: '#ffffff'
        };
      case 'error':
        return {
          bg: '#ef4444',
          border: '#dc2626',
          text: '#ffffff'
        };
      case 'warning':
        return {
          bg: '#f59e0b',
          border: '#d97706',
          text: '#ffffff'
        };
      case 'info':
      default:
        return {
          bg: '#6366f1',
          border: '#4f46e5',
          text: '#ffffff'
        };
    }
  };

  const colors = getColors();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '1rem 1.25rem',
        backgroundColor: colors.bg,
        color: colors.text,
        borderRadius: 'var(--border-radius-md)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        border: `1px solid ${colors.border}`,
        minWidth: '300px',
        maxWidth: '500px',
        position: 'relative',
        overflow: 'hidden',
        transform: isRemoving 
          ? 'translateX(100%) scale(0.8)' 
          : isVisible 
            ? 'translateX(0) scale(1)' 
            : 'translateX(100%) scale(0.8)',
        opacity: isRemoving ? 0 : isVisible ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Progress bar for auto-dismiss */}
      {notification.duration > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '3px',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            width: '100%',
            animation: `progress ${notification.duration}ms linear forwards`
          }}
        />
      )}

      {/* Icon */}
      <div style={{
        flexShrink: 0,
        marginTop: '0.125rem'
      }}>
        {getIcon()}
      </div>

      {/* Message */}
      <div style={{
        flex: 1,
        fontSize: '0.875rem',
        fontWeight: '500',
        lineHeight: 1.5,
        wordBreak: 'break-word'
      }}>
        {notification.message}
      </div>

      {/* Close button */}
      <button
        onClick={handleRemove}
        style={{
          flexShrink: 0,
          backgroundColor: 'transparent',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          padding: '0.25rem',
          borderRadius: '0.25rem',
          transition: 'background-color 0.2s ease',
          marginTop: '-0.125rem'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
        }}
      >
        <X size={18} />
      </button>

      {/* CSS for progress bar animation */}
      <style jsx>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

// Notification Container
const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        pointerEvents: 'none'
      }}
    >
      {notifications.map(notification => (
        <div key={notification.id} style={{ pointerEvents: 'auto' }}>
          <NotificationItem
            notification={notification}
            onRemove={removeNotification}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationItem;