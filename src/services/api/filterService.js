class FilterService {
  constructor() {
    // Initialize with preset filters and load custom filters from localStorage
    this.presetFilters = [
      {
        Id: 1,
        name: "My Assigned Bugs",
        type: "preset",
        filters: {
          assigneeId: "3", // Emily Johnson - QA Engineer
        },
        icon: "User"
      },
      {
        Id: 2,
        name: "High Priority Open",
        type: "preset",
        filters: {
          priority: "High",
          status: "Open"
        },
        icon: "AlertCircle"
      },
      {
        Id: 3,
        name: "Critical Issues",
        type: "preset",
        filters: {
          priority: "Critical"
        },
        icon: "AlertTriangle"
      },
      {
        Id: 4,
        name: "Recently Updated",
        type: "preset",
        filters: {
          updatedWithin: 7 // days
        },
        icon: "Clock"
      }
    ];
    
    this.customFilters = this.loadCustomFilters();
  }

  // Simulate API delay
  delay(ms = 100) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

loadCustomFilters() {
    try {
      const saved = localStorage.getItem('bughive_custom_filters');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  }

  saveCustomFilters() {
    try {
      const data = {
        customFilters: this.customFilters,
        activeFilter: this.activeFilter || null
      };
      localStorage.setItem('bughive_custom_filters', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save custom filters:', error);
    }
  }

  loadActiveFilter() {
    try {
      const saved = localStorage.getItem('bughive_custom_filters');
      if (saved) {
        const data = JSON.parse(saved);
        return data.activeFilter || null;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  saveActiveFilter(filterState) {
    try {
      this.activeFilter = filterState;
      this.saveCustomFilters();
    } catch (error) {
      console.error('Failed to save active filter:', error);
    }
  }

  async getAllFilters() {
    await this.delay();
    return [...this.presetFilters, ...this.customFilters];
  }

  async getPresetFilters() {
    await this.delay();
    return [...this.presetFilters];
  }

  async getCustomFilters() {
    await this.delay();
    return [...this.customFilters];
  }

  async saveFilter(name, filters) {
    await this.delay();
    
    const maxId = Math.max(
      ...this.presetFilters.map(f => f.Id),
      ...this.customFilters.map(f => f.Id),
      0
    );
    
    const newFilter = {
      Id: maxId + 1,
      name,
      type: "custom",
      filters: { ...filters },
      icon: "Filter",
      createdAt: new Date().toISOString()
    };
    
    this.customFilters.push(newFilter);
    this.saveCustomFilters();
    return newFilter;
  }

  async deleteFilter(id) {
    await this.delay();
    
    const index = this.customFilters.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Custom filter with Id ${id} not found`);
    }
    
    const deletedFilter = this.customFilters.splice(index, 1)[0];
    this.saveCustomFilters();
    return deletedFilter;
  }
}

export const filterService = new FilterService();