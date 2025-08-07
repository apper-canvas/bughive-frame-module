import React, { useEffect, useState } from "react";
import { bugService } from "@/services/api/bugService";
import { userService } from "@/services/api/userService";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Reports from "@/components/pages/Reports";

const BugTable = ({ 
  searchTerm = "",
  statusFilter = "all",
  priorityFilter = "all",
  assigneeFilter = "all",
  severityFilter = "all",
  dateFilter = "all"
}) => {
  const [bugs, setBugs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

useEffect(() => {
    loadData();
  }, [searchTerm, statusFilter, priorityFilter, assigneeFilter, severityFilter, dateFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [bugsData, usersData] = await Promise.all([
        bugService.getAll(),
        userService.getAll()
      ]);

      setBugs(bugsData);
      setUsers(usersData);
    } catch (err) {
      setError("Failed to load bug data. Please try again.");
      console.error("Error loading data:", err);
    } finally {
setLoading(false);
    }
  };

  const isWithinDateRange = (updatedAt, days) => {
    const now = new Date();
    const updatedDate = new Date(updatedAt);
    const diffTime = Math.abs(now - updatedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
const getUserName = (userId) => {
    const user = users.find(u => u.Id === parseInt(userId));
    return user ? user.name : "Unknown User";
  };

  // Filter bugs based on search term
const filteredBugs = bugs.filter(bug => {
    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      const assigneeName = getUserName(bug.assigneeId).toLowerCase();
      const reporterName = getUserName(bug.reporterId).toLowerCase();
      
      const matchesSearch = (
        bug.title.toLowerCase().includes(searchLower) ||
        bug.description.toLowerCase().includes(searchLower) ||
        assigneeName.includes(searchLower) ||
        reporterName.includes(searchLower) ||
        bug.Id.toString().includes(searchLower)
      );
      
      if (!matchesSearch) return false;
    }

    // Status filter
    if (statusFilter !== "all" && bug.status !== statusFilter) {
      return false;
    }

    // Priority filter
    if (priorityFilter !== "all" && bug.priority !== priorityFilter) {
      return false;
    }

    // Assignee filter
    if (assigneeFilter !== "all" && bug.assigneeId !== assigneeFilter) {
      return false;
    }

    // Severity filter
    if (severityFilter !== "all" && bug.severity !== severityFilter) {
      return false;
    }

    // Date filter
    if (dateFilter !== "all") {
      const days = parseInt(dateFilter);
      if (!isWithinDateRange(bug.updatedAt, days)) {
        return false;
      }
    }

    return true;
  });

  const sortedBugs = [...filteredBugs].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "createdAt" || sortField === "updatedAt") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const totalBugs = bugs.length;
  const filteredCount = filteredBugs.length;

if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (bugs.length === 0) {
    return (
      <Empty
        title="No bugs found"
        description="No bug reports have been created yet. Create your first bug report to get started."
        icon="Bug"
      />
    );
  }

  if (filteredBugs.length === 0 && searchTerm.trim()) {
    return (
      <Empty
        title="No matching bugs found"
        description={`No bugs match your search for "${searchTerm}". Try adjusting your search terms.`}
        icon="Search"
      />
    );
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return "ArrowUpDown";
    return sortDirection === "asc" ? "ArrowUp" : "ArrowDown";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Results Header */}
      <div className="flex items-center justify-between mb-4 p-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-medium text-gray-900">Bug Reports</h3>
          <div className="text-sm text-gray-600">
            Showing {filteredCount} of {totalBugs} bugs
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {filteredCount !== totalBugs && (
            <span className="text-primary font-medium">
              {totalBugs - filteredCount} bugs filtered out
            </span>
          )}
        </div>
      </div>
<div className="overflow-x-auto">
        <table className="bug-table">
          <thead>
            <tr>
              <th 
                className="cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleSort("Id")}
              >
                <div className="flex items-center space-x-2">
                  <span>Bug ID</span>
                  <ApperIcon name={getSortIcon("Id")} className="h-3 w-3" />
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center space-x-2">
                  <span>Title</span>
                  <ApperIcon name={getSortIcon("title")} className="h-3 w-3" />
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center space-x-2">
                  <span>Status</span>
                  <ApperIcon name={getSortIcon("status")} className="h-3 w-3" />
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleSort("priority")}
              >
                <div className="flex items-center space-x-2">
                  <span>Priority</span>
                  <ApperIcon name={getSortIcon("priority")} className="h-3 w-3" />
                </div>
              </th>
              <th>Assignee</th>
              <th 
                className="cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center space-x-2">
                  <span>Created</span>
                  <ApperIcon name={getSortIcon("createdAt")} className="h-3 w-3" />
                </div>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedBugs.map((bug) => (
              <tr key={bug.Id} className="hover:bg-gray-50 transition-colors duration-200">
                <td>
                  <span className="font-mono text-sm font-medium">#{bug.Id}</span>
                </td>
                <td>
                  <div className="max-w-xs">
                    <p className="font-medium text-gray-900 truncate">{bug.title}</p>
                    <p className="text-sm text-gray-500 truncate">{bug.description}</p>
                  </div>
                </td>
                <td>
                  <StatusBadge status={bug.status} />
                </td>
                <td>
                  <PriorityBadge priority={bug.priority} />
                </td>
                <td>
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" className="h-3 w-3 text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-900">{getUserName(bug.assigneeId)}</span>
                  </div>
                </td>
                <td>
                  <span className="text-sm text-gray-500">
                    {format(new Date(bug.createdAt), "MMM dd, yyyy")}
                  </span>
                </td>
                <td>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                      <ApperIcon name="Eye" className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                      <ApperIcon name="Edit" className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BugTable;