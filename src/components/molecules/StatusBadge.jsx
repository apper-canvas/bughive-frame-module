import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatusBadge = ({ status, className }) => {
  const statusConfig = {
    Open: {
      color: "status-open",
      icon: "Circle",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800"
    },
    "In Progress": {
      color: "status-in-progress",
      icon: "Clock",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800"
    },
    Resolved: {
      color: "status-resolved",
      icon: "CheckCircle",
      bgColor: "bg-green-100",
      textColor: "text-green-800"
    },
    Closed: {
      color: "status-closed",
      icon: "XCircle",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800"
    }
  };

  const config = statusConfig[status] || statusConfig.Open;

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
      config.bgColor,
      config.textColor,
      className
    )}>
      <ApperIcon name={config.icon} className="h-3 w-3 mr-1" />
      {status}
    </span>
  );
};

export default StatusBadge;