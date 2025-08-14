import React from "react";
import { cn } from "@/utils/cn";

const Card = ({ 
  children, 
  className, 
  hover = false,
  padding = "md",
  ...props 
}) => {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6", 
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 shadow-sm",
        hover && "card-hover cursor-pointer",
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;