import { forwardRef } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  children, 
  ...props 
}, ref) => {
  const baseClasses = "btn inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 active:scale-[0.98] focus:ring-primary shadow-sm",
    secondary: "bg-white text-secondary border border-gray-300 hover:bg-gray-50 active:scale-[0.98] focus:ring-primary shadow-sm",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:scale-[0.98] focus:ring-primary",
    danger: "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] focus:ring-red-500 shadow-sm",
    success: "bg-green-600 text-white hover:bg-green-700 active:scale-[0.98] focus:ring-green-500 shadow-sm",
    warning: "bg-yellow-600 text-white hover:bg-yellow-700 active:scale-[0.98] focus:ring-yellow-500 shadow-sm"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-md",
    lg: "px-6 py-3 text-base rounded-lg",
    xl: "px-8 py-4 text-lg rounded-lg"
  };

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={loading}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
      )}
      {icon && iconPosition === "left" && !loading && (
        <ApperIcon name={icon} className="h-4 w-4 mr-2" />
      )}
      {children}
      {icon && iconPosition === "right" && !loading && (
        <ApperIcon name={icon} className="h-4 w-4 ml-2" />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;