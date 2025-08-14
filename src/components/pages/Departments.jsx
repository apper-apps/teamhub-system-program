import React, { useState } from "react";
import DepartmentModal from "@/components/organisms/DepartmentModal";
import { useDepartments } from "@/hooks/useDepartments";
import { useEmployees } from "@/hooks/useEmployees";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Employees from "@/components/pages/Employees";
import departmentService from "@/services/api/departmentService";
const Departments = () => {
  const { departments, loading: departmentsLoading, error: departmentsError, refetch } = useDepartments();
  const { employees } = useEmployees();
  
  const [showModal, setShowModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleCreateDepartment = () => {
    setSelectedDepartment(null);
    setShowModal(true);
  };

  const handleEditDepartment = (department) => {
    setSelectedDepartment(department);
    setShowModal(true);
  };

const handleSaveDepartment = async (departmentData) => {
    setSaving(true);
    try {
      if (selectedDepartment) {
        await departmentService.update(departmentData.Id, departmentData);
        toast.success("Department updated successfully!");
      } else {
        await departmentService.create(departmentData);
        toast.success("Department created successfully!");
      }
      setShowModal(false);
      setSelectedDepartment(null);
      refetch();
    } catch (error) {
      console.error("Error saving department:", error);
      toast.error("Failed to save department. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (departmentsLoading) {
    return <Loading />;
  }

  if (departmentsError) {
    return <Error message={departmentsError} onRetry={refetch} />;
  }

  if (departments.length === 0) {
    return (
      <Empty
        title="No departments found"
        description="Start organizing your team by creating your first department."
        actionLabel="Create Department"
onAction={handleCreateDepartment}
        icon="Building2"
      />
    );
  }

  const getDepartmentEmployees = (departmentName) => {
    return employees.filter(emp => emp.department === departmentName);
  };

  const getDepartmentManager = (departmentName) => {
    const deptEmployees = getDepartmentEmployees(departmentName);
    return deptEmployees.find(emp => emp.role === "Manager");
  };

  const getDepartmentIcon = (departmentName) => {
    const icons = {
      "Engineering": "Code",
      "Design": "Palette",
      "Human Resources": "Users",
      "Operations": "Cog",
      "Executive": "Crown",
    };
    return icons[departmentName] || "Building2";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
            <p className="text-gray-600 mt-1">
              Manage your {departments.length} departments and team organization
            </p>
          </div>
          <div className="flex items-center gap-3">
<Button
              variant="primary"
              icon="Plus"
              onClick={handleCreateDepartment}
            >
              Add Department
            </Button>
          </div>
        </div>
      </div>

      {/* Department Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{departments.map((department) => {
          const deptEmployees = getDepartmentEmployees(department.Name);
          const manager = getDepartmentManager(department.Name);
          
          return (
            <Card key={department.Id} hover className="group">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                  <ApperIcon 
                    name={getDepartmentIcon(department.Name)} 
                    className="h-6 w-6 text-primary-600" 
                  />
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="MoreVertical"
                    className="text-gray-400 hover:text-gray-600"
                  />
                </div>
              </div>
              
<h3 className="text-lg font-semibold text-gray-900 mb-2">
                {department.Name}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {department.description_c}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Team Size</span>
                  <span className="text-sm font-medium text-gray-900">
                    {deptEmployees.length} {deptEmployees.length === 1 ? "employee" : "employees"}
                  </span>
                </div>
                
                {manager && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Manager</span>
                    <span className="text-sm font-medium text-gray-900">
                      {manager.firstName} {manager.lastName}
                    </span>
                  </div>
                )}
                
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {deptEmployees.slice(0, 3).map((emp, index) => (
                        <div
                          key={emp.Id}
                          className="h-6 w-6 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 border-2 border-white flex items-center justify-center text-xs font-medium text-primary-700"
                        >
                          {emp.firstName[0]}{emp.lastName[0]}
                        </div>
                      ))}
                      {deptEmployees.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                          +{deptEmployees.length - 3}
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="ArrowRight"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      View Team
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold gradient-text">
                {employees.length}
              </p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Departments</p>
              <p className="text-2xl font-bold text-gray-900">
                {departments.length}
              </p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="Building2" className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
<Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Team Size</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(employees.length / departments.length)}
              </p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="BarChart3" className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      <DepartmentModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedDepartment(null);
        }}
        department={selectedDepartment}
        onSave={handleSaveDepartment}
        employees={employees || []}
      />
    </div>
  );
};

export default Departments;