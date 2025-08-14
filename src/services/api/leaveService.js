class LeaveService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'leave_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "employee_id_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "request_date_c" } },
          { field: { Name: "approved_by_c" } },
          { field: { Name: "approved_date_c" } },
          { field: { Name: "rejection_reason_c" } }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Map database fields to UI fields
      return response.data.map(leave => ({
        Id: leave.Id,
        employeeId: leave.employee_id_c?.Id || leave.employee_id_c,
        startDate: leave.start_date_c || '',
        endDate: leave.end_date_c || '',
        type: leave.type_c || '',
        status: leave.status_c || 'Pending',
        reason: leave.reason_c || '',
        requestDate: leave.request_date_c || '',
        approvedBy: leave.approved_by_c || null,
        approvedDate: leave.approved_date_c || null,
        rejectionReason: leave.rejection_reason_c || null
      }));
    } catch (error) {
      console.error("Error fetching leaves:", error.message);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "employee_id_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "request_date_c" } },
          { field: { Name: "approved_by_c" } },
          { field: { Name: "approved_date_c" } },
          { field: { Name: "rejection_reason_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      // Map database fields to UI fields
      const leave = response.data;
      return {
        Id: leave.Id,
        employeeId: leave.employee_id_c?.Id || leave.employee_id_c,
        startDate: leave.start_date_c || '',
        endDate: leave.end_date_c || '',
        type: leave.type_c || '',
        status: leave.status_c || 'Pending',
        reason: leave.reason_c || '',
        requestDate: leave.request_date_c || '',
        approvedBy: leave.approved_by_c || null,
        approvedDate: leave.approved_date_c || null,
        rejectionReason: leave.rejection_reason_c || null
      };
    } catch (error) {
      console.error(`Error fetching leave with ID ${id}:`, error.message);
      return null;
    }
  }

  async getByEmployeeId(employeeId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "employee_id_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "request_date_c" } },
          { field: { Name: "approved_by_c" } },
          { field: { Name: "approved_date_c" } },
          { field: { Name: "rejection_reason_c" } }
        ],
        where: [
          {
            FieldName: "employee_id_c",
            Operator: "EqualTo",
            Values: [parseInt(employeeId)]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Map database fields to UI fields
      return response.data.map(leave => ({
        Id: leave.Id,
        employeeId: leave.employee_id_c?.Id || leave.employee_id_c,
        startDate: leave.start_date_c || '',
        endDate: leave.end_date_c || '',
        type: leave.type_c || '',
        status: leave.status_c || 'Pending',
        reason: leave.reason_c || '',
        requestDate: leave.request_date_c || '',
        approvedBy: leave.approved_by_c || null,
        approvedDate: leave.approved_date_c || null,
        rejectionReason: leave.rejection_reason_c || null
      }));
    } catch (error) {
      console.error("Error fetching leaves by employee ID:", error.message);
      return [];
    }
  }

  async getByDateRange(startDate, endDate) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "employee_id_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "request_date_c" } },
          { field: { Name: "approved_by_c" } },
          { field: { Name: "approved_date_c" } },
          { field: { Name: "rejection_reason_c" } }
        ],
        whereGroups: [
          {
            operator: "AND",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "start_date_c",
                    operator: "LessThanOrEqualTo",
                    values: [endDate]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "end_date_c",
                    operator: "GreaterThanOrEqualTo",
                    values: [startDate]
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

      // Map database fields to UI fields
      return response.data.map(leave => ({
        Id: leave.Id,
        employeeId: leave.employee_id_c?.Id || leave.employee_id_c,
        startDate: leave.start_date_c || '',
        endDate: leave.end_date_c || '',
        type: leave.type_c || '',
        status: leave.status_c || 'Pending',
        reason: leave.reason_c || '',
        requestDate: leave.request_date_c || '',
        approvedBy: leave.approved_by_c || null,
        approvedDate: leave.approved_date_c || null,
        rejectionReason: leave.rejection_reason_c || null
      }));
    } catch (error) {
      console.error("Error fetching leaves by date range:", error.message);
      return [];
    }
  }

  async create(leaveData) {
    try {
      // Map UI fields to database fields, only Updateable fields
      const dbData = {
        Name: `Leave Request - ${leaveData.type}`,
        employee_id_c: parseInt(leaveData.employeeId),
        start_date_c: leaveData.startDate,
        end_date_c: leaveData.endDate,
        type_c: leaveData.type || 'Vacation',
        status_c: leaveData.status || 'Pending',
        reason_c: leaveData.reason || '',
        request_date_c: leaveData.requestDate || new Date().toISOString(),
        approved_by_c: leaveData.approvedBy || null,
        approved_date_c: leaveData.approvedDate || null,
        rejection_reason_c: leaveData.rejectionReason || null
      };

      const params = {
        records: [dbData]
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
          console.error(`Failed to create leave ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const newLeave = successfulRecords[0].data;
          return {
            Id: newLeave.Id,
            employeeId: newLeave.employee_id_c?.Id || newLeave.employee_id_c,
            startDate: newLeave.start_date_c || '',
            endDate: newLeave.end_date_c || '',
            type: newLeave.type_c || '',
            status: newLeave.status_c || 'Pending',
            reason: newLeave.reason_c || '',
            requestDate: newLeave.request_date_c || '',
            approvedBy: newLeave.approved_by_c || null,
            approvedDate: newLeave.approved_date_c || null,
            rejectionReason: newLeave.rejection_reason_c || null
          };
        }
      }
    } catch (error) {
      console.error("Error creating leave:", error.message);
      throw error;
    }
  }

  async update(id, leaveData) {
    try {
      // Map UI fields to database fields, only Updateable fields
      const dbData = {
        Id: parseInt(id),
        Name: `Leave Request - ${leaveData.type}`,
        employee_id_c: parseInt(leaveData.employeeId),
        start_date_c: leaveData.startDate,
        end_date_c: leaveData.endDate,
        type_c: leaveData.type || 'Vacation',
        status_c: leaveData.status || 'Pending',
        reason_c: leaveData.reason || '',
        request_date_c: leaveData.requestDate || new Date().toISOString(),
        approved_by_c: leaveData.approvedBy || null,
        approved_date_c: leaveData.approvedDate || null,
        rejection_reason_c: leaveData.rejectionReason || null
      };

      const params = {
        records: [dbData]
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
          console.error(`Failed to update leave ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedLeave = successfulUpdates[0].data;
          return {
            Id: updatedLeave.Id,
            employeeId: updatedLeave.employee_id_c?.Id || updatedLeave.employee_id_c,
            startDate: updatedLeave.start_date_c || '',
            endDate: updatedLeave.end_date_c || '',
            type: updatedLeave.type_c || '',
            status: updatedLeave.status_c || 'Pending',
            reason: updatedLeave.reason_c || '',
            requestDate: updatedLeave.request_date_c || '',
            approvedBy: updatedLeave.approved_by_c || null,
            approvedDate: updatedLeave.approved_date_c || null,
            rejectionReason: updatedLeave.rejection_reason_c || null
          };
        }
      }
    } catch (error) {
      console.error("Error updating leave:", error.message);
      throw error;
    }
  }

  async updateStatus(id, status, approvedBy = null, rejectionReason = null) {
    try {
      const currentLeave = await this.getById(id);
      if (!currentLeave) {
        throw new Error("Leave request not found");
      }

      const dbData = {
        Id: parseInt(id),
        status_c: status,
        approved_by_c: status !== "Pending" ? approvedBy : null,
        approved_date_c: status !== "Pending" ? new Date().toISOString() : null,
        rejection_reason_c: status === "Rejected" ? rejectionReason : null
      };

      const params = {
        records: [dbData]
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
          console.error(`Failed to update leave status ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedLeave = successfulUpdates[0].data;
          return {
            Id: updatedLeave.Id,
            employeeId: updatedLeave.employee_id_c?.Id || updatedLeave.employee_id_c,
            startDate: updatedLeave.start_date_c || '',
            endDate: updatedLeave.end_date_c || '',
            type: updatedLeave.type_c || '',
            status: updatedLeave.status_c || 'Pending',
            reason: updatedLeave.reason_c || '',
            requestDate: updatedLeave.request_date_c || '',
            approvedBy: updatedLeave.approved_by_c || null,
            approvedDate: updatedLeave.approved_date_c || null,
            rejectionReason: updatedLeave.rejection_reason_c || null
          };
        }
      }
    } catch (error) {
      console.error("Error updating leave status:", error.message);
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
          console.error(`Failed to delete leave ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting leave:", error.message);
      throw error;
    }
  }

  async getLeavesByStatus(status) {
    if (!status) return await this.getAll();
    
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "employee_id_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "request_date_c" } },
          { field: { Name: "approved_by_c" } },
          { field: { Name: "approved_date_c" } },
          { field: { Name: "rejection_reason_c" } }
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

      // Map database fields to UI fields
      return response.data.map(leave => ({
        Id: leave.Id,
        employeeId: leave.employee_id_c?.Id || leave.employee_id_c,
        startDate: leave.start_date_c || '',
        endDate: leave.end_date_c || '',
        type: leave.type_c || '',
        status: leave.status_c || 'Pending',
        reason: leave.reason_c || '',
        requestDate: leave.request_date_c || '',
        approvedBy: leave.approved_by_c || null,
        approvedDate: leave.approved_date_c || null,
        rejectionReason: leave.rejection_reason_c || null
      }));
    } catch (error) {
      console.error("Error fetching leaves by status:", error.message);
      return [];
    }
  }

  async getUpcomingLeaves(days = 30) {
    try {
      const today = new Date().toISOString();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      const futureDateStr = futureDate.toISOString();

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "employee_id_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "request_date_c" } },
          { field: { Name: "approved_by_c" } },
          { field: { Name: "approved_date_c" } },
          { field: { Name: "rejection_reason_c" } }
        ],
        whereGroups: [
          {
            operator: "AND",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "start_date_c",
                    operator: "GreaterThanOrEqualTo",
                    values: [today]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "start_date_c",
                    operator: "LessThanOrEqualTo",
                    values: [futureDateStr]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "status_c",
                    operator: "EqualTo",
                    values: ["Approved"]
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

      // Map database fields to UI fields
      return response.data.map(leave => ({
        Id: leave.Id,
        employeeId: leave.employee_id_c?.Id || leave.employee_id_c,
        startDate: leave.start_date_c || '',
        endDate: leave.end_date_c || '',
        type: leave.type_c || '',
        status: leave.status_c || 'Pending',
        reason: leave.reason_c || '',
        requestDate: leave.request_date_c || '',
        approvedBy: leave.approved_by_c || null,
        approvedDate: leave.approved_date_c || null,
        rejectionReason: leave.rejection_reason_c || null
      }));
    } catch (error) {
      console.error("Error fetching upcoming leaves:", error.message);
      return [];
    }
  }
}

export default new LeaveService();