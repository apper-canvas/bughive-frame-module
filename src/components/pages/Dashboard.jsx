import { useState, useEffect } from "react";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import StatusBadge from "@/components/molecules/StatusBadge";
import { bugService } from "@/services/api/bugService";
import { userService } from "@/services/api/userService";
import { format, isToday, isThisWeek } from "date-fns";

const Dashboard = () => {
  const [bugs, setBugs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

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
      setError("Failed to load dashboard data. Please try again.");
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="space-y-6">
      <Loading type="cards" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Loading />
        <Loading />
      </div>
    </div>
  );

  if (error) return <Error message={error} onRetry={loadData} />;

  // Calculate metrics
  const totalBugs = bugs.length;
  const openBugs = bugs.filter(bug => bug.status === "Open").length;
  const criticalBugs = bugs.filter(bug => bug.priority === "Critical").length;
  const resolvedThisWeek = bugs.filter(bug => 
    bug.status === "Resolved" && isThisWeek(new Date(bug.updatedAt))
  ).length;

  // Recent activity - bugs created or updated recently
  const recentActivity = bugs
    .filter(bug => 
      isToday(new Date(bug.createdAt)) || 
      isToday(new Date(bug.updatedAt))
    )
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 8);

  const getUserName = (userId) => {
    const user = users.find(u => u.Id === parseInt(userId));
    return user ? user.name : "Unknown User";
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-lg text-gray-600 mt-2">
          Welcome back! Here's what's happening with your projects.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Total Bugs"
          value={totalBugs.toLocaleString()}
          change={"+12%"}
          changeType="neutral"
          icon="Bug"
        />
        <MetricCard
          title="Open Bugs"
          value={openBugs.toLocaleString()}
          change="-8%"
          changeType="positive"
          icon="AlertCircle"
        />
        <MetricCard
          title="Critical Issues"
          value={criticalBugs.toLocaleString()}
          change={"+3%"}
          changeType="negative"
          icon="AlertTriangle"
        />
        <MetricCard
          title="Resolved This Week"
          value={resolvedThisWeek.toLocaleString()}
          change="+23%"
          changeType="positive"
          icon="CheckCircle"
        />
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <ApperIcon name="Activity" className="h-5 w-5 text-gray-400" />
          </div>

          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((bug) => (
                <div key={bug.Id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <ApperIcon name="Bug" className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      #{bug.Id} - {bug.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <StatusBadge status={bug.status} />
                      <PriorityBadge priority={bug.priority} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {getUserName(bug.assigneeId)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {format(new Date(bug.updatedAt), "MMM dd")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="Clock" className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No recent activity today</p>
            </div>
          )}
        </div>

        {/* Priority Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Priority Distribution</h3>
            <ApperIcon name="PieChart" className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {["Critical", "High", "Medium", "Low"].map((priority) => {
              const count = bugs.filter(bug => bug.priority === priority).length;
              const percentage = totalBugs > 0 ? Math.round((count / totalBugs) * 100) : 0;
              
              return (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <PriorityBadge priority={priority} />
                    <span className="text-sm text-gray-600">{count} bugs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          priority === "Critical" ? "bg-red-500" :
                          priority === "High" ? "bg-orange-500" :
                          priority === "Medium" ? "bg-yellow-500" : "bg-green-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200 group">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <ApperIcon name="Plus" className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 group-hover:text-blue-700">Create Bug Report</h4>
                <p className="text-sm text-gray-600">Report a new issue</p>
              </div>
            </div>
          </button>

          <button className="p-4 text-left bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-200 group">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <ApperIcon name="BarChart3" className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 group-hover:text-green-700">View Analytics</h4>
                <p className="text-sm text-gray-600">Track project progress</p>
              </div>
            </div>
          </button>

          <button className="p-4 text-left bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-200 group">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <ApperIcon name="FileText" className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 group-hover:text-purple-700">Generate Report</h4>
                <p className="text-sm text-gray-600">Export bug data</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;