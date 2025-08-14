import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import EmployeeModal from "@/components/organisms/EmployeeModal";
import ApperIcon from "@/components/ApperIcon";
import employeeService from "@/services/api/employeeService";
import { useDepartments } from "@/hooks/useDepartments";
import { toast } from "react-toastify";
import { format } from "date-fns";

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { departments } = useDepartments();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadEmployee = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await employeeService.getById(id);
      if (!data) {
        setError("Employee not found");
      } else {
        setEmployee(data);
      }
    } catch (err) {
      setError(err.message || "Failed to load employee");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployee();
  }, [id]);

  const handleUpdateEmployee = async (employeeData) => {
    try {
      const updatedEmployee = await employeeService.update(id, employeeData);
      setEmployee(updatedEmployee);
      setIsModalOpen(false);
      toast.success("Employee updated successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteEmployee = async () => {
    if (window.confirm("Are you sure you want to delete this employee? This action cannot be undone.")) {
      try {
        await employeeService.delete(id);
        toast.success("Employee deleted successfully");
        navigate("/employees");
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadEmployee} />;
  }

  if (!employee) {
    return <Error message="Employee not found" />;
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "Active": return "success";
      case "On Leave": return "warning";
      case "Inactive": return "error";
      default: return "default";
    }
  };

  const getRoleBadgeColor = (role) => {
    const roleColors = {
      "Manager": "primary",
      "Developer": "info",
      "Designer": "secondary", 
      "HR": "warning",
      "Analyst": "default",
    };
    return roleColors[role] || "default";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          icon="ArrowLeft"
          onClick={() => navigate("/employees")}
          className="text-gray-600"
        >
          Back to Employees
        </Button>
      </div>

      {/* Employee Profile Header */}
      <Card className="text-center">
        <div className="relative">
          <Avatar 
            src={employee.photo}
            name={`${employee.firstName} ${employee.lastName}`}
            size="xl"
            className="mx-auto mb-4"
          />
          
          <div className="absolute top-0 right-4">
            <div className={`h-4 w-4 rounded-full border-2 border-white ${
              employee.status === "Active" ? "bg-green-500" : 
              employee.status === "On Leave" ? "bg-yellow-500" : 
              "bg-gray-400"
            }`} />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {employee.firstName} {employee.lastName}
        </h1>
        
        <p className="text-gray-600 mb-4">{employee.email}</p>
        
        <div className="flex justify-center gap-3 mb-6">
          <Badge variant={getRoleBadgeColor(employee.role)}>
            {employee.role}
          </Badge>
          <Badge variant={getStatusVariant(employee.status)}>
            {employee.status}
          </Badge>
        </div>
        
        <div className="flex justify-center gap-3">
          <Button
            variant="primary"
            icon="Edit"
            onClick={() => setIsModalOpen(true)}
          >
            Edit Employee
          </Button>
          <Button
            variant="danger"
            icon="Trash2"
            onClick={handleDeleteEmployee}
          >
            Delete Employee
          </Button>
        </div>
      </Card>

      {/* Employee Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="User" className="h-5 w-5 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="text-gray-900 mt-1">{employee.firstName} {employee.lastName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900 mt-1">{employee.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-gray-900 mt-1">{employee.phone || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Location</label>
              <p className="text-gray-900 mt-1">{employee.location || "Not specified"}</p>
            </div>
          </div>
        </Card>

        {/* Job Information */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Briefcase" className="h-5 w-5 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Job Information</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Role</label>
              <p className="text-gray-900 mt-1">{employee.role}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Department</label>
              <p className="text-gray-900 mt-1">{employee.department}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Manager</label>
              <p className="text-gray-900 mt-1">{employee.manager || "Not assigned"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Start Date</label>
              <p className="text-gray-900 mt-1">
                {format(new Date(employee.startDate), "MMMM d, yyyy")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <Badge variant={getStatusVariant(employee.status)}>
                  {employee.status}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
            <ApperIcon name="Clock" className="h-5 w-5 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Employment Timeline</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
              <ApperIcon name="UserPlus" className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Joined the team</p>
              <p className="text-xs text-gray-500">
                {format(new Date(employee.startDate), "MMMM d, yyyy")}
              </p>
            </div>
          </div>
          
          {employee.status === "Active" && (
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
              <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                <ApperIcon name="CheckCircle" className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Currently active</p>
                <p className="text-xs text-gray-500">Employee is currently active and working</p>
              </div>
            </div>
          )}
          
          {employee.status === "On Leave" && (
            <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
              <div className="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <ApperIcon name="Pause" className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Currently on leave</p>
                <p className="text-xs text-gray-500">Employee is temporarily away</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={employee}
        onSave={handleUpdateEmployee}
        departments={departments}
      />
    </div>
  );
};

export default EmployeeDetail;