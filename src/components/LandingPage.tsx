import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus, 
  FileText, 
  Grid3X3,
  Menu,
  MoreVertical,
  Folder,
  List,
  SortAsc,
  ChevronsUpDown,
  Search
} from 'lucide-react';

interface LandingPageProps {
  onStartNewForm: () => void;
}

// Enhanced multi-colored plus icon that looks more like Google's
const MultiColorPlusIcon = () => (
  <div className="relative w-16 h-16 flex items-center justify-center">
    {/* Google's four-colored plus icon */}
    <div className="absolute w-6 h-1.5 bg-[#34A853] rounded-sm"></div> {/* Green horizontal */}
    <div className="absolute w-1.5 h-6 bg-[#4285F4] rounded-sm"></div> {/* Blue vertical */}
    <div className="absolute w-1.5 h-3 bg-[#FBBC05] -translate-y-[18px] rounded-sm"></div> {/* Yellow top */}
    <div className="absolute w-3 h-1.5 bg-[#EA4335] translate-x-[18px] rounded-sm"></div> {/* Red right */}
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onStartNewForm }) => {
  const templates = [
    {
      title: 'Event feedback',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=200&h=120&fit=crop',
    },
    {
      title: 'Order Request',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=120&fit=crop',
    },
    {
      title: 'Job application form',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=120&fit=crop',
    },
    {
      title: 'Time off request',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=120&fit=crop',
    }
  ];
  
  const recentForms = [
    {
        title: 'added',
        previewImage: 'https://docs.google.com/forms/d/e/1FAIpQLScT_pD-i0o_3W-h-g3G4u-V3f5e9J6n8K9L7oX4o5n_yR_pQ/preview',
        lastOpened: 'Aug 26, 2025'
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#f0f3f4] m-0 p-0">
      {/* Header - Styled to match Google's header */}
      <div className="w-full bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="w-10 h-10 hover:bg-gray-100 rounded-full">
              <Menu className="h-6 w-6 text-gray-600" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#673ab7] to-[#5e35b1] rounded-lg flex items-center justify-center shadow-sm">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl text-gray-700 font-medium">Forms</h1>
            </div>
          </div>
          
          {/* Search bar with Google's styling */}
          <div className="flex-1 max-w-2xl mx-8">
             <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-12 pr-4 py-2.5 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#f1f3f4] text-base"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="w-10 h-10 hover:bg-gray-100 rounded-full">
              <Grid3X3 className="h-6 w-6 text-gray-600" />
            </Button>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              F
            </div>
          </div>
        </div>
      </div>

      {/* "Start a new form" section - Full width background with distinct color */}
      <div className="w-full bg-[#f8f9fa] border-b border-gray-300 py-12">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-medium text-gray-800">Start a new form</h2>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-sm text-gray-600 hover:bg-gray-200 px-3 py-2 flex items-center space-x-2 rounded-md">
                <span>Template gallery</span>
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-gray-200 rounded-full">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Modern card grid */}
          <div className="flex flex-wrap gap-8 lg:gap-10">
            {/* Blank form card */}
            <div className="cursor-pointer group flex-shrink-0" onClick={onStartNewForm}>
              <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden w-48">
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                  <MultiColorPlusIcon />
                </div>
                <div className="p-6">
                  <h3 className="font-medium text-gray-900 text-base">Blank</h3>
                </div>
              </div>
            </div>

            {/* Template cards */}
            {templates.map((template, index) => (
              <div key={index} className="cursor-pointer group flex-shrink-0">
                <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden w-48">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img 
                      src={template.image} 
                      alt={template.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-medium text-gray-900 text-base">{template.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent forms section - Full width background */}
      <div className="w-full bg-white py-12">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-medium text-gray-800">Recent forms</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="text-sm px-3 py-2 bg-white border-gray-300 hover:bg-gray-100 flex items-center space-x-2 rounded-md">
                <span>Owned by anyone</span>
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-10 h-10 hover:bg-gray-100 rounded-full text-gray-600">
                <List className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="w-10 h-10 hover:bg-gray-100 rounded-full text-gray-600">
                <SortAsc className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="w-10 h-10 hover:bg-gray-100 rounded-full text-gray-600">
                <Folder className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Recent forms grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
            {recentForms.map((form, index) => (
               <div key={index} className="cursor-pointer group">
                  <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden">
                     <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                        <FileText className="h-12 w-12 text-blue-600"/>
                     </div>
                     <div className="p-5">
                       <h3 className="font-medium text-gray-900 text-sm truncate mb-3">{form.title}</h3>
                       <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-sm bg-blue-600 flex items-center justify-center">
                                 <FileText className="h-2.5 w-2.5 text-white" />
                            </div>
                            <p className="text-xs text-gray-500">Opened {form.lastOpened}</p>
                         </div>
                         <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                             <MoreVertical className="h-4 w-4 text-gray-600"/>
                         </Button>
                       </div>
                     </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;