import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Plus,
  Folder,
  Star,
  Trash2,
  BarChart3,
  Download,
  Upload,
  Settings,
  User,
  HelpCircle,
  LogOut,
  FileText,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  Mail
} from 'lucide-react';

interface MenuPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const MenuPage: React.FC<MenuPageProps> = ({ onBack, onNavigate }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const menuItems = [
    { id: 'forms', label: 'My Forms', icon: FileText, count: 24, description: 'All your created forms' },
    { id: 'shared', label: 'Shared with me', icon: Users, count: 8, description: 'Forms shared by others' },
    { id: 'starred', label: 'Starred', icon: Star, count: 5, description: 'Your favorite forms' },
    { id: 'trash', label: 'Trash', icon: Trash2, count: 12, description: 'Deleted forms' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, count: null, description: 'Form performance insights' }
  ];

  const quickActions = [
    { id: 'create', label: 'Create New Form', icon: Plus, description: 'Start building a new form' },
    { id: 'import', label: 'Import Form', icon: Upload, description: 'Import existing forms' },
    { id: 'export', label: 'Export Data', icon: Download, description: 'Export your form data' },
    { id: 'templates', label: 'Template Gallery', icon: Folder, description: 'Browse form templates' }
  ];

  const recentActivity = [
    { id: 1, action: 'Created', form: 'Customer Feedback Survey', time: '2 hours ago', type: 'create' },
    { id: 2, action: 'Received', form: 'Event Registration Form', time: '1 day ago', type: 'share' },
    { id: 3, action: 'Updated', form: 'Employee Satisfaction Survey', time: '2 days ago', type: 'edit' },
    { id: 4, action: 'Starred', form: 'Product Order Form', time: '3 days ago', type: 'star' }
  ];

  const statistics = [
    { label: 'Total Forms', value: '24', change: '+12%', trend: 'up' },
    { label: 'Active Responses', value: '1,247', change: '+8%', trend: 'up' },
    { label: 'Completion Rate', value: '87%', change: '+3%', trend: 'up' },
    { label: 'Avg. Response Time', value: '2.3 min', change: '-15%', trend: 'down' }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 px-3 py-2 rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#673AB7] to-[#5E35B1] rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                FormFlow Dashboard
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => onNavigate('create')}
              className="px-4 py-2 rounded-xl border-gray-300 hover:bg-gray-50 transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Form
            </Button>
            <Button
              onClick={() => onNavigate('create')}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#673AB7] to-[#5E35B1] hover:from-[#5E35B1] hover:to-[#4A148C] text-white shadow-lg transition-all duration-300"
            >
              Create
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statistics.map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
                <div className={`flex items-center space-x-1 text-xs ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingUp className="h-3 w-3 rotate-180" />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Access */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Navigation */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Access</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-200/50 hover:border-[#673AB7]/30 hover:bg-gradient-to-r hover:from-[#673AB7]/5 hover:to-[#5E35B1]/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:from-[#673AB7]/10 group-hover:to-[#5E35B1]/10 transition-all duration-300">
                        <item.icon className="h-5 w-5 text-gray-600 group-hover:text-[#673AB7] transition-colors duration-300" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900 group-hover:text-[#673AB7] transition-colors duration-300">
                          {item.label}
                        </h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    {item.count !== null && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => onNavigate(action.id)}
                    className="flex items-center space-x-3 p-4 rounded-xl border border-gray-200/50 hover:border-[#673AB7]/30 hover:bg-gradient-to-r hover:from-[#673AB7]/5 hover:to-[#5E35B1]/5 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#673AB7]/10 to-[#5E35B1]/10 rounded-xl flex items-center justify-center group-hover:from-[#673AB7]/20 group-hover:to-[#5E35B1]/20 transition-all duration-300">
                      <action.icon className="h-5 w-5 text-[#673AB7] group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">{action.label}</h3>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Profile */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#673AB7] to-[#5E35B1] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <h3 className="font-semibold text-gray-900">Fikerte Kiflu</h3>
                <p className="text-sm text-gray-500">fikerte.kiflu@formflow.com</p>
              </div>
              
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-xl">
                  <User className="h-4 w-4 mr-3" />
                  Profile Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-xl">
                  <HelpCircle className="h-4 w-4 mr-3" />
                  Help & Support
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-xl">
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50/80 transition-colors duration-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#673AB7]/10 to-[#5E35B1]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-4 w-4 text-[#673AB7]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.action}</span> {activity.form}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
