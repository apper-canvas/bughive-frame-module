// Bug Service - Apper Backend Integration

class BugService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'bug_c';
    this.lookupFields = ['assignee_id_c', 'reporter_id_c', 'project_id_c'];
  }

  // Simulate API delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "estimated_time_hours_c" } },
          { field: { Name: "actual_time_hours_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "environment_c" } },
          { field: { Name: "assignee_id_c" } },
          { field: { Name: "reporter_id_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching bugs:", error?.response?.data?.message);
      } else {
        console.error("Error fetching bugs:", error.message);
      }
      return [];
    }
  }

async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "estimated_time_hours_c" } },
          { field: { Name: "actual_time_hours_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "environment_c" } },
          { field: { Name: "assignee_id_c" } },
          { field: { Name: "reporter_id_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching bug with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching bug with ID ${id}:`, error.message);
      }
      throw error;
    }
  }

async create(bugData) {
    try {
      const updateableData = {
        Name: bugData.Name || bugData.title,
        title_c: bugData.title_c || bugData.title,
        description_c: bugData.description_c || bugData.description,
        priority_c: bugData.priority_c || bugData.priority,
        status_c: bugData.status_c || bugData.status || "Open",
        estimated_time_hours_c: bugData.estimated_time_hours_c || (bugData.estimatedTimeHours ? parseFloat(bugData.estimatedTimeHours) : null),
        actual_time_hours_c: bugData.actual_time_hours_c || (bugData.actualTimeHours ? parseFloat(bugData.actualTimeHours) : null),
        created_at_c: new Date().toISOString(),
        updated_at_c: new Date().toISOString(),
        environment_c: bugData.environment_c || JSON.stringify(bugData.environment || {}),
        assignee_id_c: bugData.assignee_id_c || (bugData.assigneeId ? parseInt(bugData.assigneeId) : null),
        reporter_id_c: bugData.reporter_id_c || (bugData.reporterId ? parseInt(bugData.reporterId) : null),
        project_id_c: bugData.project_id_c || (bugData.projectId ? parseInt(bugData.projectId) : null)
      };
      
      // Remove undefined fields
      Object.keys(updateableData).forEach(key => {
        if (updateableData[key] === undefined) {
          delete updateableData[key];
        }
      });
      
      const params = {
        records: [updateableData]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create bugs ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating bug in Bug service:", error?.response?.data?.message);
      } else {
        console.error("Error creating bug:", error.message);
      }
      throw error;
    }
  }

async update(id, updateData) {
    try {
      const updateableData = {
        Id: parseInt(id),
        Name: updateData.Name || updateData.title,
        title_c: updateData.title_c || updateData.title,
        description_c: updateData.description_c || updateData.description,
        priority_c: updateData.priority_c || updateData.priority,
        status_c: updateData.status_c || updateData.status,
        estimated_time_hours_c: updateData.estimated_time_hours_c || (updateData.estimatedTimeHours ? parseFloat(updateData.estimatedTimeHours) : null),
        actual_time_hours_c: updateData.actual_time_hours_c || (updateData.actualTimeHours ? parseFloat(updateData.actualTimeHours) : null),
        updated_at_c: new Date().toISOString(),
        environment_c: updateData.environment_c || (updateData.environment ? JSON.stringify(updateData.environment) : null),
        assignee_id_c: updateData.assignee_id_c || (updateData.assigneeId ? parseInt(updateData.assigneeId) : null),
        reporter_id_c: updateData.reporter_id_c || (updateData.reporterId ? parseInt(updateData.reporterId) : null),
        project_id_c: updateData.project_id_c || (updateData.projectId ? parseInt(updateData.projectId) : null)
      };
      
      // Remove undefined fields
      Object.keys(updateableData).forEach(key => {
        if (updateableData[key] === undefined) {
          delete updateableData[key];
        }
      });
      
      const params = {
        records: [updateableData]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update bugs ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating bug in Bug service:", error?.response?.data?.message);
      } else {
        console.error("Error updating bug:", error.message);
      }
      throw error;
}
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete Bugs ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting bug:", error?.response?.data?.message);
      } else {
        console.error("Error deleting bug:", error.message);
      }
      throw error;
}
  }

  async getByProject(projectId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "assignee_id_c" } },
          { field: { Name: "project_id_c" } }
        ],
        where: [
          {
            FieldName: "project_id_c",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching bugs by project:", error.message);
      return [];
}
  }

  async getByAssignee(assigneeId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "assignee_id_c" } }
        ],
        where: [
          {
            FieldName: "assignee_id_c",
            Operator: "EqualTo",
            Values: [parseInt(assigneeId)]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching bugs by assignee:", error.message);
      return [];
}
  }

  async getByStatus(status) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } }
        ],
        where: [
          {
            FieldName: "status_c",
            Operator: "EqualTo",
            Values: [status]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching bugs by status:", error.message);
      return [];
}
  }

  async getByPriority(priority) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } }
        ],
        where: [
          {
            FieldName: "priority_c",
            Operator: "EqualTo",
            Values: [priority]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching bugs by priority:", error.message);
      return [];
}
  }

  async search(searchTerm) {
    try {
      if (!searchTerm || !searchTerm.trim()) {
        return await this.getAll();
      }
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "assignee_id_c" } },
          { field: { Name: "reporter_id_c" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "title_c",
                    operator: "Contains",
                    values: [searchTerm]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "description_c",
                    operator: "Contains", 
                    values: [searchTerm]
                  }
                ]
              }
            ]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching bugs:", error.message);
      return [];
    }
  }
}

export const bugService = new BugService();