import bugData from "@/services/mockData/bugs.json";

class BugService {
  constructor() {
    // Load initial data
    this.bugs = [...bugData];
  }

  // Simulate API delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.bugs];
  }

  async getById(id) {
    await this.delay();
    const bug = this.bugs.find(bug => bug.Id === parseInt(id));
    if (!bug) {
      throw new Error(`Bug with Id ${id} not found`);
    }
    return { ...bug };
  }

  async create(bugData) {
    await this.delay();
    
    // Find highest existing Id and add 1
    const maxId = this.bugs.reduce((max, bug) => Math.max(max, bug.Id), 0);
    
    const newBug = {
      ...bugData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.bugs.push(newBug);
    return { ...newBug };
  }

  async update(id, updateData) {
    await this.delay();
    
    const index = this.bugs.findIndex(bug => bug.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Bug with Id ${id} not found`);
    }
    
    this.bugs[index] = {
      ...this.bugs[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.bugs[index] };
  }

  async delete(id) {
    await this.delay();
    
    const index = this.bugs.findIndex(bug => bug.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Bug with Id ${id} not found`);
    }
    
    const deletedBug = { ...this.bugs[index] };
    this.bugs.splice(index, 1);
    return deletedBug;
  }

  async getByProject(projectId) {
    await this.delay();
    return this.bugs.filter(bug => bug.projectId === projectId.toString());
  }

  async getByAssignee(assigneeId) {
    await this.delay();
    return this.bugs.filter(bug => bug.assigneeId === assigneeId.toString());
  }

  async getByStatus(status) {
    await this.delay();
    return this.bugs.filter(bug => bug.status === status);
  }

  async getByPriority(priority) {
    await this.delay();
    return this.bugs.filter(bug => bug.priority === priority);
  }
async search(searchTerm) {
    await this.delay();
    
    if (!searchTerm || !searchTerm.trim()) {
      return [...this.bugs];
    }
    
    const searchLower = searchTerm.toLowerCase();
    
    return this.bugs.filter(bug => 
      bug.title.toLowerCase().includes(searchLower) ||
      bug.description.toLowerCase().includes(searchLower) ||
      bug.assigneeId.toString().includes(searchLower) ||
      bug.reporterId.toString().includes(searchLower)
    );
  }
}

export const bugService = new BugService();