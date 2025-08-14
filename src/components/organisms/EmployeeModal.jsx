import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const EmployeeModal = ({ isOpen, onClose, employee, onSave, departments = [] }) => {
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

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        email: employee.email || "",
        phone: employee.phone || "",
        role: employee.role || "",
        department: employee.department || "",
        startDate: employee.startDate ? format(new Date(employee.startDate), "yyyy-MM-dd") : "",
        status: employee.status || "Active",
        manager: employee.manager || "",
        location: employee.location || "",
        photo: employee.photo || "",
      });
    } else {
      setFormData({
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
    }
    setActiveTab("personal");
    setErrors({});
  }, [employee, isOpen]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const employeeData = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
    };

    if (employee) {
      employeeData.Id = employee.Id;
    }

    onSave(employeeData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 pt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {employee ? "Edit Employee" : "Add New Employee"}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <ApperIcon name="X" size={24} />
                </button>
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
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {activeTab === "personal" && (
                  <div className="grid grid-cols-2 gap-4">
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
                    <div className="col-span-2">
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
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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
                    <div className="grid grid-cols-2 gap-4">
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
                  <div className="space-y-4">
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
            </div>

            <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse sm:gap-3">
              <Button type="submit" variant="primary" icon="Save">
                {employee ? "Update Employee" : "Add Employee"}
              </Button>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;