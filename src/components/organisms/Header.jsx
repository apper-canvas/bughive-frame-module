import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import BugCreateModal from "@/components/organisms/BugCreateModal";
import NotificationPanel from "@/components/organisms/NotificationPanel";
import Button from "@/components/atoms/Button";
import { useAuth } from "@/layouts/Root";
import { notificationService } from "@/services/api/notificationService";

const Header = ({ onMenuClick }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { logout } = useAuth();

  useEffect(() => {
    loadUnreadCount();
    
    // Refresh unread count every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    const count = await notificationService.getUnreadCount();
    setUnreadCount(count);
  };
  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 lg:px-6 py-4">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={onMenuClick}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <ApperIcon name="Menu" className="h-6 w-6" />
            </button>
            <div className="ml-3 flex items-center">
              <div className="p-1.5 bg-primary rounded-md">
                <ApperIcon name="Bug" className="h-5 w-5 text-white" />
              </div>
              <h1 className="ml-2 text-lg font-bold text-gray-900">BugHive</h1>
            </div>
          </div>

          {/* Desktop title - hidden on mobile */}
          <div className="hidden lg:block">
            <h2 className="text-xl font-semibold text-gray-900">Bug Tracking Dashboard</h2>
            <p className="text-sm text-gray-500 mt-0.5">Manage and track software issues efficiently</p>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              icon="Plus"
              className="shadow-sm"
            >
              New Bug
            </Button>
<div className="hidden sm:flex items-center space-x-3">
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 relative"
                >
                  <ApperIcon name="Bell" className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full min-w-[18px]">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
                
                <NotificationPanel 
                  isOpen={isNotificationPanelOpen}
                  onClose={() => setIsNotificationPanelOpen(false)}
                  onUpdate={loadUnreadCount}
                />
              </div>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200">
                <ApperIcon name="Settings" className="h-5 w-5" />
              </button>
            </div>
            
<div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="h-4 w-4 text-white" />
              </div>
              <button
onClick={() => {
                  logout();
                }}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <BugCreateModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};

export default Header;