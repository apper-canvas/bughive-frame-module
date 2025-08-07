import projectData from "@/services/mockData/projects.json";

class ProjectService {
  constructor() {
    // Load initial data
    this.projects = [...projectData];
  }

  // Simulate API delay
  delay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.projects];
  }

  async getById(id) {
    await this.delay();
    const project = this.projects.find(project => project.Id === parseInt(id));
    if (!project) {
      throw new Error(`Project with Id ${id} not found`);
    }
    return { ...project };
  }

async create(projectData) {
    await this.delay();
    
    // Find highest existing Id and add 1
    const maxId = this.projects.reduce((max, project) => Math.max(max, project.Id), 0);
    
    const newProject = {
      name: projectData.name,
      description: projectData.description,
      leadId: projectData.leadId,
      status: projectData.status || 'Active',
      bugCount: projectData.bugCount || 0,
      teamMembers: projectData.teamMembers || [],
      bugPriorityDefault: projectData.bugPriorityDefault || 'Medium',
      environments: projectData.environments || ['Development', 'Staging', 'Production'],
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    };
    
    this.projects.push(newProject);
    return { ...newProject };
  }

  async update(id, updateData) {
    await this.delay();
    
    const index = this.projects.findIndex(project => project.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Project with Id ${id} not found`);
    }
    
    this.projects[index] = {
      ...this.projects[index],
      ...updateData
    };
    
    return { ...this.projects[index] };
  }

  async delete(id) {
    await this.delay();
    
    const index = this.projects.findIndex(project => project.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Project with Id ${id} not found`);
    }
    
    const deletedProject = { ...this.projects[index] };
    this.projects.splice(index, 1);
    return deletedProject;
  }

  async getByStatus(status) {
    await this.delay();
    return this.projects.filter(project => project.status === status);
  }

  async getByLead(leadId) {
    await this.delay();
    return this.projects.filter(project => project.leadId === leadId.toString());
  }
}

export const projectService = new ProjectService();