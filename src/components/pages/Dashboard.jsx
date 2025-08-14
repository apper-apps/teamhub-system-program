import React from "react";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useEmployees } from "@/hooks/useEmployees";
import { useDepartments } from "@/hooks/useDepartments";
import { format } from "date-fns";

const Dashboard = () => {
  const { employees, loading: employeesLoading, error: employeesError, refetch: refetchEmployees } = useEmployees();
  const { departments, loading: departmentsLoading, error: departmentsError, refetch: refetchDepartments } = useDepartments();

  const loading = employeesLoading || departmentsLoading;
  const error = employeesError || departmentsError;

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={() => {
          refetchEmployees();
          refetchDepartments();
        }} 
      />
    );
  }

  if (employees.length === 0) {
    return (
      <Empty
        title="Welcome to TeamHub!"
        description="Start building your team by adding your first employee."
        actionLabel="Add First Employee"
        onAction={() => window.location.href = "/employees/new"}
        icon="Users"
      />
    );
  }

  const activeEmployees = employees.filter(emp => emp.status === "Active");
  const recentEmployees = [...employees]
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    .slice(0, 5);

  const totalEmployees = employees.length;
  const totalDepartments = departments.length;
  const newThisMonth = employees.filter(emp => {
    const startDate = new Date(emp.startDate);
    const thisMonth = new Date();
    return startDate.getMonth() === thisMonth.getMonth() && 
           startDate.getFullYear() === thisMonth.getFullYear();
  }).length;

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
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to TeamHub</h1>
        <p className="text-primary-100">
          Manage your team efficiently with our comprehensive employee management system.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          change={`${newThisMonth} new this month`}
          changeType="increase"
          icon="Users"
          gradient={true}
        />
        <StatCard
          title="Active Employees"
          value={activeEmployees.length}
          change={`${((activeEmployees.length / totalEmployees) * 100).toFixed(1)}% active`}
          changeType="neutral"
          icon="UserCheck"
        />
        <StatCard
          title="Departments"
          value={totalDepartments}
          change="5 active departments"
          changeType="neutral"
          icon="Building2"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Employees */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Employees</h3>
            <a 
              href="/employees" 
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
            >
              View all
              <ApperIcon name="ArrowRight" size={14} />
            </a>
          </div>
          
          <div className="space-y-4">
            {recentEmployees.map((employee) => (
              <div key={employee.Id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <div className="flex items-center">
                  <Avatar 
                    src={employee.photo}
                    name={`${employee.firstName} ${employee.lastName}`}
                    size="sm"
                    className="mr-3"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      Started {format(new Date(employee.startDate), "MMM d, yyyy")}
                    </div>
                  </div>
                </div>
                <Badge variant={getRoleBadgeColor(employee.role)} size="sm">
                  {employee.role}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Department Overview */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Department Overview</h3>
            <a 
              href="/departments" 
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
            >
              View all
              <ApperIcon name="ArrowRight" size={14} />
            </a>
          </div>
          
          <div className="space-y-4">
            {departments.map((department) => (
              <div key={department.Id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center mr-3">
                    <ApperIcon name="Building2" className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {department.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {department.description}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {department.employeeCount}
                  </div>
                  <div className="text-xs text-gray-500">employees</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a 
            href="/employees/new"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors duration-200 group"
          >
            <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="UserPlus" className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 group-hover:text-primary-700">
                Add Employee
              </div>
              <div className="text-xs text-gray-500">Create new employee profile</div>
            </div>
          </a>
          
          <a 
            href="/employees"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors duration-200 group"
          >
            <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Users" className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 group-hover:text-primary-700">
                View All Employees
              </div>
              <div className="text-xs text-gray-500">Browse employee directory</div>
            </div>
          </a>
          
          <a 
            href="/departments"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors duration-200 group"
          >
            <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Building2" className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 group-hover:text-primary-700">
                Manage Departments
              </div>
              <div className="text-xs text-gray-500">Organize team structure</div>
            </div>
          </a>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;