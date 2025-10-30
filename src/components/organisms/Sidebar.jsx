import React, { useContext, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/layouts/Root";
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
  const DesktopSidebar = () => {
const { logout } = useAuth();
    
    return (
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
{/* Saved filters moved to AllBugs page */}

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
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="h-4 w-4 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">QA Team</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
<button
                onClick={() => {
                  logout();
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                title="Logout"
              >
                <ApperIcon name="LogOut" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  };

  // Saved Filters Component
/* SavedFilters component moved to AllBugs.jsx */

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

{/* Mobile saved filters - moved to AllBugs page */}

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