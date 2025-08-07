import userData from "@/services/mockData/users.json";

class UserService {
  constructor() {
    // Load initial data
    this.users = [...userData];
  }

  // Simulate API delay
  delay(ms = 150) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.users];
  }

  async getById(id) {
    await this.delay();
    const user = this.users.find(user => user.Id === parseInt(id));
    if (!user) {
      throw new Error(`User with Id ${id} not found`);
    }
    return { ...user };
  }

  async create(userData) {
    await this.delay();
    
    // Find highest existing Id and add 1
    const maxId = this.users.reduce((max, user) => Math.max(max, user.Id), 0);
    
    const newUser = {
      ...userData,
      Id: maxId + 1
    };
    
    this.users.push(newUser);
    return { ...newUser };
  }

  async update(id, updateData) {
    await this.delay();
    
    const index = this.users.findIndex(user => user.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`User with Id ${id} not found`);
    }
    
    this.users[index] = {
      ...this.users[index],
      ...updateData
    };
    
    return { ...this.users[index] };
  }

  async delete(id) {
    await this.delay();
    
    const index = this.users.findIndex(user => user.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`User with Id ${id} not found`);
    }
    
    const deletedUser = { ...this.users[index] };
    this.users.splice(index, 1);
    return deletedUser;
  }

  async getByRole(role) {
    await this.delay();
    return this.users.filter(user => user.role === role);
  }

  async getByEmail(email) {
    await this.delay();
    const user = this.users.find(user => user.email.toLowerCase() === email.toLowerCase());
    return user ? { ...user } : null;
  }
}

export const userService = new UserService();