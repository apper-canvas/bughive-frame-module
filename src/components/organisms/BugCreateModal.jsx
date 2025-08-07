import { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import FormField from "@/components/molecules/FormField";
import FileUpload from "@/components/molecules/FileUpload";
import { bugService } from "@/services/api/bugService";
import { userService } from "@/services/api/userService";
import { projectService } from "@/services/api/projectService";

const BugCreateModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reproductionSteps: "",
    priority: "Medium",
    severity: "Medium",
    assigneeId: "",
    projectId: "",
    dueDate: "",
    environment: {
      browser: "",
      os: "",
      device: ""
    },
    attachments: []
  });
  const [errors, setErrors] = useState({});

  // Load users and projects when modal opens
  useState(() => {
    if (isOpen) {
      loadUsers();
      loadProjects();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    try {
      const userData = await userService.getAll();
      setUsers(userData);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const loadProjects = async () => {
    try {
      const projectData = await projectService.getAll();
      setProjects(projectData);
    } catch (error) {
      console.error("Failed to load projects:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("environment.")) {
      const envField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        environment: {
          ...prev.environment,
          [envField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleFileSelect = (files) => {
    setFormData(prev => ({
      ...prev,
      attachments: files
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Bug title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.reproductionSteps.trim()) {
      newErrors.reproductionSteps = "Reproduction steps are required";
    }

    if (!formData.assigneeId) {
      newErrors.assigneeId = "Please assign the bug to someone";
    }

    if (!formData.projectId) {
      newErrors.projectId = "Please select a project";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setLoading(true);

    try {
      const bugData = {
        ...formData,
        status: "Open",
        reporterId: "1", // Mock current user ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await bugService.create(bugData);
      
      toast.success("Bug report created successfully!");
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        reproductionSteps: "",
        priority: "Medium",
        severity: "Medium",
        assigneeId: "",
        projectId: "",
        dueDate: "",
        environment: {
          browser: "",
          os: "",
          device: ""
        },
        attachments: []
      });
      
      onClose();
    } catch (error) {
      console.error("Failed to create bug:", error);
      toast.error("Failed to create bug report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Create New Bug Report</h2>
            <p className="text-sm text-gray-500 mt-1">Fill in the details to report a new bug</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <ApperIcon name="X" className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
          {/* Basic Information */}
          <div className="space-y-6">
            <FormField label="Bug Title" required error={errors.title}>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Brief description of the bug"
                error={errors.title}
              />
            </FormField>

            <FormField label="Description" required error={errors.description}>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detailed description of the bug and its impact"
                rows={4}
                error={errors.description}
              />
            </FormField>

            <FormField label="Steps to Reproduce" required error={errors.reproductionSteps}>
              <Textarea
                name="reproductionSteps"
                value={formData.reproductionSteps}
                onChange={handleInputChange}
                placeholder="1. Go to... 2. Click on... 3. Notice that..."
                rows={4}
                error={errors.reproductionSteps}
              />
            </FormField>
          </div>

          {/* Priority and Assignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Priority" required>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </Select>
            </FormField>

            <FormField label="Severity" required>
              <Select
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
              >
                <option value="Minor">Minor</option>
                <option value="Medium">Medium</option>
                <option value="Major">Major</option>
                <option value="Critical">Critical</option>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Assign to" required error={errors.assigneeId}>
              <Select
                name="assigneeId"
                value={formData.assigneeId}
                onChange={handleInputChange}
                error={errors.assigneeId}
              >
                <option value="">Select team member</option>
                {users.map(user => (
                  <option key={user.Id} value={user.Id}>{user.name}</option>
                ))}
              </Select>
            </FormField>

            <FormField label="Project" required error={errors.projectId}>
              <Select
                name="projectId"
                value={formData.projectId}
                onChange={handleInputChange}
                error={errors.projectId}
              >
                <option value="">Select project</option>
                {projects.map(project => (
                  <option key={project.Id} value={project.Id}>{project.name}</option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField label="Due Date">
            <Input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
            />
          </FormField>

          {/* Environment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Environment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Browser">
                <Input
                  name="environment.browser"
                  value={formData.environment.browser}
                  onChange={handleInputChange}
                  placeholder="e.g., Chrome 118.0"
                />
              </FormField>

              <FormField label="Operating System">
                <Input
                  name="environment.os"
                  value={formData.environment.os}
                  onChange={handleInputChange}
                  placeholder="e.g., Windows 11"
                />
              </FormField>

              <FormField label="Device">
                <Input
                  name="environment.device"
                  value={formData.environment.device}
                  onChange={handleInputChange}
                  placeholder="e.g., Desktop, iPhone 14"
                />
              </FormField>
            </div>
          </div>

          {/* File Attachments */}
          <FormField label="Attachments">
            <FileUpload
              onFileSelect={handleFileSelect}
              accept="image/*,.pdf,.log,.txt,.json,.xml"
              multiple={true}
            />
          </FormField>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
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
              icon="Bug"
            >
              Create Bug Report
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BugCreateModal;