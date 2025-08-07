import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import BugTable from "@/components/organisms/BugTable";
import BugCreateModal from "@/components/organisms/BugCreateModal";
import BugDetailModal from "@/components/organisms/BugDetailModal";
import Loading from "@/components/ui/Loading";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
// Saved Filters Component
const SavedFilters = () => {
  const [savedFilters, setSavedFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [filterToDelete, setFilterToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

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
    // Dispatch custom event to notify AllBugs component
    if (typeof window !== 'undefined' && window.CustomEvent && window.dispatchEvent) {
      try {
        const event = new window.CustomEvent('applySavedFilter', {
          detail: { filter }
        });
        window.dispatchEvent(event);
        setShowDropdown(false);
      } catch (error) {
        console.error('Failed to dispatch filter event:', error);
      }
    }
  };

  const handleEditFilter = (filter) => {
    // Dispatch edit event to AllBugs component
    if (typeof window !== 'undefined' && window.CustomEvent && window.dispatchEvent) {
      try {
        const event = new window.CustomEvent('editSavedFilter', {
          detail: { filter }
        });
        window.dispatchEvent(event);
        setShowDropdown(false);
      } catch (error) {
        console.error('Failed to dispatch edit filter event:', error);
      }
    }
  };

const handleDeleteFilter = async (filter) => {
    setIsDeleting(true);
    try {
      const { filterService } = await import('@/services/api/filterService');
      await filterService.deleteFilter(filter.Id);
      
      // Remove from local state
      setSavedFilters(prev => prev.filter(f => f.Id !== filter.Id));
      
      // Dispatch success event
      if (typeof window !== 'undefined' && window.CustomEvent && window.dispatchEvent) {
        try {
          const event = new window.CustomEvent('showToast', {
            detail: {
              type: 'success',
              message: `Filter "${filter.name}" deleted successfully`
            }
          });
          window.dispatchEvent(event);
        } catch (error) {
          console.error('Failed to dispatch toast event:', error);
        }
      }
    } catch (error) {
      console.error('Failed to delete filter:', error);
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
          console.error('Failed to dispatch error toast event:', eventError);
        }
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setFilterToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loading />
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center"
      >
        <ApperIcon name="Filter" className="h-4 w-4 mr-1" />
        Saved ({savedFilters.length})
        <ApperIcon name="ChevronDown" className="h-4 w-4 ml-1" />
      </Button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-80 overflow-y-auto">
          <div className="p-2">
            {savedFilters.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No saved filters yet
              </div>
            ) : (
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
                            handleEditFilter(filter);
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
                            setShowDropdown(false);
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
            )}
          </div>
        </div>
      )}

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
                onClick={() => handleDeleteFilter(filterToDelete)}
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

const AllBugs = () => {
  const [bugs, setBugs] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState("updated_at_c");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBug, setSelectedBug] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveFilterName, setSaveFilterName] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingFilter, setEditingFilter] = useState(null);
  const [editFilterName, setEditFilterName] = useState("");
  
