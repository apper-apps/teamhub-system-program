import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const EmployeeCard = ({ employee, onEdit, onDelete }) => {
  const navigate = useNavigate();

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
    <Card hover className="text-center group">
      <div className="relative">
        <Avatar 
          src={employee.photo} 
          name={`${employee.firstName} ${employee.lastName}`}
          size="lg"
          className="mx-auto mb-4"
        />
        
        <div className="absolute -top-1 -right-1">
          <div className={`h-4 w-4 rounded-full border-2 border-white ${
            employee.status === "Active" ? "bg-green-500" : 
            employee.status === "On Leave" ? "bg-yellow-500" : 
            "bg-gray-400"
          }`} />
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {employee.firstName} {employee.lastName}
      </h3>
      
      <p className="text-sm text-gray-600 mb-3">{employee.email}</p>
      
      <div className="space-y-2 mb-4">
        <Badge variant={getRoleBadgeColor(employee.role)} size="sm">
          {employee.role}
        </Badge>
        <div className="text-xs text-gray-500">{employee.department}</div>
      </div>
      
      <Badge variant={getStatusVariant(employee.status)} size="sm" className="mb-4">
        {employee.status}
      </Badge>
      
      <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          variant="ghost"
          size="sm"
          icon="Eye"
          onClick={() => navigate(`/employees/${employee.Id}`)}
          className="text-gray-600 hover:text-primary-600"
        />
        <Button
          variant="ghost"
          size="sm"
          icon="Edit"
          onClick={() => onEdit(employee)}
          className="text-gray-600 hover:text-primary-600"
        />
        <Button
          variant="ghost"
          size="sm"
          icon="Trash2"
          onClick={() => onDelete(employee.Id)}
          className="text-gray-600 hover:text-red-600"
        />
      </div>
    </Card>
  );
};

export default EmployeeCard;