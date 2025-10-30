import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import { notificationService } from '@/services/api/notificationService';
import { toast } from 'react-toastify';

const NotificationPanel = ({ isOpen, onClose, onUpdate }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.Name).length;

  const handleMarkAsRead = async (id) => {
    const success = await notificationService.markAsRead(id);
    if (success) {
      setNotifications(prev => 
        prev.map(n => n.Id === id ? { ...n, Name: "Read" } : n)
      );
      onUpdate?.();
      toast.success("Notification marked as read");
    } else {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    const success = await notificationService.markAllAsRead();
    if (success) {
      setNotifications(prev => 
        prev.map(n => ({ ...n, Name: "Read" }))
      );
      onUpdate?.();
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all notifications?")) {
      return;
    }
    
    const success = await notificationService.deleteAll();
    if (success) {
      setNotifications([]);
      onUpdate?.();
    }
  };

  const handleDelete = async (id) => {
    const success = await notificationService.delete(id);
    if (success) {
      setNotifications(prev => prev.filter(n => n.Id !== id));
      onUpdate?.();
      toast.success("Notification deleted");
    } else {
      toast.error("Failed to delete notification");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Notification Panel */}
      <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500">{unreadCount} unread</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ApperIcon name="Bell" size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-center">No notifications yet</p>
              <p className="text-gray-400 text-sm text-center mt-1">
                You'll see bug status changes here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map(notification => (
                <div
                  key={notification.Id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.Name ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <ApperIcon 
                          name="Bug" 
                          size={16} 
                          className="text-gray-500 flex-shrink-0" 
                        />
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {notification.bug_id_c?.title_c || 'Bug'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                          {notification.old_status_c}
                        </span>
                        <ApperIcon name="ArrowRight" size={12} />
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                          {notification.new_status_c}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.CreatedOn ? 
                          format(new Date(notification.CreatedOn), 'MMM d, yyyy h:mm a') 
                          : 'Just now'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notification.Name && (
                        <button
                          onClick={() => handleMarkAsRead(notification.Id)}
                          className="p-1 text-gray-400 hover:text-primary rounded-md hover:bg-gray-100"
                          title="Mark as read"
                        >
                          <ApperIcon name="Check" size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.Id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100"
                        title="Delete"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-200 flex items-center justify-between gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                Mark all as read
              </button>
            )}
            <button
              onClick={handleClearAll}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium ml-auto"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationPanel;