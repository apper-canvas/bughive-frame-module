import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { projectService } from "@/services/api/projectService";
import { bugService } from "@/services/api/bugService";
import { userService } from "@/services/api/userService";

const Projects = () => {
  const [projects, setProjects] = useState([]);
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

      const [projectsData, bugsData, usersData] = await Promise.all([
        projectService.getAll(),
        bugService.getAll(),
        userService.getAll()
      ]);

      setProjects(projectsData);
      setBugs(bugsData);
      setUsers(usersData);
    } catch (err) {
      setError("Failed to load project data. Please try again.");
      console.error("Error loading project data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getProjectStats = (projectId) => {
    const projectBugs = bugs.filter(bug => bug.projectId === projectId.toString());
    const openBugs = projectBugs.filter(bug => bug.status === "Open").length;
    const criticalBugs = projectBugs.filter(bug => bug.priority === "Critical").length;
    const resolvedBugs = projectBugs.filter(bug => bug.status === "Resolved").length;
    
    return {
      total: projectBugs.length,
      open: openBugs,
      critical: criticalBugs,
      resolved: resolvedBugs,
      progress: projectBugs.length > 0 ? Math.round((resolvedBugs / projectBugs.length) * 100) : 0
    };
  };

  const getProjectLead = (leadId) => {
    const lead = users.find(user => user.Id === parseInt(leadId));
    return lead ? lead.name : "Unknown";
  };

  if (loading) return <Loading type="projects" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (projects.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-2">Organize and manage your development projects</p>
          </div>
          <Button icon="Plus">
            New Project
          </Button>
        </div>

        <Empty
          title="No projects found"
          description="Create your first project to start organizing bug reports and tracking progress."
          icon="FolderOpen"
          action={
            <Button icon="Plus">
              Create Project
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-2">
            Manage {projects.length} active projects and track their bug resolution progress
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Button variant="secondary" icon="Download">
            Export
          </Button>
          <Button icon="Plus">
            New Project
          </Button>
        </div>
      </div>

      {/* Project Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{projects.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ApperIcon name="FolderOpen" className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {projects.filter(p => p.status === "Active").length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <ApperIcon name="Play" className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bugs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{bugs.length}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <ApperIcon name="Bug" className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Resolution</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">73%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <ApperIcon name="TrendingUp" className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const stats = getProjectStats(project.Id);
          
          return (
            <div key={project.Id} className="card hover:shadow-md transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {project.description}
                  </p>
                </div>
                <Badge 
                  variant={project.status === "Active" ? "success" : "default"}
                  className="ml-3"
                >
                  {project.status}
                </Badge>
              </div>

              {/* Project Lead */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="h-3 w-3 text-gray-500" />
                </div>
                <span className="text-sm text-gray-600">
                  Led by {getProjectLead(project.leadId)}
                </span>
              </div>

              {/* Bug Statistics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">{stats.progress}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.progress}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
                    <p className="text-xs text-gray-500">Total Bugs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-green-600">{stats.resolved}</p>
                    <p className="text-xs text-gray-500">Resolved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-blue-600">{stats.open}</p>
                    <p className="text-xs text-gray-500">Open</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-red-600">{stats.critical}</p>
                    <p className="text-xs text-gray-500">Critical</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary transition-colors duration-200">
                  <ApperIcon name="Eye" className="h-4 w-4" />
                  <span>View Details</span>
                </button>
                <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary transition-colors duration-200">
                  <ApperIcon name="Settings" className="h-4 w-4" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;