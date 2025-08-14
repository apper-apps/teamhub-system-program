import { useState, useEffect } from "react";
import employeeService from "@/services/api/employeeService";

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      setError(err.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const createEmployee = async (employeeData) => {
    try {
      const newEmployee = await employeeService.create(employeeData);
      setEmployees(prev => [...prev, newEmployee]);
      return newEmployee;
    } catch (err) {
      throw new Error(err.message || "Failed to create employee");
    }
  };

  const updateEmployee = async (id, employeeData) => {
    try {
      const updatedEmployee = await employeeService.update(id, employeeData);
      setEmployees(prev => 
        prev.map(emp => emp.Id === parseInt(id) ? updatedEmployee : emp)
      );
      return updatedEmployee;
    } catch (err) {
      throw new Error(err.message || "Failed to update employee");
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await employeeService.delete(id);
      setEmployees(prev => prev.filter(emp => emp.Id !== parseInt(id)));
    } catch (err) {
      throw new Error(err.message || "Failed to delete employee");
    }
  };

  const searchEmployees = async (query) => {
    try {
      setLoading(true);
      setError("");
      const data = await employeeService.searchEmployees(query);
      setEmployees(data);
    } catch (err) {
      setError(err.message || "Failed to search employees");
    } finally {
      setLoading(false);
    }
  };

const getEmployeeAvailability = async (employeeId, startDate, endDate) => {
    try {
      return await employeeService.getEmployeeAvailability(employeeId, startDate, endDate);
    } catch (err) {
      throw new Error(err.message || "Failed to get employee availability");
    }
  };

  const getEmployeeLeaveRequests = async (employeeId) => {
    try {
      return await employeeService.getLeaveRequests(employeeId);
    } catch (err) {
      throw new Error(err.message || "Failed to get employee leave requests");
    }
  };

  return {
    employees,
    loading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployees,
    getEmployeeAvailability,
    getEmployeeLeaveRequests,
    refetch: loadEmployees,
  };
};