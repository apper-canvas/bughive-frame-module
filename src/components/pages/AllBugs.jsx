import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import BugTable from "@/components/organisms/BugTable";
import BugCreateModal from "@/components/organisms/BugCreateModal";
import { toast } from 'react-toastify';

const AllBugs = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveFilterName, setSaveFilterName] = useState("");

  // Listen for saved filter applications from sidebar
  useEffect(() => {
    const handleApplySavedFilter = (event) => {
      const { filter } = event.detail;
      applyFilter(filter);
    };

    window.addEventListener('applySavedFilter', handleApplySavedFilter);
    return () => window.removeEventListener('applySavedFilter', handleApplySavedFilter);
  }, []);

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

  const activeFilterCount = getActiveFilterCount();
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
                  Assignee: {assigneeFilter === "1" ? "Sarah" : assigneeFilter === "2" ? "Michael" : assigneeFilter === "3" ? "Emily" : "David"}
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
      <BugTable 
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        assigneeFilter={assigneeFilter}
        severityFilter={severityFilter}
        dateFilter={dateFilter}
      />

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

      {/* Create Bug Modal */}
      <BugCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default AllBugs;