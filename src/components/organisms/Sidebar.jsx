import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const navigationItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: "LayoutDashboard",
    },
    {
      name: "Employees",
      path: "/employees",
      icon: "Users",
    },
    {
      name: "Departments",
      path: "/departments",
      icon: "Building2",
    },
    {
      name: "Add Employee",
      path: "/employees/new",
      icon: "UserPlus",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
          <div className="flex items-center h-16 flex-shrink-0 px-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">TeamHub</span>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col pt-5 pb-4">
            <nav className="mt-5 flex-1 px-3 space-y-1">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 border-l-4 border-primary-500"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`
                  }
                >
                  <ApperIcon
                    name={item.icon}
                    className="mr-3 flex-shrink-0 h-5 w-5"
                  />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <ApperIcon name="Settings" className="h-4 w-4 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Settings</p>
                <p className="text-xs text-gray-500">Manage preferences</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 flex z-40">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={onClose}
            />
            
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform duration-300 ease-in-out">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={onClose}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <ApperIcon name="X" className="h-6 w-6 text-white" />
                </button>
              </div>
              
              <div className="flex items-center h-16 flex-shrink-0 px-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Users" className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold gradient-text">TeamHub</span>
                </div>
              </div>
              
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <nav className="mt-5 px-3 space-y-1">
                  {navigationItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.path)}
                      className="group w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <ApperIcon
                        name={item.icon}
                        className="mr-3 flex-shrink-0 h-5 w-5"
                      />
                      {item.name}
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <ApperIcon name="Settings" className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">Settings</p>
                    <p className="text-xs text-gray-500">Manage preferences</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;