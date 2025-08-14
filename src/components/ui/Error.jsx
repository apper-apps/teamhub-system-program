import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message, onRetry }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto animate-fade-in">
        <div className="mb-6">
          <div className="h-16 w-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-6">
            {message || "We encountered an error while loading your data. Please try again."}
          </p>
        </div>
        
        <div className="space-y-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 hover:scale-105"
            >
              <ApperIcon name="RefreshCw" size={16} />
              Try Again
            </button>
          )}
          
          <div className="text-sm text-gray-500">
            If this problem persists, please contact support.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;