// Helper functions
  const getUserName = (userId) => {
    const user = users.find(u => u.Id === parseInt(userId));
    if (!user) return "Unknown User";
    
    // Use database field names for user name
    const firstName = user.first_name_c || user.Name || "";
    const lastName = user.last_name_c || "";
    return firstName && lastName ? `${firstName} ${lastName}` : firstName || user.Name || "Unknown User";
  };

  const isWithinDateRange = (dateString, days) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
  };

  // Data loading effect
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Load bugs and users data here
        // This would typically come from your API service
        setBugs([]);
        setUsers([]);
      } catch (error) {
        console.error('Failed to load data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Listen for saved filter applications and edits from sidebar
  useEffect(() => {
    const handleApplySavedFilter = (event) => {
      const { filter } = event.detail;
      applyFilter(filter);
    };

    const handleEditSavedFilter = (event) => {
      const { filter } = event.detail;
      setEditingFilter(filter);
      setEditFilterName(filter.name);
      setShowEditDialog(true);
    };

    const handleToastNotification = (event) => {
      const { type, message } = event.detail;
      toast[type](message);
    };

    // Listen for filter refresh events
    const handleRefreshSavedFilters = () => {
      // This will be handled by the SavedFilters component
    };

    window.addEventListener('applySavedFilter', handleApplySavedFilter);
    window.addEventListener('editSavedFilter', handleEditSavedFilter);
    window.addEventListener('showToast', handleToastNotification);
    window.addEventListener('refreshSavedFilters', handleRefreshSavedFilters);
    
    return () => {
      window.removeEventListener('applySavedFilter', handleApplySavedFilter);
      window.removeEventListener('editSavedFilter', handleEditSavedFilter);
      window.removeEventListener('showToast', handleToastNotification);
      window.removeEventListener('refreshSavedFilters', handleRefreshSavedFilters);
    };
  }, []);

  // Filter and sort bugs
  const filteredBugs = bugs.filter(bug => {
    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      const assigneeName = getUserName(bug.assignee_id_c || bug.assigneeId).toLowerCase();
      const reporterName = getUserName(bug.reporter_id_c || bug.reporterId).toLowerCase();
      
      const matchesSearch = (
        (bug.title_c || bug.Name || bug.title || "").toLowerCase().includes(searchLower) ||
        (bug.description_c || bug.description || "").toLowerCase().includes(searchLower) ||
        assigneeName.includes(searchLower) ||
        reporterName.includes(searchLower) ||
        bug.Id.toString().includes(searchLower)
      );
      
      if (!matchesSearch) return false;
    }

    // Status filter
    if (statusFilter !== "all" && (bug.status_c || bug.status) !== statusFilter) {
      return false;
    }

    // Priority filter
    if (priorityFilter !== "all" && (bug.priority_c || bug.priority) !== priorityFilter) {
      return false;
    }

    // Assignee filter
    if (assigneeFilter !== "all" && (bug.assignee_id_c || bug.assigneeId) !== assigneeFilter) {
      return false;
    }

    // Severity filter
    if (severityFilter !== "all" && (bug.severity_c || bug.severity) !== severityFilter) {
      return false;
    }

    // Date filter
    if (dateFilter !== "all") {
      const days = parseInt(dateFilter);
      const dateToCheck = bug.updated_at_c || bug.updatedAt;
      if (!isWithinDateRange(dateToCheck, days)) {
        return false;
      }
    }

    return true;
  });

  // Sort filtered bugs
  const sortedBugs = [...filteredBugs].sort((a, b) => {
    let aValue, bValue;

    if (sortField === "createdAt" || sortField === "updatedAt" || sortField === "created_at_c" || sortField === "updated_at_c") {
      // Use database field names first, fallback to legacy
      const aDate = a.created_at_c || a.createdAt || a.updated_at_c || a.updatedAt;
      const bDate = b.created_at_c || b.createdAt || b.updated_at_c || b.updatedAt;
      
      aValue = aDate ? new Date(aDate) : new Date(0);
      bValue = bDate ? new Date(bDate) : new Date(0);
      
      // Handle invalid dates by treating them as very old dates for sorting
      if (isNaN(aValue.getTime())) aValue = new Date(0);
      if (isNaN(bValue.getTime())) bValue = new Date(0);
    } else {
      aValue = a[sortField] || "";
      bValue = b[sortField] || "";
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const applyFilter = (filter) => {
    const { filters } = filter;
    
    // Reset all filters first
    clearAllFilters();
    
    // Apply the saved filter
    if (filters.assigneeId) setAssigneeFilter(filters.assigneeId);
    if (filters.status) setStatusFilter(filters.status);
    if (filters.priority) setPriorityFilter(filters.priority);
    if (filters.severity) setSeverityFilter(filters.severity);
    if (filters.updatedWithin) setDateFilter(filters.updatedWithin.toString());
    
    toast.success(`Applied filter: ${filter.name}`);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== "all") count++;
    if (priorityFilter !== "all") count++;
    if (assigneeFilter !== "all") count++;
    if (severityFilter !== "all") count++;
    if (dateFilter !== "all") count++;
    return count;
  };

const clearAllFilters = async () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setAssigneeFilter("all");
    setSeverityFilter("all");
    setDateFilter("all");
    
    // Clear active filter from localStorage
    try {
      const { filterService } = await import('@/services/api/filterService');
      filterService.saveActiveFilter(null);
    } catch (error) {
      console.error('Failed to clear active filter:', error);
    }
  };

const handleSaveFilter = async () => {
    if (!saveFilterName.trim()) {
      toast.error("Please enter a name for the filter");
      return;
    }

    const activeFilters = {};
    if (searchTerm) activeFilters.searchTerm = searchTerm;
    if (statusFilter !== "all") activeFilters.status = statusFilter;
    if (priorityFilter !== "all") activeFilters.priority = priorityFilter;
    if (assigneeFilter !== "all") activeFilters.assigneeId = assigneeFilter;
    if (severityFilter !== "all") activeFilters.severity = severityFilter;
    if (dateFilter !== "all") activeFilters.updatedWithin = parseInt(dateFilter);

    try {
      const { filterService } = await import('@/services/api/filterService');
      await filterService.saveFilter(saveFilterName, activeFilters);
      toast.success(`Filter "${saveFilterName}" saved successfully`);
      setShowSaveDialog(false);
      setSaveFilterName("");
    } catch (error) {
      toast.error("Failed to save filter");
}
  };

  const handleUpdateFilter = async () => {
    if (!editFilterName.trim()) {
      toast.error("Please enter a name for the filter");
      return;
    }

    if (!editingFilter) return;

    try {
      const { filterService } = await import('@/services/api/filterService');
      
      // Delete the old filter and create a new one with updated name
      await filterService.deleteFilter(editingFilter.Id);
      
      // Create new filter with current form state
      const activeFilters = {};
      if (searchTerm) activeFilters.searchTerm = searchTerm;
      if (statusFilter !== "all") activeFilters.status = statusFilter;
      if (priorityFilter !== "all") activeFilters.priority = priorityFilter;
      if (assigneeFilter !== "all") activeFilters.assigneeId = assigneeFilter;
      if (severityFilter !== "all") activeFilters.severity = severityFilter;
      if (dateFilter !== "all") activeFilters.updatedWithin = parseInt(dateFilter);
      
      await filterService.saveFilter(editFilterName, activeFilters);
      
      toast.success(`Filter "${editFilterName}" updated successfully`);
      setShowEditDialog(false);
      setEditingFilter(null);
      setEditFilterName("");
      // Trigger sidebar refresh
      if (typeof window !== 'undefined' && window.CustomEvent) {
        window.dispatchEvent(new window.CustomEvent('refreshSavedFilters'));
      }
    } catch (error) {
      console.error('Failed to update filter:', error);
      toast.error("Failed to update filter");
    }
  };

  const activeFilterCount = getActiveFilterCount();
const handleBugClick = (bug) => {
    setSelectedBug(bug);
    setIsDetailModalOpen(true);
  };

  const handleBugUpdate = (updatedBug) => {
    // Handle bug update if needed
    toast.success('Bug updated successfully');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Bugs</h1>
          <p className="text-gray-600 mt-2">Manage and track all bug reports across your projects</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            icon="Plus"
          >
            New Bug Report
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="card">
        <div className="flex flex-col space-y-4">
          {/* Filter Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <ApperIcon name="Filter" className="h-5 w-5 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="primary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </h3>
<div className="flex items-center space-x-2">
              <SavedFilters />
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSaveDialog(true)}
                >
                  <ApperIcon name="Save" className="h-4 w-4 mr-1" />
                  Save
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                disabled={activeFilterCount === 0}
              >
                <ApperIcon name="X" className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ApperIcon name="Search" className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search bugs by title, description, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </Select>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">Priority</label>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Select>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">Assignee</label>
              <Select
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
              >
<option value="all">All Assignees</option>
                <option value="1">Sarah Chen</option>
                <option value="2">Michael Rodriguez</option>
                <option value="3">Emily Johnson</option>
                <option value="4">David Kim</option>
              </Select>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">Severity</label>
              <Select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                <option value="all">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="Major">Major</option>
                <option value="Medium">Medium</option>
                <option value="Minor">Minor</option>
              </Select>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">Updated</label>
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">Any Time</option>
                <option value="1">Last 24 hours</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </Select>
            </div>
          </div>

          {/* Active Filter Badges */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center">
                  Search: {searchTerm.slice(0, 20)}{searchTerm.length > 20 ? '...' : ''}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <ApperIcon name="X" className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="flex items-center">
                  Status: {statusFilter}
                  <button
                    onClick={() => setStatusFilter("all")}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <ApperIcon name="X" className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {priorityFilter !== "all" && (
                <Badge variant="secondary" className="flex items-center">
                  Priority: {priorityFilter}
                  <button
                    onClick={() => setPriorityFilter("all")}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <ApperIcon name="X" className="h-3 w-3" />
                  </button>
                </Badge>
              )}
{assigneeFilter !== "all" && (
                <Badge variant="secondary" className="flex items-center">
                  Assignee: {assigneeFilter === "1" ? "Sarah Chen" : assigneeFilter === "2" ? "Michael Rodriguez" : assigneeFilter === "3" ? "Emily Johnson" : "David Kim"}
                  <button
                    onClick={() => setAssigneeFilter("all")}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <ApperIcon name="X" className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {severityFilter !== "all" && (
                <Badge variant="secondary" className="flex items-center">
                  Severity: {severityFilter}
                  <button
                    onClick={() => setSeverityFilter("all")}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <ApperIcon name="X" className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {dateFilter !== "all" && (
                <Badge variant="secondary" className="flex items-center">
                  Updated: {dateFilter === "1" ? "24h" : dateFilter === "7" ? "7d" : dateFilter === "30" ? "30d" : "90d"}
                  <button
                    onClick={() => setDateFilter("all")}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <ApperIcon name="X" className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bug Table */}
{/* Bug Table */}
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loading />
        </div>
      ) : error ? (
        <div className="text-center p-8">
          <div className="text-red-600 mb-4">
            <ApperIcon name="AlertTriangle" className="h-12 w-12 mx-auto mb-2" />
            <p className="text-lg font-medium">Failed to load bugs</p>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      ) : (
        <BugTable 
          bugs={sortedBugs}
          users={users}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          assigneeFilter={assigneeFilter}
          severityFilter={severityFilter}
          dateFilter={dateFilter}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={(field) => {
            if (field === sortField) {
              setSortOrder(sortOrder === "asc" ? "desc" : "asc");
            } else {
              setSortField(field);
              setSortOrder("desc");
            }
          }}
          onBugClick={handleBugClick}
        />
      )}

      {/* Save Filter Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Save Filter</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter filter name..."
                  value={saveFilterName}
                  onChange={(e) => setSaveFilterName(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowSaveDialog(false);
                    setSaveFilterName("");
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveFilter}>
                  Save Filter
                </Button>
              </div>
            </div>
          </div>
        </div>
)}

      {/* Edit Filter Dialog */}
      {showEditDialog && editingFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Filter</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter filter name..."
                  value={editFilterName}
                  onChange={(e) => setEditFilterName(e.target.value)}
                />
              </div>
              <div className="text-sm text-gray-600">
                <p className="mb-2">This filter will be updated with your current filter settings:</p>
                <div className="space-y-1 text-xs">
                  {searchTerm && <div>• Search: {searchTerm}</div>}
                  {statusFilter !== "all" && <div>• Status: {statusFilter}</div>}
                  {priorityFilter !== "all" && <div>• Priority: {priorityFilter}</div>}
                  {assigneeFilter !== "all" && <div>• Assignee: {assigneeFilter}</div>}
                  {severityFilter !== "all" && <div>• Severity: {severityFilter}</div>}
                  {dateFilter !== "all" && <div>• Updated: Last {dateFilter} days</div>}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowEditDialog(false);
                    setEditingFilter(null);
                    setEditFilterName("");
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateFilter}>
                  Update Filter
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

{/* Create Bug Modal */}
      <BugCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Bug Detail Modal */}
      <BugDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedBug(null);
        }}
        bugId={selectedBug?.Id}
        onBugUpdate={handleBugUpdate}
      />
    </div>
  );
};

export default AllBugs;