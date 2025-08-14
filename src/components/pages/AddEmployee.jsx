import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { useEmployees } from "@/hooks/useEmployees";
import { useDepartments } from "@/hooks/useDepartments";
import { toast } from "react-toastify";

const AddEmployee = () => {
  const navigate = useNavigate();
  const { createEmployee } = useEmployees();
  const { departments } = useDepartments();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    startDate: "",
    status: "Active",
    manager: "",
    location: "",
    photo: "",
  });

  const [activeTab, setActiveTab] = useState("personal");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const roleOptions = [
    { value: "Manager", label: "Manager" },
    { value: "Developer", label: "Developer" },
    { value: "Designer", label: "Designer" },
    { value: "HR", label: "HR" },
    { value: "Analyst", label: "Analyst" },
  ];

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "On Leave", label: "On Leave" },
    { value: "Inactive", label: "Inactive" },
  ];

  const departmentOptions = departments.map(dept => ({
    value: dept.name,
    label: dept.name,
  }));

  const tabs = [
    { id: "personal", label: "Personal Info", icon: "User" },
    { id: "job", label: "Job Details", icon: "Briefcase" },
    { id: "contact", label: "Contact Info", icon: "Phone" },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const employeeData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
      };

      await createEmployee(employeeData);
      toast.success("Employee added successfully");
      navigate("/employees");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
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

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Add New Employee</h1>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6 mb-8">
            {activeTab === "personal" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  error={errors.firstName}
                />
                <Input
                  label="Last Name"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  error={errors.lastName}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Photo URL"
                    value={formData.photo}
                    onChange={(e) => handleInputChange("photo", e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              </div>
            )}

            {activeTab === "job" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FilterDropdown
                    label="Role"
                    options={roleOptions}
                    value={formData.role}
                    onChange={(option) => handleInputChange("role", option.value)}
                    placeholder="Select role"
                  />
                  <FilterDropdown
                    label="Department"
                    options={departmentOptions}
                    value={formData.department}
                    onChange={(option) => handleInputChange("department", option.value)}
                    placeholder="Select department"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Start Date"
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    error={errors.startDate}
                  />
                  <FilterDropdown
                    label="Status"
                    options={statusOptions}
                    value={formData.status}
                    onChange={(option) => handleInputChange("status", option.value)}
                  />
                </div>
                <Input
                  label="Manager"
                  value={formData.manager}
                  onChange={(e) => handleInputChange("manager", e.target.value)}
                  placeholder="Manager name"
                />
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-6">
                <Input
                  label="Email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  error={errors.email}
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                />
                <Input
                  label="Location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Office location or remote"
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => navigate("/employees")}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              icon="Save"
              loading={loading}
            >
              Add Employee
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddEmployee;