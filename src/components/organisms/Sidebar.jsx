import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: "LayoutDashboard",
      description: "Overview and metrics"
    },
    {
      name: "All Bugs",
      href: "/bugs",
      icon: "Bug",
      description: "Complete bug list"
    },
    {
      name: "Projects",
      href: "/projects",
      icon: "FolderOpen",
      description: "Project management"
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: "BarChart3",
      description: "Data insights"
    },
    {
      name: "Reports",
      href: "/reports",
      icon: "FileText",
      description: "Generate reports"
    }
  ];

  // Desktop sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-60">
        <div className="flex flex-col h-screen bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-primary rounded-lg">
                <ApperIcon name="Bug" className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">BugHive</h1>
                <p className="text-sm text-gray-500">Bug Tracker</p>
              </div>
            </div>
          </div>
{/* Saved Filters - only show on bugs page */}
          {location.pathname === '/bugs' && (
            <div className="px-4 py-4 border-b border-gray-200">
              <SavedFilters />
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 custom-scrollbar overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href || 
                             (item.href !== "/" && location.pathname.startsWith(item.href));
              
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                  )}
                >
                  <ApperIcon 
                    name={item.icon} 
                    className={cn(
                      "h-5 w-5 mr-3",
                      isActive ? "text-white" : "text-gray-400 group-hover:text-primary"
                    )} 
                  />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className={cn(
                      "text-xs mt-0.5",
                      isActive ? "text-blue-100" : "text-gray-500"
                    )}>
                      {item.description}
                    </div>
                  </div>
                </NavLink>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center px-4 py-2">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="h-4 w-4 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">QA Team</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
</div>
        </div>
      </div>
    </div>
  );

  // Saved Filters Component
const SavedFilters = () => {
    const [savedFilters, setSavedFilters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [filterToDelete, setFilterToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

useEffect(() => {
      loadSavedFilters();
    }, []);

    const loadSavedFilters = async () => {
      try {
        const { filterService } = await import('@/services/api/filterService');
        const filters = await filterService.getAllFilters();
        setSavedFilters(filters);
      } catch (error) {
        console.error('Failed to load saved filters:', error);
      } finally {
        setIsLoading(false);
      }
    };
const applyFilter = (filter) => {
      // Dispatch custom event to notify AllBugs page
      if (typeof window !== 'undefined' && window.CustomEvent && window.dispatchEvent) {
        try {
          const event = new window.CustomEvent('applySavedFilter', {
            detail: { filter }
          });
          window.dispatchEvent(event);
        } catch (error) {
          console.error('Failed to dispatch filter event:', error);
        }
      }
    };
    if (isLoading) {
      return (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      );
    }

    return (
<div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Saved Filters
        </h3>
        <div className="space-y-1">
          {savedFilters.map((filter) => (
            <div key={filter.Id} className="group relative">
              <button
                onClick={() => applyFilter(filter)}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary rounded-lg transition-all duration-200 group-hover:pr-16"
              >
                <ApperIcon 
                  name={filter.icon} 
                  className="h-4 w-4 mr-2 text-gray-400 group-hover:text-primary" 
                />
                <span className="truncate">{filter.name}</span>
                {filter.type === 'custom' && (
                  <ApperIcon 
                    name="Star" 
                    className="h-3 w-3 ml-auto text-yellow-500" 
                  />
                )}
              </button>
              
              {/* Edit/Delete buttons for custom filters */}
              {filter.type === 'custom' && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-1">
<button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Dispatch edit event to AllBugs component
                      if (typeof window !== 'undefined' && window.CustomEvent && window.dispatchEvent) {
                        try {
                          const event = new window.CustomEvent('editSavedFilter', {
                            detail: { filter }
                          });
                          window.dispatchEvent(event);
                        } catch (error) {
                          console.error('Failed to dispatch edit filter event:', error);
                        }
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600 rounded"
                    title="Edit filter"
                  >
                    <ApperIcon name="Edit" className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilterToDelete(filter);
                      setShowDeleteConfirm(true);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                    title="Delete filter"
                  >
                    <ApperIcon name="Trash2" className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && filterToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
              <div className="flex items-center mb-4">
                <ApperIcon name="AlertTriangle" className="h-6 w-6 text-red-600 mr-3" />
                <h3 className="text-lg font-medium text-gray-900">Delete Filter</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the filter "{filterToDelete.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setFilterToDelete(null);
                  }}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setIsDeleting(true);
                    try {
                      const { filterService } = await import('@/services/api/filterService');
                      await filterService.deleteFilter(filterToDelete.Id);
                      
                      // Refresh the filters list
await loadSavedFilters();
                      
                      // Show success notification
                      if (typeof window !== 'undefined' && window.CustomEvent && window.dispatchEvent) {
                        try {
                          const event = new window.CustomEvent('showToast', {
                            detail: { 
                              type: 'success', 
                              message: `Filter "${filterToDelete.name}" deleted successfully` 
                            }
                          });
                          window.dispatchEvent(event);
                        } catch (error) {
                          console.error('Failed to dispatch success toast:', error);
                        }
                      }
                      setShowDeleteConfirm(false);
                      setFilterToDelete(null);
} catch (error) {
                      if (typeof window !== 'undefined' && window.CustomEvent && window.dispatchEvent) {
                        try {
                          const event = new window.CustomEvent('showToast', {
                            detail: { 
                              type: 'error', 
                              message: 'Failed to delete filter' 
                            }
                          });
                          window.dispatchEvent(event);
                        } catch (eventError) {
                          console.error('Failed to dispatch error toast:', eventError);
                        }
                      }
                      console.error('Failed to delete filter:', error);
                    } finally {
                      setIsDeleting(false);
                    }
                  }}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
                >
                  {isDeleting && <ApperIcon name="Loader2" className="animate-spin h-4 w-4 mr-2" />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Mobile sidebar
  const MobileSidebar = () => (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Mobile header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-primary rounded-lg">
                <ApperIcon name="Bug" className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-bold text-gray-900">BugHive</h1>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile saved filters */}
          {location.pathname === '/bugs' && (
            <div className="px-4 py-4 border-b border-gray-200">
              <SavedFilters />
            </div>
          )}

          {/* Mobile navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 custom-scrollbar overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href || 
                             (item.href !== "/" && location.pathname.startsWith(item.href));
              
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onToggle}
                  className={cn(
                    "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                  )}
                >
                  <ApperIcon 
                    name={item.icon} 
                    className={cn(
                      "h-5 w-5 mr-3",
                      isActive ? "text-white" : "text-gray-400"
                    )} 
                  />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;