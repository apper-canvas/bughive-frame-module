import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

/**
 * Notification Service
 * Handles all notification-related database operations using ApperClient
 */

/**
 * Get all notifications with bug details
 * @returns {Promise<Array>} Array of notification objects
 */
export const getAll = async () => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Id" } },
        { field: { Name: "Name" } },
        { field: { Name: "bug_id_c" }, referenceField: { field: { Name: "title_c" } } },
        { field: { Name: "old_status_c" } },
        { field: { Name: "new_status_c" } },
        { field: { Name: "CreatedOn" } }
      ],
      orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
      pagingInfo: { limit: 50, offset: 0 }
    };
    
    const response = await apperClient.fetchRecords('notification_c', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching notifications:", error?.response?.data?.message || error);
    toast.error("Failed to load notifications");
    return [];
  }
};

/**
 * Get count of unread notifications
 * @returns {Promise<number>} Count of unread notifications
 */
export const getUnreadCount = async () => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [{ field: { Name: "Id" } }],
      where: [{ FieldName: "Name", Operator: "DoesNotHaveValue", Values: [] }]
    };
    
    const response = await apperClient.fetchRecords('notification_c', params);
    
    if (!response.success) {
      return 0;
    }
    
    return response.total || 0;
  } catch (error) {
    console.error("Error fetching unread count:", error?.response?.data?.message || error);
    return 0;
  }
};

/**
 * Create new notification
 * @param {Object} notificationData - Notification data
 * @returns {Promise<Object|null>} Created notification object or null
 */
export const create = async (notificationData) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [{
        bug_id_c: parseInt(notificationData.bug_id_c),
        old_status_c: notificationData.old_status_c,
        new_status_c: notificationData.new_status_c
      }]
    };
    
    const response = await apperClient.createRecord('notification_c', params);
    
    if (!response.success) {
      console.error(response.message);
      return null;
    }
    
    if (response.results && response.results.length > 0 && response.results[0].success) {
      return response.results[0].data;
    }
    
    return null;
  } catch (error) {
    console.error("Error creating notification:", error?.response?.data?.message || error);
    return null;
  }
};

/**
 * Mark notification as read by setting Name field
 * @param {number} id - Notification ID
 * @returns {Promise<boolean>} Success status
 */
export const markAsRead = async (id) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [{
        Id: parseInt(id),
        Name: "Read"
      }]
    };
    
    const response = await apperClient.updateRecord('notification_c', params);
    
    if (!response.success) {
      console.error(response.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error?.response?.data?.message || error);
    return false;
  }
};

/**
 * Mark all notifications as read
 * @returns {Promise<boolean>} Success status
 */
export const markAllAsRead = async () => {
  try {
    const notifications = await getAll();
    const unreadNotifications = notifications.filter(n => !n.Name);
    
    if (unreadNotifications.length === 0) {
      return true;
    }
    
    const apperClient = getApperClient();
    
    const params = {
      records: unreadNotifications.map(n => ({
        Id: n.Id,
        Name: "Read"
      }))
    };
    
    const response = await apperClient.updateRecord('notification_c', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return false;
    }
    
    toast.success("All notifications marked as read");
    return true;
  } catch (error) {
    console.error("Error marking all notifications as read:", error?.response?.data?.message || error);
    toast.error("Failed to mark notifications as read");
    return false;
  }
};

/**
 * Delete single notification
 * @param {number} id - Notification ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteNotification = async (id) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord('notification_c', params);
    
    if (!response.success) {
      console.error(response.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting notification:", error?.response?.data?.message || error);
    return false;
  }
};

/**
 * Delete all notifications
 * @returns {Promise<boolean>} Success status
 */
export const deleteAll = async () => {
  try {
    const notifications = await getAll();
    
    if (notifications.length === 0) {
      toast.info("No notifications to delete");
      return true;
    }
    
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: notifications.map(n => n.Id)
    };
    
    const response = await apperClient.deleteRecord('notification_c', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return false;
    }
    
    toast.success("All notifications cleared");
    return true;
  } catch (error) {
    console.error("Error deleting all notifications:", error?.response?.data?.message || error);
    toast.error("Failed to clear notifications");
    return false;
  }
};

export const notificationService = {
  getAll,
  getUnreadCount,
  create,
  markAsRead,
  markAllAsRead,
  delete: deleteNotification,
  deleteAll
};