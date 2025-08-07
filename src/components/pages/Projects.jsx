import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { projectService } from "@/services/api/projectService";
import { bugService } from "@/services/api/bugService";
import { userService } from "@/services/api/userService";
import ApperIcon from "@/components/ApperIcon";
import MetricCard from "@/components/molecules/MetricCard";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Textarea from "@/components/atoms/Textarea";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

// Project Creation Modal Component
const ProjectCreateModal = ({ isOpen, onClose, onProjectCreated, users }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    leadId: '',
    teamMembers: [],
    status: 'Active',
    bugPriorityDefault: 'Medium',
    environments: ['Development', 'Staging', 'Production']
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      leadId: '',
      teamMembers: [],
      status: 'Active',
      bugPriorityDefault: 'Medium',
      environments: ['Development', 'Staging', 'Production']
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.leadId) newErrors.leadId = 'Project lead is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const projectData = {
        ...formData,
        bugCount: 0,
        teamMembers: formData.teamMembers.map(id => parseInt(id))
      };
      
      await projectService.create(projectData);
      toast.success(`Project "${formData.name}" created successfully!`);
      resetForm();
      onClose();
      onProjectCreated();
    } catch (error) {
      toast.error('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTeamMemberToggle = (userId) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(userId)
        ? prev.teamMembers.filter(id => id !== userId)
        : [...prev.teamMembers, userId]
    }));
  };

  const handleEnvironmentChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      environments: prev.environments.map((env, i) => i === index ? value : env)
    }));
  };

  const addEnvironment = () => {
    setFormData(prev => ({
      ...prev,
      environments: [...prev.environments, '']
    }));
  };

  const removeEnvironment = (index) => {
    setFormData(prev => ({
      ...prev,
      environments: prev.environments.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Project Name" required error={errors.name}>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter project name"
                error={errors.name}
              />
            </FormField>

            <FormField label="Project Lead" required error={errors.leadId}>
              <Select
                value={formData.leadId}
                onChange={(e) => setFormData(prev => ({ ...prev, leadId: e.target.value }))}
                error={errors.leadId}
              >
                <option value="">Select project lead</option>
                {users.map(user => (
                  <option key={user.Id} value={user.Id.toString()}>
                    {user.name} - {user.role}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField label="Description" required error={errors.description}>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the project goals and scope"
              rows={3}
              error={errors.description}
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Initial Status">
              <Select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="Planning">Planning</option>
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
              </Select>
            </FormField>

            <FormField label="Default Bug Priority">
              <Select
                value={formData.bugPriorityDefault}
                onChange={(e) => setFormData(prev => ({ ...prev, bugPriorityDefault: e.target.value }))}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Team Members">
            <div className="space-y-3 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {users.map(user => (
                <label key={user.Id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.teamMembers.includes(user.Id.toString())}
                    onChange={() => handleTeamMemberToggle(user.Id.toString())}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" className="h-3 w-3 text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-700">{user.name} - {user.role}</span>
                  </div>
                </label>
              ))}
            </div>
          </FormField>

          <FormField label="Custom Environments">
            <div className="space-y-2">
              {formData.environments.map((env, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={env}
                    onChange={(e) => handleEnvironmentChange(index, e.target.value)}
                    placeholder="Environment name"
                    className="flex-1"
                  />
                  {formData.environments.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEnvironment(index)}
                    >
                      <ApperIcon name="X" size={14} />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addEnvironment}
                icon="Plus"
              >
                Add Environment
              </Button>
            </div>
          </FormField>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              icon="Plus"
            >
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [bugs, setBugs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
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
    const inProgressBugs = projectBugs.filter(bug => bug.status === "In Progress").length;
    
    // Calculate average resolution time (mock calculation)
    const avgResolutionDays = projectBugs.length > 0 ? Math.round(Math.random() * 10 + 3) : 0;
    
    return {
      total: projectBugs.length,
      open: openBugs,
      critical: criticalBugs,
      resolved: resolvedBugs,
      inProgress: inProgressBugs,
      progress: projectBugs.length > 0 ? Math.round((resolvedBugs / projectBugs.length) * 100) : 0,
      avgResolutionTime: avgResolutionDays
    };
  };

  const getProjectLead = (leadId) => {
    const lead = users.find(user => user.Id === parseInt(leadId));
    return lead ? lead : null;
  };

  const getProjectTeamMembers = (projectId) => {
    // Mock team member assignment - in real app this would be from project.teamMembers
    return users.slice(0, Math.min(3, users.length));
  };

  const handleProjectClick = (projectId) => {
    toast.info(`Navigating to project ${projectId} details...`);
    // In real app: navigate(`/projects/${projectId}`);
  };

  const handleDeleteProject = async (projectId, projectName) => {
    if (!window.confirm(`Are you sure you want to delete "${projectName}"?`)) return;
    
    try {
      await projectService.delete(projectId);
      toast.success(`Project "${projectName}" deleted successfully!`);
      loadData();
    } catch (error) {
      toast.error('Failed to delete project. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
          <Button 
            icon="Plus"
            onClick={() => setShowCreateModal(true)}
          >
            New Project
          </Button>
        </div>

        <Empty
          title="No projects found"
          description="Create your first project to start organizing bug reports and tracking progress."
          icon="FolderOpen"
          action={
            <Button icon="Plus" onClick={() => setShowCreateModal(true)}>
              Create Project
            </Button>
          }
        />
        
        <ProjectCreateModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onProjectCreated={loadData}
          users={users}
        />
      </div>
    );
  }

return (
    <>
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
            <Button 
              icon="Plus"
              onClick={() => setShowCreateModal(true)}
            >
              New Project
            </Button>
          </div>
        </div>

        {/* Project Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Total Projects"
            value={projects.length}
            icon="FolderOpen"
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
          />
          
          <MetricCard
            title="Active Projects"
            value={projects.filter(p => p.status === "Active").length}
            icon="Play"
            className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
          />
          
          <MetricCard
            title="Total Bugs"
            value={bugs.length}
            icon="Bug"
            className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200"
          />
          
          <MetricCard
            title="Avg Resolution"
            value="7.2 days"
            icon="TrendingUp"
            className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200"
          />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const stats = getProjectStats(project.Id);
            const lead = getProjectLead(project.leadId);
            const teamMembers = getProjectTeamMembers(project.Id);
            
            return (
              <div 
                key={project.Id} 
                className="card hover:shadow-lg transition-all duration-300 group cursor-pointer"
                onClick={() => handleProjectClick(project.Id)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-3">
                    <Badge 
                      variant={project.status === "Active" ? "success" : 
                              project.status === "Planning" ? "warning" : "default"}
                    >
                      {project.status}
                    </Badge>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.Id, project.name);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </button>
                  </div>
                </div>

                {/* Project Lead & Team */}
                <div className="space-y-3 mb-4">
                  {lead && (
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <ApperIcon name="Crown" className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm text-gray-600">
                        Led by <span className="font-medium text-gray-900">{lead.name}</span>
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-1">
                      {teamMembers.slice(0, 3).map((member, index) => (
                        <div
                          key={member.Id}
                          className="h-6 w-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                          title={member.name}
                        >
                          {member.name.charAt(0)}
                        </div>
                      ))}
                      {teamMembers.length > 3 && (
                        <div className="h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
                          +{teamMembers.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{teamMembers.length} members</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-medium text-gray-900">{stats.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stats.progress}%` }}
                    />
                  </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-gray-900">{stats.total}</p>
                    <p className="text-xs text-gray-500">Total Issues</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-green-600">{stats.resolved}</p>
                    <p className="text-xs text-gray-500">Resolved</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-blue-600">{stats.open}</p>
                    <p className="text-xs text-gray-500">Open</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-red-600">{stats.critical}</p>
                    <p className="text-xs text-gray-500">Critical</p>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
                  <span>Created {formatDate(project.createdAt)}</span>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Clock" className="h-3 w-3" />
                    <span>Avg: {stats.avgResolutionTime}d</span>
                  </div>
                </div>

                {/* Action Buttons - Only visible on hover */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProjectClick(project.Id);
                    }}
                    className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 font-medium"
                  >
                    <ApperIcon name="ArrowRight" className="h-3 w-3" />
                    <span>View Details</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info(`Opening settings for ${project.name}...`);
                    }}
                    className="flex items-center space-x-1 text-xs text-gray-600 hover:text-primary font-medium"
                  >
                    <ApperIcon name="Settings" className="h-3 w-3" />
                    <span>Settings</span>
                  </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <ProjectCreateModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onProjectCreated={loadData}
          users={users}
        />
      </>
    );
};

export default Projects;