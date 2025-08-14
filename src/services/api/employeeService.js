import employeesData from "@/services/mockData/employees.json";

class EmployeeService {
  constructor() {
    this.employees = [...employeesData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.employees];
  }

  async getById(id) {
    await this.delay(200);
    const employee = this.employees.find(emp => emp.Id === parseInt(id));
    return employee ? { ...employee } : null;
  }

  async create(employeeData) {
    await this.delay(400);
    const newId = Math.max(...this.employees.map(emp => emp.Id)) + 1;
    const newEmployee = {
      ...employeeData,
      Id: newId,
    };
    this.employees.push(newEmployee);
    return { ...newEmployee };
  }

  async update(id, employeeData) {
    await this.delay(400);
    const index = this.employees.findIndex(emp => emp.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Employee not found");
    }
    
    this.employees[index] = {
      ...this.employees[index],
      ...employeeData,
      Id: parseInt(id),
    };
    
    return { ...this.employees[index] };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.employees.findIndex(emp => emp.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Employee not found");
    }
    
    const deletedEmployee = { ...this.employees[index] };
    this.employees.splice(index, 1);
    return deletedEmployee;
  }

  async searchEmployees(query) {
    await this.delay(200);
    const lowercaseQuery = query.toLowerCase();
    return this.employees.filter(emp => 
      emp.firstName.toLowerCase().includes(lowercaseQuery) ||
      emp.lastName.toLowerCase().includes(lowercaseQuery) ||
      emp.email.toLowerCase().includes(lowercaseQuery) ||
      emp.role.toLowerCase().includes(lowercaseQuery) ||
      emp.department.toLowerCase().includes(lowercaseQuery)
    );
  }

  async filterByDepartment(department) {
    await this.delay(200);
    if (!department) return [...this.employees];
    return this.employees.filter(emp => emp.department === department);
  }

  async filterByRole(role) {
    await this.delay(200);
    if (!role) return [...this.employees];
    return this.employees.filter(emp => emp.role === role);
  }

  async getRecentEmployees(limit = 5) {
    await this.delay(200);
    return [...this.employees]
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      .slice(0, limit);
  }
async getLeaveRequests(employeeId) {
    await this.delay(200);
    // This would normally fetch from a leave requests service
    // For now, we'll return empty array as leave requests are managed separately
    return [];
  }

  async getEmployeeAvailability(employeeId, startDate, endDate) {
    await this.delay(200);
    // This would calculate availability based on leave requests
    // For now, return available (no leaves)
    return {
      employeeId,
      available: true,
      leaveRequests: []
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new EmployeeService();