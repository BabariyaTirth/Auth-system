import React, { useEffect } from 'react';

const Notification = ({ show, message, type, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const getNotificationStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'info':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'success':
      default:
        return 'bg-green-50 text-green-700 border border-green-200';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'success':
      default:
        return '✅';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${getNotificationStyles()} rounded-lg shadow-lg p-4`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-lg">{getIcon()}</span>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
