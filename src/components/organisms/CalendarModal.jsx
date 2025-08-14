import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";
import { useEmployees } from "@/hooks/useEmployees";
import { toast } from "react-toastify";
import { format } from "date-fns";

const CalendarModal = ({ 
  isOpen, 
  onClose, 
  leaveRequest = null, 
  selectedDate = null,
  onSave,
  onDelete,
  onUpdateStatus 
}) => {
  const { employees } = useEmployees();
  const [formData, setFormData] = useState({
    employeeId: "",
    startDate: "",
    endDate: "",
    type: "Vacation",
    reason: "",
    status: "Pending"
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (leaveRequest) {
      // Editing existing leave request
      setFormData({
        employeeId: leaveRequest.employeeId,
        startDate: format(new Date(leaveRequest.startDate), "yyyy-MM-dd"),
        endDate: format(new Date(leaveRequest.endDate), "yyyy-MM-dd"),
        type: leaveRequest.type,
        reason: leaveRequest.reason || "",
        status: leaveRequest.status
      });
    } else if (selectedDate) {
      // Creating new leave request
      const dateStr = format(new Date(selectedDate), "yyyy-MM-dd");
      setFormData({
        employeeId: "",
        startDate: dateStr,
        endDate: dateStr,
        type: "Vacation",
        reason: "",
        status: "Pending"
      });
    }
  }, [leaveRequest, selectedDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.employeeId || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      setLoading(true);
      const leaveData = {
        ...formData,
        employeeId: parseInt(formData.employeeId),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      };

      await onSave(leaveData);
      
      toast.success(
        leaveRequest 
          ? "Leave request updated successfully" 
          : "Leave request created successfully"
      );
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to save leave request");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!leaveRequest) return;
    
    if (!window.confirm("Are you sure you want to delete this leave request?")) {
      return;
    }

    try {
      setLoading(true);
      await onDelete(leaveRequest.Id);
      toast.success("Leave request deleted successfully");
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to delete leave request");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus, rejectionReason = null) => {
    if (!leaveRequest) return;
    
    try {
      setLoading(true);
      await onUpdateStatus(leaveRequest.Id, newStatus, "Current User", rejectionReason);
      toast.success(`Leave request ${newStatus.toLowerCase()} successfully`);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to update leave status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      "Approved": "success",
      "Pending": "warning", 
      "Rejected": "error"
    };
    return colors[status] || "default";
  };

  const selectedEmployee = employees.find(emp => emp.Id === parseInt(formData.employeeId));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {leaveRequest ? "Edit Leave Request" : "New Leave Request"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={24} />
          </button>
        </div>

        {leaveRequest && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Status</span>
              <Badge variant={getStatusColor(leaveRequest.status)}>
                {leaveRequest.status}
              </Badge>
            </div>
            {leaveRequest.approvedBy && (
              <p className="text-sm text-gray-600">
                {leaveRequest.status} by {leaveRequest.approvedBy} on{" "}
                {format(new Date(leaveRequest.approvedDate), "MMM d, yyyy")}
              </p>
            )}
            {leaveRequest.rejectionReason && (
              <p className="text-sm text-red-600 mt-1">
                Reason: {leaveRequest.rejectionReason}
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee *
            </label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.Id} value={emp.Id}>
                  {emp.firstName} {emp.lastName} - {emp.department}
                </option>
              ))}
            </select>
          </div>

          {selectedEmployee && (
            <div className="flex items-center p-3 bg-primary-50 rounded-lg">
              <Avatar
                src={selectedEmployee.photo}
                name={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
                size="sm"
                className="mr-3"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </p>
                <p className="text-xs text-gray-600">
                  {selectedEmployee.role} - {selectedEmployee.department}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leave Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="Vacation">Vacation</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Personal Leave">Personal Leave</option>
              <option value="Maternity Leave">Maternity Leave</option>
              <option value="Paternity Leave">Paternity Leave</option>
              <option value="Emergency Leave">Emergency Leave</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="Optional: Provide a reason for this leave request"
              disabled={loading}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="flex-1"
            >
              {leaveRequest ? "Update" : "Create"} Request
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>

            {leaveRequest && (
              <Button
                type="button"
                variant="danger"
                onClick={handleDelete}
                disabled={loading}
                icon="Trash2"
              />
            )}
          </div>
        </form>

        {leaveRequest && leaveRequest.status === "Pending" && (
          <div className="flex gap-2 pt-4 mt-4 border-t">
            <Button
              variant="outline"
              onClick={() => handleStatusUpdate("Approved")}
              disabled={loading}
              icon="Check"
              size="sm"
              className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
            >
              Approve
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const reason = window.prompt("Reason for rejection (optional):");
                if (reason !== null) {
                  handleStatusUpdate("Rejected", reason);
                }
              }}
              disabled={loading}
              icon="X"
              size="sm"
              className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
            >
              Reject
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CalendarModal;