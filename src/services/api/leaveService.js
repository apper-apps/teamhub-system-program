import leavesData from "@/services/mockData/leaves.json";

class LeaveService {
  constructor() {
    this.leaves = [...leavesData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.leaves];
  }

  async getById(id) {
    await this.delay(200);
    const leave = this.leaves.find(leave => leave.Id === parseInt(id));
    return leave ? { ...leave } : null;
  }

  async getByEmployeeId(employeeId) {
    await this.delay(200);
    return this.leaves.filter(leave => leave.employeeId === parseInt(employeeId));
  }

  async getByDateRange(startDate, endDate) {
    await this.delay(300);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.leaves.filter(leave => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      
      // Check if leave overlaps with the date range
      return leaveStart <= end && leaveEnd >= start;
    });
  }

  async create(leaveData) {
    await this.delay(400);
    const newId = Math.max(...this.leaves.map(leave => leave.Id)) + 1;
    const newLeave = {
      ...leaveData,
      Id: newId,
      requestDate: new Date().toISOString(),
      status: "Pending",
      approvedBy: null,
      approvedDate: null
    };
    this.leaves.push(newLeave);
    return { ...newLeave };
  }

  async update(id, leaveData) {
    await this.delay(400);
    const index = this.leaves.findIndex(leave => leave.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Leave request not found");
    }
    
    this.leaves[index] = {
      ...this.leaves[index],
      ...leaveData,
      Id: parseInt(id),
    };
    
    return { ...this.leaves[index] };
  }

  async updateStatus(id, status, approvedBy = null, rejectionReason = null) {
    await this.delay(300);
    const index = this.leaves.findIndex(leave => leave.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Leave request not found");
    }
    
    this.leaves[index] = {
      ...this.leaves[index],
      status,
      approvedBy: status !== "Pending" ? approvedBy : null,
      approvedDate: status !== "Pending" ? new Date().toISOString() : null,
      rejectionReason: status === "Rejected" ? rejectionReason : null
    };
    
    return { ...this.leaves[index] };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.leaves.findIndex(leave => leave.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Leave request not found");
    }
    
    const deletedLeave = { ...this.leaves[index] };
    this.leaves.splice(index, 1);
    return deletedLeave;
  }

  async getLeavesByStatus(status) {
    await this.delay(200);
    if (!status) return [...this.leaves];
    return this.leaves.filter(leave => leave.status === status);
  }

  async getUpcomingLeaves(days = 30) {
    await this.delay(200);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return this.leaves.filter(leave => {
      const leaveStart = new Date(leave.startDate);
      const today = new Date();
      return leaveStart >= today && leaveStart <= futureDate && leave.status === "Approved";
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new LeaveService();