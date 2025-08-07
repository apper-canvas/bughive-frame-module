import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Reports = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-2">Generate detailed reports and export your bug tracking data</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Button variant="secondary" icon="Settings">
            Report Settings
          </Button>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-full p-6 mb-6">
          <ApperIcon name="FileText" className="h-16 w-16 text-emerald-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced Reports Coming Soon</h2>
        <p className="text-lg text-gray-600 text-center max-w-2xl mb-8">
          We're developing powerful reporting tools to help you generate comprehensive reports 
          for stakeholders, track project progress, and export data in multiple formats.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          <div className="card text-center">
            <div className="p-3 bg-blue-100 rounded-lg inline-flex mb-4">
              <ApperIcon name="Calendar" className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Weekly Reports</h3>
            <p className="text-gray-600 text-sm">
              Automated weekly summaries of bug status and team progress
            </p>
          </div>

          <div className="card text-center">
            <div className="p-3 bg-green-100 rounded-lg inline-flex mb-4">
              <ApperIcon name="Download" className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Export</h3>
            <p className="text-gray-600 text-sm">
              Export bug data in CSV, PDF, and Excel formats
            </p>
          </div>

          <div className="card text-center">
            <div className="p-3 bg-purple-100 rounded-lg inline-flex mb-4">
              <ApperIcon name="Target" className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Reports</h3>
            <p className="text-gray-600 text-sm">
              Build custom reports with filters and specific metrics
            </p>
          </div>

          <div className="card text-center">
            <div className="p-3 bg-orange-100 rounded-lg inline-flex mb-4">
              <ApperIcon name="Mail" className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Reports</h3>
            <p className="text-gray-600 text-sm">
              Scheduled email delivery of reports to stakeholders
            </p>
          </div>

          <div className="card text-center">
            <div className="p-3 bg-red-100 rounded-lg inline-flex mb-4">
              <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Issue Summary</h3>
            <p className="text-gray-600 text-sm">
              Comprehensive summaries of critical issues and resolutions
            </p>
          </div>

          <div className="card text-center">
            <div className="p-3 bg-indigo-100 rounded-lg inline-flex mb-4">
              <ApperIcon name="Clock" className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Time Tracking</h3>
            <p className="text-gray-600 text-sm">
              Reports on time spent resolving bugs and productivity metrics
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 mt-8">
          <Button icon="Bell">
            Get Notified
          </Button>
          <Button variant="secondary" icon="MessageSquare">
            Suggest Report Types
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Download" className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">Export Current Bug List</span>
              </div>
              <ApperIcon name="ChevronRight" className="h-4 w-4 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <ApperIcon name="FileText" className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">Generate Project Summary</span>
              </div>
              <ApperIcon name="ChevronRight" className="h-4 w-4 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Calendar" className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">Schedule Report</span>
              </div>
              <ApperIcon name="ChevronRight" className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Templates</h3>
          <p className="text-gray-600 mb-4">
            Pre-built report templates will be available to help you quickly generate 
            common reports for different stakeholders and use cases.
          </p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <span>Executive Summary Template</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <span>Developer Progress Report</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <span>QA Testing Summary</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <span>Sprint Retrospective</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;