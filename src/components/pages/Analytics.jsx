import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Analytics = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Insights and trends for your bug tracking data</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Button variant="secondary" icon="Download">
            Export Data
          </Button>
          <Button variant="secondary" icon="RefreshCw">
            Refresh
          </Button>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-gradient-to-br from-primary/10 to-blue-100 rounded-full p-6 mb-6">
          <ApperIcon name="BarChart3" className="h-16 w-16 text-primary" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard Coming Soon</h2>
        <p className="text-lg text-gray-600 text-center max-w-2xl mb-8">
          We're building comprehensive analytics tools to help you track bug trends, team performance, 
          and project health metrics. Stay tuned for powerful insights into your development workflow.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="card text-center">
            <div className="p-3 bg-blue-100 rounded-lg inline-flex mb-4">
              <ApperIcon name="TrendingUp" className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bug Trends</h3>
            <p className="text-gray-600 text-sm">
              Track bug creation, resolution, and backlog trends over time
            </p>
          </div>

          <div className="card text-center">
            <div className="p-3 bg-green-100 rounded-lg inline-flex mb-4">
              <ApperIcon name="Users" className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Performance</h3>
            <p className="text-gray-600 text-sm">
              Analyze individual and team productivity metrics
            </p>
          </div>

          <div className="card text-center">
            <div className="p-3 bg-purple-100 rounded-lg inline-flex mb-4">
              <ApperIcon name="PieChart" className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Health</h3>
            <p className="text-gray-600 text-sm">
              Monitor project status, priority distribution, and resolution rates
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 mt-8">
          <Button icon="Bell">
            Notify Me When Ready
          </Button>
          <Button variant="secondary" icon="MessageSquare">
            Request Features
          </Button>
        </div>
      </div>

      {/* Feature Preview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Features</h3>
          <ul className="space-y-3">
            <li className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <span className="text-gray-700">Real-time dashboard with live metrics</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <span className="text-gray-700">Interactive charts and visualizations</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <span className="text-gray-700">Custom reporting and data exports</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <span className="text-gray-700">Predictive analytics for bug patterns</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <span className="text-gray-700">Team workload balancing insights</span>
            </li>
          </ul>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Involved</h3>
          <p className="text-gray-600 mb-4">
            Help us prioritize which analytics features matter most to your team. 
            Your feedback shapes our development roadmap.
          </p>
          <div className="flex flex-col space-y-3">
            <Button variant="secondary" size="sm" icon="MessageSquare">
              Share Feedback
            </Button>
            <Button variant="ghost" size="sm" icon="ExternalLink">
              Join Beta Testing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;