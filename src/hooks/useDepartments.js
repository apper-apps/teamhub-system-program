import { useState, useEffect } from "react";
import departmentService from "@/services/api/departmentService";

export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (err) {
      setError(err.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const createDepartment = async (departmentData) => {
    try {
      const newDepartment = await departmentService.create(departmentData);
      setDepartments(prev => [...prev, newDepartment]);
      return newDepartment;
    } catch (err) {
      throw new Error(err.message || "Failed to create department");
    }
  };

  const updateDepartment = async (id, departmentData) => {
    try {
      const updatedDepartment = await departmentService.update(id, departmentData);
      setDepartments(prev => 
        prev.map(dept => dept.Id === parseInt(id) ? updatedDepartment : dept)
      );
      return updatedDepartment;
    } catch (err) {
      throw new Error(err.message || "Failed to update department");
    }
  };

  const deleteDepartment = async (id) => {
    try {
      await departmentService.delete(id);
      setDepartments(prev => prev.filter(dept => dept.Id !== parseInt(id)));
    } catch (err) {
      throw new Error(err.message || "Failed to delete department");
    }
  };

  return {
    departments,
    loading,
    error,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    refetch: loadDepartments,
  };
};