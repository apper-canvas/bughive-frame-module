// Project Service - Apper Backend Integration

class ProjectService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'project_c';
    this.lookupFields = ['lead_id_c'];
  }

  // Simulate API delay
  delay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description_c" } },
          { field: { Name: "lead_id_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "bug_count_c" } },
          { field: { Name: "team_members_c" } },
          { field: { Name: "bug_priority_default_c" } },
          { field: { Name: "environments_c" } },
          { field: { Name: "created_at_c" } },
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
        console.error("Error fetching projects:", error?.response?.data?.message);
      } else {
        console.error("Error fetching projects:", error.message);
      }
      return [];
    }
  }

async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description_c" } },
          { field: { Name: "lead_id_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "bug_count_c" } },
          { field: { Name: "team_members_c" } },
          { field: { Name: "bug_priority_default_c" } },
          { field: { Name: "environments_c" } },
          { field: { Name: "created_at_c" } },
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
        console.error(`Error fetching project with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching project with ID ${id}:`, error.message);
      }
      throw error;
    }
  }

async create(projectData) {
    try {
      const updateableData = {
        Name: projectData.Name || projectData.name,
        description_c: projectData.description_c || projectData.description,
        lead_id_c: projectData.lead_id_c || (projectData.leadId ? parseInt(projectData.leadId) : null),
        status_c: projectData.status_c || projectData.status || 'Active',
        bug_count_c: projectData.bug_count_c || projectData.bugCount || 0,
        team_members_c: projectData.team_members_c || (projectData.teamMembers ? JSON.stringify(projectData.teamMembers) : null),
        bug_priority_default_c: projectData.bug_priority_default_c || projectData.bugPriorityDefault || 'Medium',
        environments_c: projectData.environments_c || (projectData.environments ? JSON.stringify(projectData.environments) : JSON.stringify(['Development', 'Staging', 'Production'])),
        created_at_c: new Date().toISOString()
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
          console.error(`Failed to create projects ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
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
        console.error("Error creating project in Project service:", error?.response?.data?.message);
      } else {
        console.error("Error creating project:", error.message);
      }
      throw error;
    }
  }

async update(id, updateData) {
    try {
      const updateableData = {
        Id: parseInt(id),
        Name: updateData.Name || updateData.name,
        description_c: updateData.description_c || updateData.description,
        lead_id_c: updateData.lead_id_c || (updateData.leadId ? parseInt(updateData.leadId) : null),
        status_c: updateData.status_c || updateData.status,
        bug_count_c: updateData.bug_count_c || updateData.bugCount,
        team_members_c: updateData.team_members_c || (updateData.teamMembers ? JSON.stringify(updateData.teamMembers) : null),
        bug_priority_default_c: updateData.bug_priority_default_c || updateData.bugPriorityDefault,
        environments_c: updateData.environments_c || (updateData.environments ? JSON.stringify(updateData.environments) : null)
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
          console.error(`Failed to update projects ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
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
        console.error("Error updating project in Project service:", error?.response?.data?.message);
      } else {
        console.error("Error updating project:", error.message);
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
          console.error(`Failed to delete Projects ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting project:", error?.response?.data?.message);
      } else {
        console.error("Error deleting project:", error.message);
      }
      throw error;
}
  }

  async getByStatus(status) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "lead_id_c" } }
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
      console.error("Error fetching projects by status:", error.message);
      return [];
}
  }

  async getByLead(leadId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "lead_id_c" } }
        ],
        where: [
          {
            FieldName: "lead_id_c",
            Operator: "EqualTo",
            Values: [parseInt(leadId)]
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
      console.error("Error fetching projects by lead:", error.message);
      return [];
}
  }
}

export const projectService = new ProjectService();