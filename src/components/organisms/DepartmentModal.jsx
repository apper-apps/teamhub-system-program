import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import ApperIcon from "@/components/ApperIcon";

const DepartmentModal = ({ isOpen, onClose, department, onSave, employees = [] }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    employeeCount: "",
    managerId: "",
  });

  const [activeTab, setActiveTab] = useState("details");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.Name || "",
        description: department.description_c || "",
        employeeCount: department.employee_count_c?.toString() || "",
        managerId: department.manager_id_c?.Id || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        employeeCount: "",
        managerId: "",
      });
    }
    setActiveTab("details");
    setErrors({});
  }, [department, isOpen]);

  const managerOptions = employees.map(emp => ({
    value: emp.Id,
    label: `${emp.first_name_c} ${emp.last_name_c}`,
  }));

  const tabs = [
    { id: "details", label: "Department Details", icon: "Building2" },
    { id: "settings", label: "Settings", icon: "Settings" },
  ];

const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Department name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    
    // Only validate employeeCount if a value is provided
    if (formData.employeeCount && formData.employeeCount.trim()) {
      if (isNaN(formData.employeeCount) || parseInt(formData.employeeCount) < 0) {
        newErrors.employeeCount = "Please enter a valid employee count";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

const departmentData = {
      Name: formData.name,
      description_c: formData.description,
      employee_count_c: parseInt(formData.employeeCount),
      manager_id_c: formData.managerId ? parseInt(formData.managerId) : null,
    };

    if (department) {
      departmentData.Id = department.Id;
    }

    onSave(departmentData);
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
                  {department ? "Edit Department" : "Add New Department"}
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
                {activeTab === "details" && (
                  <div className="space-y-4">
                    <Input
                      label="Department Name"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      error={errors.name}
                      placeholder="Enter department name"
                    />
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.description ? "border-red-500" : "border-gray-300"
                        }`}
                        rows={3}
                        placeholder="Describe the department's purpose and responsibilities"
                      />
                      {errors.description && (
                        <p className="text-sm text-red-600">{errors.description}</p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "settings" && (
                  <div className="space-y-4">
                    <Input
                      label="Employee Count"
                      type="number"
                      value={formData.employeeCount}
                      onChange={(e) => handleInputChange("employeeCount", e.target.value)}
                      error={errors.employeeCount}
                      placeholder="Number of employees"
                      min="0"
                    />
                    <FilterDropdown
                      label="Department Manager"
                      options={managerOptions}
                      value={formData.managerId}
                      onChange={(option) => handleInputChange("managerId", option.value)}
                      placeholder="Select department manager"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse sm:gap-3">
              <Button type="submit" variant="primary" icon="Save">
                {department ? "Update Department" : "Add Department"}
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

export default DepartmentModal;