class DepartmentService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'department_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "manager_id_c" } },
          { field: { Name: "employee_count_c" } },
          { field: { Name: "description_c" } }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Map database fields to UI fields
      return response.data.map(dept => ({
        Id: dept.Id,
        name: dept.Name || '',
        managerId: dept.manager_id_c || '',
        employeeCount: dept.employee_count_c || 0,
        description: dept.description_c || ''
      }));
    } catch (error) {
      console.error("Error fetching departments:", error.message);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "manager_id_c" } },
          { field: { Name: "employee_count_c" } },
          { field: { Name: "description_c" } }
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
      const dept = response.data;
      return {
        Id: dept.Id,
        name: dept.Name || '',
        managerId: dept.manager_id_c || '',
        employeeCount: dept.employee_count_c || 0,
        description: dept.description_c || ''
      };
    } catch (error) {
      console.error(`Error fetching department with ID ${id}:`, error.message);
      return null;
    }
  }

  async create(departmentData) {
    try {
      // Map UI fields to database fields, only Updateable fields
      const dbData = {
        Name: departmentData.name || '',
        manager_id_c: departmentData.managerId ? parseInt(departmentData.managerId) : null,
        employee_count_c: departmentData.employeeCount || 0,
        description_c: departmentData.description || ''
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
          console.error(`Failed to create department ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const newDept = successfulRecords[0].data;
          return {
            Id: newDept.Id,
            name: newDept.Name || '',
            managerId: newDept.manager_id_c || '',
            employeeCount: newDept.employee_count_c || 0,
            description: newDept.description_c || ''
          };
        }
      }
    } catch (error) {
      console.error("Error creating department:", error.message);
      throw error;
    }
  }

  async update(id, departmentData) {
    try {
      // Map UI fields to database fields, only Updateable fields
      const dbData = {
        Id: parseInt(id),
        Name: departmentData.name || '',
        manager_id_c: departmentData.managerId ? parseInt(departmentData.managerId) : null,
        employee_count_c: departmentData.employeeCount || 0,
        description_c: departmentData.description || ''
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
          console.error(`Failed to update department ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedDept = successfulUpdates[0].data;
          return {
            Id: updatedDept.Id,
            name: updatedDept.Name || '',
            managerId: updatedDept.manager_id_c || '',
            employeeCount: updatedDept.employee_count_c || 0,
            description: updatedDept.description_c || ''
          };
        }
      }
    } catch (error) {
      console.error("Error updating department:", error.message);
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
          console.error(`Failed to delete department ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting department:", error.message);
      throw error;
    }
  }
}

export default new DepartmentService();