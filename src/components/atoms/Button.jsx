import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  className, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 focus:ring-primary-500 hover:scale-105 hover:shadow-lg",
    secondary: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500 hover:scale-102",
    outline: "border border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 hover:scale-102",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-primary-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 hover:scale-105",
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2",
    xl: "px-8 py-4 text-lg gap-3",
  };

  const IconComponent = icon ? ApperIcon : null;

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" size={16} className="animate-spin" />
      )}
      
      {!loading && IconComponent && iconPosition === "left" && (
        <IconComponent name={icon} size={size === "sm" ? 14 : size === "lg" ? 18 : size === "xl" ? 20 : 16} />
      )}
      
      {children}
      
      {!loading && IconComponent && iconPosition === "right" && (
        <IconComponent name={icon} size={size === "sm" ? 14 : size === "lg" ? 18 : size === "xl" ? 20 : 16} />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;