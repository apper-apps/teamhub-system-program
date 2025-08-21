class EmployeeService {
constructor() {
    try {
      if (!window.ApperSDK) {
        throw new Error('ApperSDK not loaded. Please ensure the SDK script is properly included.');
      }
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      this.tableName = 'employee_c';
    } catch (error) {
      console.error('Failed to initialize EmployeeService:', error.message);
      this.apperClient = null;
      this.tableName = 'employee_c';
    }
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "photo_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "manager_c" } },
          { field: { Name: "location_c" } }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Map database fields to UI fields
      return response.data.map(emp => ({
        Id: emp.Id,
        firstName: emp.first_name_c || '',
        lastName: emp.last_name_c || '',
        email: emp.email_c || '',
        phone: emp.phone_c || '',
        photo: emp.photo_c || '',
        role: emp.role_c || '',
        department: emp.department_c || '',
        startDate: emp.start_date_c || '',
        status: emp.status_c || 'Active',
        manager: emp.manager_c || '',
        location: emp.location_c || ''
      }));
    } catch (error) {
      console.error("Error fetching employees:", error.message);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "photo_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "manager_c" } },
          { field: { Name: "location_c" } }
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
      const emp = response.data;
      return {
        Id: emp.Id,
        firstName: emp.first_name_c || '',
        lastName: emp.last_name_c || '',
        email: emp.email_c || '',
        phone: emp.phone_c || '',
        photo: emp.photo_c || '',
        role: emp.role_c || '',
        department: emp.department_c || '',
        startDate: emp.start_date_c || '',
        status: emp.status_c || 'Active',
        manager: emp.manager_c || '',
        location: emp.location_c || ''
      };
    } catch (error) {
      console.error(`Error fetching employee with ID ${id}:`, error.message);
      return null;
    }
  }

  async create(employeeData) {
    try {
      // Map UI fields to database fields, only Updateable fields
      const dbData = {
        Name: `${employeeData.firstName} ${employeeData.lastName}`,
        first_name_c: employeeData.firstName || '',
        last_name_c: employeeData.lastName || '',
        email_c: employeeData.email || '',
        phone_c: employeeData.phone || '',
        photo_c: employeeData.photo || '',
        role_c: employeeData.role || '',
        department_c: employeeData.department || '',
        start_date_c: employeeData.startDate || '',
        status_c: employeeData.status || 'Active',
        manager_c: employeeData.manager || '',
        location_c: employeeData.location || ''
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
          console.error(`Failed to create employee ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const newEmp = successfulRecords[0].data;
          return {
            Id: newEmp.Id,
            firstName: newEmp.first_name_c || '',
            lastName: newEmp.last_name_c || '',
            email: newEmp.email_c || '',
            phone: newEmp.phone_c || '',
            photo: newEmp.photo_c || '',
            role: newEmp.role_c || '',
            department: newEmp.department_c || '',
            startDate: newEmp.start_date_c || '',
            status: newEmp.status_c || 'Active',
            manager: newEmp.manager_c || '',
            location: newEmp.location_c || ''
          };
        }
      }
    } catch (error) {
      console.error("Error creating employee:", error.message);
      throw error;
    }
  }

  async update(id, employeeData) {
    try {
      // Map UI fields to database fields, only Updateable fields
      const dbData = {
        Id: parseInt(id),
        Name: `${employeeData.firstName} ${employeeData.lastName}`,
        first_name_c: employeeData.firstName || '',
        last_name_c: employeeData.lastName || '',
        email_c: employeeData.email || '',
        phone_c: employeeData.phone || '',
        photo_c: employeeData.photo || '',
        role_c: employeeData.role || '',
        department_c: employeeData.department || '',
        start_date_c: employeeData.startDate || '',
        status_c: employeeData.status || 'Active',
        manager_c: employeeData.manager || '',
        location_c: employeeData.location || ''
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
          console.error(`Failed to update employee ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedEmp = successfulUpdates[0].data;
          return {
            Id: updatedEmp.Id,
            firstName: updatedEmp.first_name_c || '',
            lastName: updatedEmp.last_name_c || '',
            email: updatedEmp.email_c || '',
            phone: updatedEmp.phone_c || '',
            photo: updatedEmp.photo_c || '',
            role: updatedEmp.role_c || '',
            department: updatedEmp.department_c || '',
            startDate: updatedEmp.start_date_c || '',
            status: updatedEmp.status_c || 'Active',
            manager: updatedEmp.manager_c || '',
            location: updatedEmp.location_c || ''
          };
        }
      }
    } catch (error) {
      console.error("Error updating employee:", error.message);
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
          console.error(`Failed to delete employee ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting employee:", error.message);
      throw error;
    }
  }

  async searchEmployees(query) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "photo_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "manager_c" } },
          { field: { Name: "location_c" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "first_name_c",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "last_name_c",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "email_c",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "role_c",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "department_c",
                    operator: "Contains",
                    values: [query]
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
      return response.data.map(emp => ({
        Id: emp.Id,
        firstName: emp.first_name_c || '',
        lastName: emp.last_name_c || '',
        email: emp.email_c || '',
        phone: emp.phone_c || '',
        photo: emp.photo_c || '',
        role: emp.role_c || '',
        department: emp.department_c || '',
        startDate: emp.start_date_c || '',
        status: emp.status_c || 'Active',
        manager: emp.manager_c || '',
        location: emp.location_c || ''
      }));
    } catch (error) {
      console.error("Error searching employees:", error.message);
      return [];
    }
  }

  async filterByDepartment(department) {
    if (!department) return await this.getAll();
    
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "photo_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "manager_c" } },
          { field: { Name: "location_c" } }
        ],
        where: [
          {
            FieldName: "department_c",
            Operator: "EqualTo",
            Values: [department]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Map database fields to UI fields
      return response.data.map(emp => ({
        Id: emp.Id,
        firstName: emp.first_name_c || '',
        lastName: emp.last_name_c || '',
        email: emp.email_c || '',
        phone: emp.phone_c || '',
        photo: emp.photo_c || '',
        role: emp.role_c || '',
        department: emp.department_c || '',
        startDate: emp.start_date_c || '',
        status: emp.status_c || 'Active',
        manager: emp.manager_c || '',
        location: emp.location_c || ''
      }));
    } catch (error) {
      console.error("Error filtering employees by department:", error.message);
      return [];
    }
  }

  async filterByRole(role) {
    if (!role) return await this.getAll();
    
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "photo_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "manager_c" } },
          { field: { Name: "location_c" } }
        ],
        where: [
          {
            FieldName: "role_c",
            Operator: "EqualTo",
            Values: [role]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Map database fields to UI fields
      return response.data.map(emp => ({
        Id: emp.Id,
        firstName: emp.first_name_c || '',
        lastName: emp.last_name_c || '',
        email: emp.email_c || '',
        phone: emp.phone_c || '',
        photo: emp.photo_c || '',
        role: emp.role_c || '',
        department: emp.department_c || '',
        startDate: emp.start_date_c || '',
        status: emp.status_c || 'Active',
        manager: emp.manager_c || '',
        location: emp.location_c || ''
      }));
    } catch (error) {
      console.error("Error filtering employees by role:", error.message);
      return [];
    }
  }

  async getRecentEmployees(limit = 5) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "photo_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "manager_c" } },
          { field: { Name: "location_c" } }
        ],
        orderBy: [
          {
            fieldName: "start_date_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Map database fields to UI fields
      return response.data.map(emp => ({
        Id: emp.Id,
        firstName: emp.first_name_c || '',
        lastName: emp.last_name_c || '',
        email: emp.email_c || '',
        phone: emp.phone_c || '',
        photo: emp.photo_c || '',
        role: emp.role_c || '',
        department: emp.department_c || '',
        startDate: emp.start_date_c || '',
        status: emp.status_c || 'Active',
        manager: emp.manager_c || '',
        location: emp.location_c || ''
      }));
    } catch (error) {
      console.error("Error fetching recent employees:", error.message);
      return [];
    }
  }

  async getLeaveRequests(employeeId) {
    // This method returns empty array as leave requests are managed by leaveService
    return [];
  }

  async getEmployeeAvailability(employeeId, startDate, endDate) {
    // This would calculate availability based on leave requests
    // For now, return available (no leaves)
    return {
      employeeId,
      available: true,
      leaveRequests: []
    };
  }
}

export default new EmployeeService();