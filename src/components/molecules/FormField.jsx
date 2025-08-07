import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  error, 
  required = false,
  className,
  children 
}) => {
  return (
    <div className={cn("form-group", className)}>
      {label && (
        <label className={cn(
          "form-label",
          required && "after:content-['*'] after:ml-0.5 after:text-red-500"
        )}>
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;