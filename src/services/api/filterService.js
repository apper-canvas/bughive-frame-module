// Filter Service - Apper Backend Integration
class FilterService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'filter_c';
    
    // Preset filters - hardcoded for now
    this.presetFilters = [
      {
        Id: -1,
        Name: "My Assigned Bugs",
        type_c: "preset",
        filters_c: JSON.stringify({
          assigneeId: "3",
        }),
        icon_c: "User"
      },
      {
        Id: -2,
        Name: "High Priority Open",
        type_c: "preset",
        filters_c: JSON.stringify({
          priority: "High",
          status: "Open"
        }),
        icon_c: "AlertCircle"
      },
      {
        Id: -3,
        Name: "Critical Issues",
        type_c: "preset",
        filters_c: JSON.stringify({
          priority: "Critical"
        }),
        icon_c: "AlertTriangle"
      },
      {
        Id: -4,
        Name: "Recently Updated",
        type_c: "preset",
        filters_c: JSON.stringify({
          updatedWithin: 7
        }),
        icon_c: "Clock"
      }
    ];
  }

  async getAllFilters() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "filters_c" } },
          { field: { Name: "icon_c" } },
          { field: { Name: "created_at_c" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      const customFilters = response.success ? (response.data || []) : [];
      
      // Transform custom filters to match expected format
      const transformedCustom = customFilters.map(filter => ({
        Id: filter.Id,
        name: filter.Name,
        type: filter.type_c,
        filters: filter.filters_c ? JSON.parse(filter.filters_c) : {},
        icon: filter.icon_c,
        createdAt: filter.created_at_c
      }));
      
      // Transform preset filters to match expected format  
      const transformedPreset = this.presetFilters.map(filter => ({
        Id: filter.Id,
        name: filter.Name,
        type: filter.type_c,
        filters: filter.filters_c ? JSON.parse(filter.filters_c) : {},
        icon: filter.icon_c
      }));
      
      return [...transformedPreset, ...transformedCustom];
    } catch (error) {
      console.error("Error fetching filters:", error.message);
      // Return only preset filters on error
      return this.presetFilters.map(filter => ({
        Id: filter.Id,
        name: filter.Name,
        type: filter.type_c,
        filters: filter.filters_c ? JSON.parse(filter.filters_c) : {},
        icon: filter.icon_c
      }));
    }
  }

  async getPresetFilters() {
    return this.presetFilters.map(filter => ({
      Id: filter.Id,
      name: filter.Name,
      type: filter.type_c,
      filters: filter.filters_c ? JSON.parse(filter.filters_c) : {},
      icon: filter.icon_c
    }));
  }

  async getCustomFilters() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "filters_c" } },
          { field: { Name: "icon_c" } },
          { field: { Name: "created_at_c" } }
        ],
        where: [
          {
            FieldName: "type_c",
            Operator: "EqualTo",
            Values: ["custom"]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return (response.data || []).map(filter => ({
        Id: filter.Id,
        name: filter.Name,
        type: filter.type_c,
        filters: filter.filters_c ? JSON.parse(filter.filters_c) : {},
        icon: filter.icon_c,
        createdAt: filter.created_at_c
      }));
    } catch (error) {
      console.error("Error fetching custom filters:", error.message);
      return [];
    }
  }

  async saveFilter(name, filters) {
    try {
      const updateableData = {
        Name: name,
        type_c: "custom",
        filters_c: JSON.stringify(filters),
        icon_c: "Filter",
        created_at_c: new Date().toISOString()
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return {
            Id: result.data.Id,
            name: result.data.Name,
            type: result.data.type_c,
            filters: JSON.parse(result.data.filters_c),
            icon: result.data.icon_c,
            createdAt: result.data.created_at_c
          };
        }
      }
      
      throw new Error("Failed to save filter");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating filter:", error?.response?.data?.message);
      } else {
        console.error("Error creating filter:", error.message);
      }
      throw error;
    }
  }

  async deleteFilter(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting filter:", error?.response?.data?.message);
      } else {
        console.error("Error deleting filter:", error.message);
      }
      throw error;
    }
  }

  // Legacy methods for compatibility
  loadActiveFilter() {
    try {
      const saved = localStorage.getItem('bughive_active_filter');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      return null;
    }
  }

  saveActiveFilter(filterState) {
    try {
      localStorage.setItem('bughive_active_filter', JSON.stringify(filterState));
    } catch (error) {
      console.error('Failed to save active filter:', error);
    }
  }
}

export const filterService = new FilterService();