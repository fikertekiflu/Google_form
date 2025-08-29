import React, { useState } from 'react';
import type { Form } from '@/types/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  X, 
  Palette, 
  Settings as SettingsIcon, 
  Users, 
  Mail, 
  BarChart3, 
  Lock, 
  Globe,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Save,
  Download,
  Share2,
  Copy,
  Trash2
} from 'lucide-react';

interface FormSettingsProps {
  form: Form;
  onUpdate: (updates: Partial<Form>) => void;
  onClose: () => void;
}

const FormSettings: React.FC<FormSettingsProps> = ({
  form,
  onUpdate,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'responses' | 'theme' | 'advanced'>('general');

  const updateSettings = (settings: Partial<Form['settings']>) => {
    onUpdate({
      settings: { ...form.settings, ...settings }
    });
  };

  const updateTheme = (theme: Partial<Form['settings']['theme']>) => {
    onUpdate({
      settings: {
        ...form.settings,
        theme: { ...form.settings.theme, ...theme }
      }
    });
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving form settings:', form);
    onClose();
  };

  const handleExport = () => {
    const formData = JSON.stringify(form, null, 2);
    const blob = new Blob([formData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title.replace(/\s+/g, '_')}_form.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDuplicate = () => {
    const duplicatedForm = {
      ...form,
      id: crypto.randomUUID(),
      title: `${form.title} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    console.log('Duplicated form:', duplicatedForm);
    // Here you would typically save the duplicated form
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'responses', label: 'Responses', icon: Users },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'advanced', label: 'Advanced', icon: BarChart3 }
  ] as const;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-200 ease-out">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden border-0 shadow-2xl transition-all duration-200 ease-out">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <SettingsIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-slate-900">Form Settings</CardTitle>
              <p className="text-sm text-slate-500">Customize your form appearance and behavior</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport}
              className="text-slate-600 hover:text-slate-800"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDuplicate}
              className="text-slate-600 hover:text-slate-800"
            >
              <Copy className="h-4 w-4 mr-1" />
              Duplicate
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 bg-white">
          <div className="flex space-x-1 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <CardContent className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                  <SettingsIcon className="h-5 w-5 text-blue-600" />
                  <span>Basic Information</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Form Title</label>
                    <Input
                      value={form.title}
                      onChange={(e) => onUpdate({ title: e.target.value })}
                      placeholder="Enter form title"
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Form ID</label>
                    <Input
                      value={form.id}
                      disabled
                      className="bg-slate-50 border-slate-300 text-slate-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <Textarea
                    value={form.description || ''}
                    onChange={(e) => onUpdate({ description: e.target.value })}
                    placeholder="Enter form description"
                    rows={3}
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Form Details</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Created</label>
                    <Input
                      value={form.createdAt.toLocaleDateString()}
                      disabled
                      className="bg-slate-50 border-slate-300 text-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Last Modified</label>
                    <Input
                      value={form.updatedAt.toLocaleDateString()}
                      disabled
                      className="bg-slate-50 border-slate-300 text-slate-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Questions Count</label>
                  <Input
                    value={`${form.questions.length} questions`}
                    disabled
                    className="bg-slate-50 border-slate-300 text-slate-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Response Settings Tab */}
          {activeTab === 'responses' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Response Collection</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium text-slate-900">Allow anonymous responses</h4>
                        <p className="text-sm text-slate-600">Anyone can submit responses without signing in</p>
                      </div>
                    </div>
                                         <label className="relative inline-flex items-center cursor-pointer">
                       <input
                         type="checkbox"
                         checked={form.settings.allowAnonymous}
                         onChange={(e) => updateSettings({ allowAnonymous: e.target.checked })}
                         className="sr-only peer"
                       />
                       <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all duration-300 ease-out peer-checked:bg-blue-600 hover:shadow-md"></div>
                     </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-slate-900">Collect respondent email addresses</h4>
                        <p className="text-sm text-slate-600">Require email addresses for form submissions</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.settings.collectEmail}
                        onChange={(e) => updateSettings({ collectEmail: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      <div>
                        <h4 className="font-medium text-slate-900">Show progress bar</h4>
                        <p className="text-sm text-slate-600">Display progress indicator during form completion</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.settings.showProgressBar}
                        onChange={(e) => updateSettings({ showProgressBar: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-orange-600" />
                      <div>
                        <h4 className="font-medium text-slate-900">Allow multiple responses</h4>
                        <p className="text-sm text-slate-600">Same person can submit multiple responses</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.settings.allowMultipleResponses}
                        onChange={(e) => updateSettings({ allowMultipleResponses: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-blue-600" />
                  <span>Response Limits</span>
                </h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Maximum Responses</label>
                  <Input
                    type="number"
                    value={form.settings.responseLimit || ''}
                    onChange={(e) => updateSettings({ 
                      responseLimit: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    placeholder="Leave empty for unlimited responses"
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500">Set a limit to automatically close the form when reached</p>
                </div>
              </div>
            </div>
          )}

          {/* Theme Settings Tab */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                  <Palette className="h-5 w-5 text-blue-600" />
                  <span>Visual Customization</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700">Primary Color</label>
                    <div className="flex items-center space-x-3">
                                             <input
                         type="color"
                         value={form.settings.theme.primaryColor}
                         onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                         className="w-12 h-12 rounded-lg border-2 border-slate-300 cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg"
                       />
                      <Input
                        value={form.settings.theme.primaryColor}
                        onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                        placeholder="#4285f4"
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <p className="text-xs text-slate-500">Used for buttons, links, and highlights</p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700">Background Color</label>
                    <div className="flex items-center space-x-3">
                                             <input
                         type="color"
                         value={form.settings.theme.backgroundColor}
                         onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                         className="w-12 h-12 rounded-lg border-2 border-slate-300 cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg"
                       />
                      <Input
                        value={form.settings.theme.backgroundColor}
                        onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                        placeholder="#ffffff"
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <p className="text-xs text-slate-500">Main background color of the form</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">Font Family</label>
                  <select
                    value={form.settings.theme.fontFamily}
                    onChange={(e) => updateTheme({ fontFamily: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Inter">Inter (Modern)</option>
                    <option value="Roboto">Roboto (Clean)</option>
                    <option value="Open Sans">Open Sans (Readable)</option>
                    <option value="Lato">Lato (Friendly)</option>
                    <option value="Poppins">Poppins (Geometric)</option>
                    <option value="Montserrat">Montserrat (Elegant)</option>
                    <option value="Source Sans Pro">Source Sans Pro (Professional)</option>
                    <option value="Nunito">Nunito (Rounded)</option>
                  </select>
                  <p className="text-xs text-slate-500">Choose the font family for your form text</p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">Preview</label>
                  <div 
                    className="p-6 rounded-lg border-2 border-dashed border-slate-300"
                    style={{
                      backgroundColor: form.settings.theme.backgroundColor,
                      fontFamily: form.settings.theme.fontFamily
                    }}
                  >
                    <h3 className="text-lg font-semibold mb-2" style={{ color: form.settings.theme.primaryColor }}>
                      Form Preview
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      This is how your form will appear to respondents
                    </p>
                    <Button 
                      className="text-white"
                      style={{ backgroundColor: form.settings.theme.primaryColor }}
                    >
                      Sample Button
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Settings Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span>Advanced Options</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-yellow-800">Form Analytics</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Track form performance, response rates, and completion analytics
                        </p>
                        <Button variant="outline" size="sm" className="mt-2 text-yellow-700 border-yellow-300 hover:bg-yellow-100">
                          Enable Analytics
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Share2 className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-800">Form Sharing</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Generate shareable links and embed codes for your form
                        </p>
                        <div className="flex space-x-2 mt-2">
                          <Button variant="outline" size="sm" className="text-blue-700 border-blue-300 hover:bg-blue-100">
                            <Share2 className="h-4 w-4 mr-1" />
                            Share Link
                          </Button>
                          <Button variant="outline" size="sm" className="text-blue-700 border-blue-300 hover:bg-blue-100">
                            <Copy className="h-4 w-4 mr-1" />
                            Embed Code
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Trash2 className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-red-800">Danger Zone</h4>
                        <p className="text-sm text-red-700 mt-1">
                          Permanently delete this form and all its responses
                        </p>
                        <Button variant="outline" size="sm" className="mt-2 text-red-700 border-red-300 hover:bg-red-100">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete Form
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Footer Actions */}
        <div className="flex justify-between items-center p-6 border-t border-slate-200 bg-slate-50">
          <div className="text-sm text-slate-600">
            Last saved: {form.updatedAt.toLocaleString()}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FormSettings;
