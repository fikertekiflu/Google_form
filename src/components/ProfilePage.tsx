import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft,
  User,
  Camera,
  Edit,
  Save,
  X,
  Bell,
  Shield,
  Palette,
  Settings,
  Key,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';

interface ProfilePageProps {
  onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    firstName: 'Fikerte',
    lastName: 'Kiflu',
    email: 'fikerte.kiflu@formflow.com',
    phone: '+1 (555) 123-4567',
    location: 'Addis Ababa, Ethiopia',
    bio: 'Form builder enthusiast and UX designer. Creating beautiful forms that users love to fill out.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    joinDate: 'March 2023'
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    marketingEmails: false,
    darkMode: false,
    autoSave: true,
    twoFactorAuth: false
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Palette }
  ];

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profile saved:', profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
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
                <User className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Profile Settings
              </h1>
            </div>
          </div>
          
          {isEditing && (
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl border-gray-300/50 hover:bg-gray-50/80 transition-all duration-300"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#673AB7] to-[#5E35B1] hover:from-[#5E35B1] hover:to-[#4A148C] text-white shadow-lg transition-all duration-300"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6 sticky top-8 shadow-lg">
              {/* Profile Avatar */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <img
                    src={profileData.avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                  {isEditing && (
                    <Button
                      size="icon"
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-[#673AB7] to-[#5E35B1] hover:from-[#5E35B1] hover:to-[#4A148C] shadow-lg"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mt-4">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <p className="text-gray-500 text-sm">{profileData.email}</p>
                <p className="text-xs text-gray-400 mt-1">Member since {profileData.joinDate}</p>
              </div>

              {/* Navigation Tabs */}
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-[#673AB7] to-[#5E35B1] text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {activeTab === 'profile' && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-8 shadow-lg">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="h-5 w-5 text-[#673AB7]" />
                    <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                  </div>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 rounded-xl border-gray-300/50 hover:bg-gray-50/80 transition-all duration-300"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <Input
                        value={profileData.firstName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <Input
                        value={profileData.lastName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full rounded-xl"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full rounded-xl"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full rounded-xl"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <Input
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full rounded-xl"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#673AB7]/50 disabled:bg-gray-50/50 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Notification Settings</h3>
                  <div className="space-y-4">
                    {Object.entries(settings).slice(0, 4).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100/50 last:border-b-0">
                        <div>
                          <h4 className="font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {key === 'emailNotifications' && 'Receive email notifications about your forms'}
                            {key === 'pushNotifications' && 'Get push notifications in your browser'}
                            {key === 'weeklyReports' && 'Receive weekly summary reports'}
                            {key === 'marketingEmails' && 'Receive promotional emails and updates'}
                          </p>
                        </div>
                        <Button
                          variant={value ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleSettingChange(key, !value)}
                          className={value ? "bg-gradient-to-r from-[#673AB7] to-[#5E35B1] hover:from-[#5E35B1] hover:to-[#4A148C] rounded-xl" : "rounded-xl"}
                        >
                          {value ? 'On' : 'Off'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">App Preferences</h3>
                  <div className="space-y-4">
                    {Object.entries(settings).slice(4).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100/50 last:border-b-0">
                        <div>
                          <h4 className="font-medium text-gray-900 capitalize">
                            {key === 'darkMode' ? 'Dark Mode' : key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {key === 'darkMode' && 'Use dark theme for the application'}
                            {key === 'autoSave' && 'Automatically save your work'}
                            {key === 'twoFactorAuth' && 'Enable two-factor authentication'}
                          </p>
                        </div>
                        <Button
                          variant={value ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleSettingChange(key, !value)}
                          className={value ? "bg-gradient-to-r from-[#673AB7] to-[#5E35B1] hover:from-[#5E35B1] hover:to-[#4A148C] rounded-xl" : "rounded-xl"}
                        >
                          {value ? 'On' : 'Off'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h3>
                <div className="space-y-8">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Change Password</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter current password"
                            className="w-full pr-10 rounded-xl"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <Input
                          type="password"
                          placeholder="Enter new password"
                          className="w-full rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <Input
                          type="password"
                          placeholder="Confirm new password"
                          className="w-full rounded-xl"
                        />
                      </div>
                      <Button className="px-4 py-2 bg-gradient-to-r from-[#673AB7] to-[#5E35B1] hover:from-[#5E35B1] hover:to-[#4A148C] text-white rounded-xl shadow-lg">
                        Update Password
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-gray-200/50 pt-6">
                    <h4 className="font-medium text-gray-900 mb-4">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                    <Button variant="outline" className="px-4 py-2 rounded-xl">
                      <Key className="h-4 w-4 mr-2" />
                      Setup 2FA
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Preferences</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select className="w-full px-3 py-2 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#673AB7]/50 bg-white/80">
                      <option value="en">English (US)</option>
                      <option value="am">Amharic</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select className="w-full px-3 py-2 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#673AB7]/50 bg-white/80">
                      <option value="east-africa">East Africa Time (EAT)</option>
                      <option value="pt">Pacific Time (PT)</option>
                      <option value="mt">Mountain Time (MT)</option>
                      <option value="ct">Central Time (CT)</option>
                      <option value="et">Eastern Time (ET)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                    <select className="w-full px-3 py-2 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#673AB7]/50 bg-white/80">
                      <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                      <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                      <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
