import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PriorityBadge = ({ priority, className }) => {
  const priorityConfig = {
    Critical: {
      color: "priority-critical",
      icon: "AlertCircle",
      bgColor: "bg-red-100",
      textColor: "text-red-800"
    },
    High: {
      color: "priority-high",
      icon: "ArrowUp",
      bgColor: "bg-orange-100",
      textColor: "text-orange-800"
    },
    Medium: {
      color: "priority-medium",
      icon: "Minus",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800"
    },
    Low: {
      color: "priority-low",
      icon: "ArrowDown",
      bgColor: "bg-green-100",
      textColor: "text-green-800"
    }
  };

  const config = priorityConfig[priority] || priorityConfig.Medium;

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
      config.bgColor,
      config.textColor,
      className
    )}>
      <ApperIcon name={config.icon} className="h-3 w-3 mr-1" />
      {priority}
    </span>
  );
};

export default PriorityBadge;