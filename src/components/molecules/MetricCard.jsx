import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = "positive",
  icon,
  className 
}) => {
  const changeColor = changeType === "positive" ? "text-green-600" : "text-red-600";
  const changeIcon = changeType === "positive" ? "TrendingUp" : "TrendingDown";

  return (
    <div className={cn("metric-card", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {change && (
              <div className={cn("ml-3 flex items-center text-sm font-medium", changeColor)}>
                <ApperIcon name={changeIcon} className="h-4 w-4 mr-1" />
                {change}
              </div>
            )}
          </div>
        </div>
        {icon && (
          <div className="p-3 bg-primary/10 rounded-lg">
            <ApperIcon name={icon} className="h-6 w-6 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;