import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import EmployeeCard from "@/components/organisms/EmployeeCard";
import EmployeeTable from "@/components/organisms/EmployeeTable";
import EmployeeModal from "@/components/organisms/EmployeeModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useEmployees } from "@/hooks/useEmployees";
import { useDepartments } from "@/hooks/useDepartments";
import { toast } from "react-toastify";

const Employees = () => {
  const { employees, loading, error, createEmployee, updateEmployee, deleteEmployee, refetch } = useEmployees();
  const { departments } = useDepartments();

  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Filter employees based on search and filters
  useEffect(() => {
    let filtered = [...employees];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.firstName.toLowerCase().includes(query) ||
        emp.lastName.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.role.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query)
      );
    }

    if (departmentFilter) {
      filtered = filtered.filter(emp => emp.department === departmentFilter);
    }

    if (roleFilter) {
      filtered = filtered.filter(emp => emp.role === roleFilter);
    }

    setFilteredEmployees(filtered);
  }, [employees, searchQuery, departmentFilter, roleFilter]);

  const departmentOptions = departments.map(dept => ({
    value: dept.name,
    label: dept.name,
  }));

  const roleOptions = [
    { value: "Manager", label: "Manager" },
    { value: "Developer", label: "Developer" },
    { value: "Designer", label: "Designer" },
    { value: "HR", label: "HR" },
    { value: "Analyst", label: "Analyst" },
  ];

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(employeeId);
        toast.success("Employee deleted successfully");
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleSaveEmployee = async (employeeData) => {
    try {
      if (selectedEmployee) {
        await updateEmployee(selectedEmployee.Id, employeeData);
        toast.success("Employee updated successfully");
      } else {
        await createEmployee(employeeData);
        toast.success("Employee added successfully");
      }
      setIsModalOpen(false);
      setSelectedEmployee(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDepartmentFilter("");
    setRoleFilter("");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={refetch} />;
  }

  if (employees.length === 0) {
    return (
      <Empty
        title="No employees found"
        description="Start building your team by adding your first employee."
        actionLabel="Add First Employee"
        onAction={handleAddEmployee}
        icon="Users"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
            <p className="text-gray-600 mt-1">
              Manage your team of {employees.length} employees
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              icon="UserPlus"
              onClick={handleAddEmployee}
            >
              Add Employee
            </Button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
          <div className="flex-1">
            <SearchBar
              placeholder="Search employees..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-full"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <FilterDropdown
              label="Department"
              options={departmentOptions}
              value={departmentFilter}
              onChange={(option) => setDepartmentFilter(option.value)}
              placeholder="All Departments"
              className="w-full sm:w-48"
            />
            
            <FilterDropdown
              label="Role"
              options={roleOptions}
              value={roleFilter}
              onChange={(option) => setRoleFilter(option.value)}
              placeholder="All Roles"
              className="w-full sm:w-48"
            />
          </div>

          <div className="flex items-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="whitespace-nowrap"
            >
              Clear Filters
            </Button>
            
            <div className="flex border border-gray-300 rounded-lg">
              <Button
                variant={viewMode === "grid" ? "primary" : "ghost"}
                size="sm"
                icon="Grid3X3"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none border-0"
              />
              <Button
                variant={viewMode === "list" ? "primary" : "ghost"}
                size="sm"
                icon="List"
                onClick={() => setViewMode("list")}
                className="rounded-l-none border-0 border-l border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(searchQuery || departmentFilter || roleFilter) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-500">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery("")}>
                  <ApperIcon name="X" size={12} />
                </button>
              </span>
            )}
            {departmentFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                Department: {departmentFilter}
                <button onClick={() => setDepartmentFilter("")}>
                  <ApperIcon name="X" size={12} />
                </button>
              </span>
            )}
            {roleFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                Role: {roleFilter}
                <button onClick={() => setRoleFilter("")}>
                  <ApperIcon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {filteredEmployees.length === 0 ? (
        <Empty
          title="No employees match your search"
          description="Try adjusting your filters or search terms to find employees."
          actionLabel="Clear Filters"
          onAction={clearFilters}
          icon="Search"
        />
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEmployees.map((employee) => (
                <EmployeeCard
                  key={employee.Id}
                  employee={employee}
                  onEdit={handleEditEmployee}
                  onDelete={handleDeleteEmployee}
                />
              ))}
            </div>
          ) : (
            <EmployeeTable
              employees={filteredEmployees}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
            />
          )}
        </>
      )}

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
        departments={departments}
      />
    </div>
  );
};

export default Employees;