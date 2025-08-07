import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by creating your first item.",
  icon = "Inbox",
  action,
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4", className)}>
      <div className="bg-gray-50 rounded-full p-4 mb-6">
        <ApperIcon name={icon} className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center mb-8 max-w-md">{description}</p>
      {action && (
        <div className="space-y-4">
          {action}
        </div>
      )}
    </div>
  );
};

export default Empty;