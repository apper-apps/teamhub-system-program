import { useState, useEffect } from "react";
import leaveService from "@/services/api/leaveService";

export const useLeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLeaves = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await leaveService.getAll();
      setLeaves(data);
    } catch (err) {
      setError(err.message || "Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const createLeave = async (leaveData) => {
    try {
      const newLeave = await leaveService.create(leaveData);
      setLeaves(prev => [...prev, newLeave]);
      return newLeave;
    } catch (err) {
      throw new Error(err.message || "Failed to create leave request");
    }
  };

  const updateLeave = async (id, leaveData) => {
    try {
      const updatedLeave = await leaveService.update(id, leaveData);
      setLeaves(prev => 
        prev.map(leave => leave.Id === parseInt(id) ? updatedLeave : leave)
      );
      return updatedLeave;
    } catch (err) {
      throw new Error(err.message || "Failed to update leave request");
    }
  };

  const updateLeaveStatus = async (id, status, approvedBy = null, rejectionReason = null) => {
    try {
      const updatedLeave = await leaveService.updateStatus(id, status, approvedBy, rejectionReason);
      setLeaves(prev => 
        prev.map(leave => leave.Id === parseInt(id) ? updatedLeave : leave)
      );
      return updatedLeave;
    } catch (err) {
      throw new Error(err.message || "Failed to update leave status");
    }
  };

  const deleteLeave = async (id) => {
    try {
      await leaveService.delete(id);
      setLeaves(prev => prev.filter(leave => leave.Id !== parseInt(id)));
    } catch (err) {
      throw new Error(err.message || "Failed to delete leave request");
    }
  };

  const getLeavesByDateRange = async (startDate, endDate) => {
    try {
      return await leaveService.getByDateRange(startDate, endDate);
    } catch (err) {
      throw new Error(err.message || "Failed to get leaves by date range");
    }
  };

  const getEmployeeLeaves = async (employeeId) => {
    try {
      return await leaveService.getByEmployeeId(employeeId);
    } catch (err) {
      throw new Error(err.message || "Failed to get employee leaves");
    }
  };

  const getUpcomingLeaves = async (days = 30) => {
    try {
      return await leaveService.getUpcomingLeaves(days);
    } catch (err) {
      throw new Error(err.message || "Failed to get upcoming leaves");
    }
  };

  return {
    leaves,
    loading,
    error,
    createLeave,
    updateLeave,
    updateLeaveStatus,
    deleteLeave,
    getLeavesByDateRange,
    getEmployeeLeaves,
    getUpcomingLeaves,
    refetch: loadLeaves,
  };
};