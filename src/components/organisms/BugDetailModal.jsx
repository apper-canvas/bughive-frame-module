import React, { useEffect, useState } from "react";
import { format, formatDistanceToNow, isValid } from "date-fns";
import { bugService } from "@/services/api/bugService";
import { userService } from "@/services/api/userService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import Textarea from "@/components/atoms/Textarea";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const BugDetailModal = ({ isOpen, onClose, bugId, onBugUpdate }) => {
  const [bug, setBug] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [newComment, setNewComment] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [statusAction, setStatusAction] = useState('');
  const [activities, setActivities] = useState([]);
  const [mentions, setMentions] = useState([]);

  useEffect(() => {
    if (isOpen && bugId) {
      loadBugData();
      loadUsers();
    }
  }, [isOpen, bugId]);

  const loadBugData = async () => {
    try {
      setLoading(true);
      const bugData = await bugService.getById(bugId);
      setBug(bugData);
      setEditValues({
        title: bugData.title,
        description: bugData.description,
        priority: bugData.priority,
        assigneeId: bugData.assigneeId,
        status: bugData.status
      });
      
      // Generate mock activities for demonstration
      generateMockActivities(bugData);
    } catch (error) {
      toast.error('Failed to load bug details');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const userData = await userService.getAll();
      setUsers(userData);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const generateMockActivities = (bugData) => {
    const mockActivities = [
      {
        id: 1,
        type: 'created',
        userId: bugData.reporterId,
        timestamp: bugData.createdAt,
        data: { title: bugData.title }
      },
      {
        id: 2,
        type: 'status_change',
        userId: bugData.assigneeId,
        timestamp: bugData.updatedAt,
        data: { from: 'Open', to: bugData.status }
      },
      {
        id: 3,
        type: 'comment',
        userId: '2',
        timestamp: '2024-01-16T09:30:00Z',
        data: { comment: 'I can reproduce this issue. Working on a fix.' }
      },
      {
        id: 4,
        type: 'time_logged',
        userId: bugData.assigneeId,
        timestamp: '2024-01-16T14:15:00Z',
        data: { hours: 2.5, description: 'Investigation and initial debugging' }
      }
    ];
    setActivities(mockActivities);
  };

  const getUserById = (userId) => {
    return users.find(user => user.Id == userId) || { name: 'Unknown User', avatar: '' };
  };

  const handleFieldEdit = (field, value) => {
    setEditingField(field);
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  const handleFieldSave = async (field) => {
    if (!bug || editValues[field] === bug[field]) {
      setEditingField(null);
      return;
    }

    try {
      const updateData = { [field]: editValues[field] };
      const updatedBug = await bugService.update(bug.Id, updateData);
      setBug(updatedBug);
      
      // Add activity
      const newActivity = {
        id: Date.now(),
        type: 'field_update',
        userId: '1', // Current user
        timestamp: new Date().toISOString(),
        data: { field, from: bug[field], to: editValues[field] }
      };
      setActivities(prev => [newActivity, ...prev]);
      
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
      onBugUpdate?.(updatedBug);
      setEditingField(null);
    } catch (error) {
      toast.error(`Failed to update ${field}`);
      setEditValues(prev => ({ ...prev, [field]: bug[field] }));
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!bug || newStatus === bug.status) return;

    try {
      const updatedBug = await bugService.update(bug.Id, { status: newStatus });
      setBug(updatedBug);
      
      const newActivity = {
        id: Date.now(),
        type: 'status_change',
        userId: '1',
        timestamp: new Date().toISOString(),
        data: { from: bug.status, to: newStatus }
      };
      setActivities(prev => [newActivity, ...prev]);
      
      toast.success(`Bug status changed to ${newStatus}`);
      onBugUpdate?.(updatedBug);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const comment = {
        id: Date.now(),
        type: 'comment',
        userId: '1',
        timestamp: new Date().toISOString(),
        data: { 
          comment: newComment,
          timeSpent: timeSpent ? parseFloat(timeSpent) : null
        }
      };
      
      setActivities(prev => [comment, ...prev]);
      
      if (timeSpent) {
        const timeLog = {
          id: Date.now() + 1,
          type: 'time_logged',
          userId: '1',
          timestamp: new Date().toISOString(),
          data: { 
            hours: parseFloat(timeSpent),
            description: `Time logged with comment: ${newComment.substring(0, 50)}...`
          }
        };
        setActivities(prev => [timeLog, ...prev]);
      }
      
      setNewComment('');
      setTimeSpent('');
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleMentionSearch = (query) => {
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
    setMentions(filtered.slice(0, 5));
  };

  const renderActivityIcon = (type) => {
    const iconMap = {
      created: 'Plus',
      status_change: 'ArrowRight',
      comment: 'MessageCircle',
      time_logged: 'Clock',
      field_update: 'Edit',
      assigned: 'User'
    };
    return <ApperIcon name={iconMap[type] || 'Activity'} className="h-4 w-4" />;
  };

  const renderActivityContent = (activity) => {
    const user = getUserById(activity.userId);
    
    switch (activity.type) {
      case 'created':
        return `Created bug "${activity.data.title}"`;
      case 'status_change':
        return `Changed status from ${activity.data.from} to ${activity.data.to}`;
      case 'comment':
        return activity.data.comment;
      case 'time_logged':
        return `Logged ${activity.data.hours} hours - ${activity.data.description}`;
      case 'field_update':
        return `Updated ${activity.data.field} from "${activity.data.from}" to "${activity.data.to}"`;
      case 'assigned':
        return `Assigned to ${getUserById(activity.data.assigneeId).name}`;
      default:
        return 'Unknown activity';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Bug #{bug?.Id}
            </h2>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleStatusChange('In Progress')}
                disabled={bug?.status === 'In Progress'}
              >
                <ApperIcon name="Play" className="h-4 w-4 mr-1" />
                Start Progress
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleStatusChange('Resolved')}
                disabled={bug?.status === 'Resolved'}
              >
                <ApperIcon name="Check" className="h-4 w-4 mr-1" />
                Resolve
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleStatusChange('Closed')}
                disabled={bug?.status === 'Closed'}
              >
                <ApperIcon name="X" className="h-4 w-4 mr-1" />
                Close
              </Button>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ApperIcon name="X" className="h-5 w-5" />
          </Button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <ApperIcon name="Loader" className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Section - Bug Details */}
            <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-200">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Title</label>
                  {editingField === 'title' ? (
                    <div className="flex space-x-2">
                      <Input
                        value={editValues.title}
                        onChange={(e) => setEditValues(prev => ({ ...prev, title: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleFieldSave('title');
                          if (e.key === 'Escape') setEditingField(null);
                        }}
                        autoFocus
                      />
                      <Button size="sm" onClick={() => handleFieldSave('title')}>
                        <ApperIcon name="Check" className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingField(null)}>
                        <ApperIcon name="X" className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="p-3 border border-transparent hover:border-gray-300 rounded-md cursor-pointer transition-colors"
                      onClick={() => handleFieldEdit('title', bug.title)}
                    >
                      <p className="text-gray-900 font-medium">{bug.title}</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                  {editingField === 'description' ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editValues.description}
                        onChange={(e) => setEditValues(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        autoFocus
                      />
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => handleFieldSave('description')}>Save</Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditingField(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="p-3 border border-transparent hover:border-gray-300 rounded-md cursor-pointer transition-colors min-h-[100px]"
                      onClick={() => handleFieldEdit('description', bug.description)}
                    >
                      <p className="text-gray-700 whitespace-pre-wrap">{bug.description}</p>
                    </div>
                  )}
                </div>

                {/* Reproduction Steps */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Reproduction Steps</label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                      {bug.reproductionSteps}
                    </pre>
                  </div>
                </div>

                {/* Status and Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                    <StatusBadge status={bug.status} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Priority</label>
                    {editingField === 'priority' ? (
                      <div className="flex space-x-2">
                        <Select
                          value={editValues.priority}
                          onChange={(e) => setEditValues(prev => ({ ...prev, priority: e.target.value }))}
                          autoFocus
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </Select>
                        <Button size="sm" onClick={() => handleFieldSave('priority')}>
                          <ApperIcon name="Check" className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div onClick={() => handleFieldEdit('priority', bug.priority)}>
                        <PriorityBadge priority={bug.priority} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Assignee and Reporter */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Assignee</label>
                    {editingField === 'assigneeId' ? (
                      <div className="flex space-x-2">
                        <Select
                          value={editValues.assigneeId}
                          onChange={(e) => setEditValues(prev => ({ ...prev, assigneeId: e.target.value }))}
                          autoFocus
                        >
                          {users.map(user => (
                            <option key={user.Id} value={user.Id}>{user.name}</option>
                          ))}
                        </Select>
                        <Button size="sm" onClick={() => handleFieldSave('assigneeId')}>
                          <ApperIcon name="Check" className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                        onClick={() => handleFieldEdit('assigneeId', bug.assigneeId)}
                      >
                        <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <ApperIcon name="User" className="h-4 w-4 text-gray-500" />
                        </div>
                        <span className="text-gray-900">{getUserById(bug.assigneeId).name}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Reporter</label>
                    <div className="flex items-center space-x-2 p-2">
                      <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <ApperIcon name="User" className="h-4 w-4 text-gray-500" />
                      </div>
                      <span className="text-gray-700">{getUserById(bug.reporterId).name}</span>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Created</label>
<p className="text-sm text-gray-600">
                      {bug.createdAt && isValid(new Date(bug.createdAt)) 
                        ? format(new Date(bug.createdAt), 'MMM dd, yyyy HH:mm')
                        : 'Invalid date'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Last Updated</label>
<p className="text-sm text-gray-600">
                      {bug.updatedAt && isValid(new Date(bug.updatedAt)) 
                        ? format(new Date(bug.updatedAt), 'MMM dd, yyyy HH:mm')
                        : 'Invalid date'
                      }
                    </p>
                  </div>
                </div>

                {/* Environment */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Environment</label>
                  <div className="p-3 bg-gray-50 rounded-md space-y-1">
                    <p className="text-sm"><span className="font-medium">Browser:</span> {bug.environment?.browser}</p>
                    <p className="text-sm"><span className="font-medium">OS:</span> {bug.environment?.os}</p>
                    <p className="text-sm"><span className="font-medium">Device:</span> {bug.environment?.device}</p>
                  </div>
                </div>

                {/* Attachments */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Attachments</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <ApperIcon name="Upload" className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No attachments yet</p>
                    <Button variant="ghost" size="sm" className="mt-2">
                      Add Files
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Activity Timeline */}
            <div className="w-1/2 flex flex-col">
              {/* Activity Header */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Activity & Comments</h3>
              </div>

              {/* Activity Timeline */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {activities.map((activity) => {
                  const user = getUserById(activity.userId);
                  return (
                    <div key={activity.id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <ApperIcon name="User" className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{user.name}</span>
                          <div className={cn(
                            "flex items-center space-x-1 px-2 py-1 rounded-full text-xs",
                            activity.type === 'comment' && "bg-blue-100 text-blue-800",
                            activity.type === 'status_change' && "bg-green-100 text-green-800",
                            activity.type === 'time_logged' && "bg-yellow-100 text-yellow-800"
                          )}>
                            {renderActivityIcon(activity.type)}
                            <span className="capitalize">{activity.type.replace('_', ' ')}</span>
                          </div>
<span className="text-xs text-gray-500">
                            {activity.timestamp && isValid(new Date(activity.timestamp))
                              ? formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })
                              : 'Unknown'
                            }
                          </span>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-gray-700">{renderActivityContent(activity)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Comment Form */}
              <div className="border-t border-gray-200 p-6">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Add a comment... Use @ to mention team members"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Clock" className="h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Hours spent"
                        value={timeSpent}
                        onChange={(e) => setTimeSpent(e.target.value)}
                        type="number"
                        step="0.5"
                        className="w-24"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Select
                        value={statusAction}
                        onChange={(e) => setStatusAction(e.target.value)}
                        className="w-32"
                      >
                        <option value="">No status change</option>
                        <option value="In Progress">Start Progress</option>
                        <option value="Resolved">Resolve</option>
                        <option value="Closed">Close</option>
                      </Select>
                    </div>
                    
                    <Button onClick={handleCommentSubmit} disabled={!newComment.trim()}>
                      <ApperIcon name="Send" className="h-4 w-4 mr-2" />
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BugDetailModal;