import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import BugTable from "@/components/organisms/BugTable";
import BugCreateModal from "@/components/organisms/BugCreateModal";

const AllBugs = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

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

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
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

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Status:</label>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="min-w-[120px]"
              >
                <option value="all">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Priority:</label>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="min-w-[120px]"
              >
                <option value="all">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Select>
            </div>

            <Button variant="ghost" size="sm">
              <ApperIcon name="Filter" className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {(statusFilter !== "all" || priorityFilter !== "all" || searchTerm) && (
          <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: {searchTerm}
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <ApperIcon name="X" className="h-3 w-3" />
                </button>
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Status: {statusFilter}
                <button
                  onClick={() => setStatusFilter("all")}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <ApperIcon name="X" className="h-3 w-3" />
                </button>
              </span>
            )}
            {priorityFilter !== "all" && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Priority: {priorityFilter}
                <button
                  onClick={() => setPriorityFilter("all")}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  <ApperIcon name="X" className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bug Table */}
      <BugTable />

      {/* Create Bug Modal */}
      <BugCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default AllBugs;