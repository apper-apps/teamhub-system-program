import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.", 
  actionLabel = "Get Started", 
  onAction,
  icon = "Users"
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto animate-fade-in">
        <div className="mb-6">
          <div className="h-16 w-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name={icon} className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 mb-6">
            {description}
          </p>
        </div>
        
        {onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 hover:scale-105"
          >
            <ApperIcon name="Plus" size={16} />
            {actionLabel}
          </button>
        )}
        
        <div className="mt-8 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <ApperIcon name="Lightbulb" size={16} className="inline mr-2 text-primary-500" />
            Start building your team by adding employee profiles and organizing departments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Empty;