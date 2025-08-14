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
      
      return response.data || [];
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
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching department with ID ${id}:`, error.message);
      throw error;
    }
  }

  async create(departmentData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: departmentData.Name,
          manager_id_c: departmentData.manager_id_c ? parseInt(departmentData.manager_id_c) : null,
          employee_count_c: departmentData.employee_count_c ? parseInt(departmentData.employee_count_c) : null,
          description_c: departmentData.description_c
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create department ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create department');
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error creating department:", error.message);
      throw error;
    }
  }

  async update(id, departmentData) {
    try {
      // Only include Updateable fields plus Id
      const params = {
        records: [{
          Id: parseInt(id),
          Name: departmentData.Name,
          manager_id_c: departmentData.manager_id_c ? parseInt(departmentData.manager_id_c) : null,
          employee_count_c: departmentData.employee_count_c ? parseInt(departmentData.employee_count_c) : null,
          description_c: departmentData.description_c
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update department ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update department');
        }
        
        return response.results[0].data;
      }
    } catch (error) {
      console.error(`Error updating department with ID ${id}:`, error.message);
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
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete department ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to delete department');
        }
        
        return true;
      }
    } catch (error) {
      console.error(`Error deleting department with ID ${id}:`, error.message);
      throw error;
    }
  }

}

export default new DepartmentService();