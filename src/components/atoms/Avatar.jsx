import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Avatar = ({ 
  src, 
  alt, 
  name, 
  size = "md", 
  className,
  fallbackIcon = "User"
}) => {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-lg",
    xl: "h-20 w-20 text-xl",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
  };

  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    return names.length > 1 
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={cn(
          "rounded-full object-cover border-2 border-white shadow-sm",
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div className={cn(
      "rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center font-medium text-primary-700 border-2 border-white shadow-sm",
      sizes[size],
      className
    )}>
      {name ? getInitials(name) : <ApperIcon name={fallbackIcon} size={iconSizes[size]} />}
    </div>
  );
};

export default Avatar;