import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = "increase",
  icon,
  gradient = false,
  className = ""
}) => {
  const getChangeColor = () => {
    if (changeType === "increase") return "text-green-600";
    if (changeType === "decrease") return "text-red-600";
    return "text-gray-600";
  };

  const getChangeIcon = () => {
    if (changeType === "increase") return "TrendingUp";
    if (changeType === "decrease") return "TrendingDown";
    return "Minus";
  };

  return (
    <Card className={`${className}`} hover>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${gradient ? "gradient-text" : "text-gray-900"}`}>
            {value}
          </p>
          {change && (
            <div className={`flex items-center gap-1 text-sm ${getChangeColor()}`}>
              <ApperIcon name={getChangeIcon()} size={14} />
              <span>{change}</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="h-12 w-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
            <ApperIcon name={icon} className="h-6 w-6 text-primary-600" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;