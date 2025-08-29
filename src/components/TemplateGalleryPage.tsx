import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Download,
  Eye,
  Plus,
  Users,
  Calendar,
  ShoppingCart,
  GraduationCap,
  Heart,
  Briefcase,
  Home,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  Sparkles
} from 'lucide-react';

interface TemplateGalleryPageProps {
  onBack: () => void;
  onUseTemplate: (template: any) => void;
}

const TemplateGalleryPage: React.FC<TemplateGalleryPageProps> = ({ onBack, onUseTemplate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { id: 'all', name: 'All Templates', icon: Grid3X3, count: 156 },
    { id: 'business', name: 'Business', icon: Briefcase, count: 34 },
    { id: 'education', name: 'Education', icon: GraduationCap, count: 28 },
    { id: 'events', name: 'Events', icon: Calendar, count: 22 },
    { id: 'healthcare', name: 'Healthcare', icon: Heart, count: 18 },
    { id: 'marketing', name: 'Marketing', icon: TrendingUp, count: 25 },
    { id: 'personal', name: 'Personal', icon: Home, count: 15 },
    { id: 'surveys', name: 'Surveys', icon: Users, count: 14 }
  ];

  const templates = [
    {
      id: '1',
      title: 'Customer Feedback Survey',
      category: 'business',
      description: 'Collect valuable feedback from your customers to improve your products and services.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop',
      rating: 4.8,
      downloads: 1247,
      questions: 12,
      estimatedTime: '5 min',
      tags: ['feedback', 'customer', 'business'],
      featured: true
    },
    {
      id: '2',
      title: 'Event Registration Form',
      category: 'events',
      description: 'Streamline your event registration process with this comprehensive form template.',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=250&fit=crop',
      rating: 4.9,
      downloads: 2156,
      questions: 8,
      estimatedTime: '3 min',
      tags: ['events', 'registration', 'tickets'],
      featured: true
    },
    {
      id: '3',
      title: 'Job Application Form',
      category: 'business',
      description: 'Professional job application form with all necessary fields for hiring managers.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop',
      rating: 4.7,
      downloads: 1893,
      questions: 15,
      estimatedTime: '8 min',
      tags: ['hiring', 'recruitment', 'career'],
      featured: false
    },
    {
      id: '4',
      title: 'Student Course Evaluation',
      category: 'education',
      description: 'Help students provide feedback on courses and teaching effectiveness.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
      rating: 4.6,
      downloads: 892,
      questions: 10,
      estimatedTime: '4 min',
      tags: ['education', 'evaluation', 'feedback'],
      featured: false
    },
    {
      id: '5',
      title: 'Product Order Form',
      category: 'business',
      description: 'Complete order form for e-commerce businesses with payment integration.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop',
      rating: 4.5,
      downloads: 1567,
      questions: 14,
      estimatedTime: '6 min',
      tags: ['ecommerce', 'orders', 'payment'],
      featured: false
    },
    {
      id: '6',
      title: 'Health Assessment Questionnaire',
      category: 'healthcare',
      description: 'Comprehensive health assessment form for medical professionals.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop',
      rating: 4.8,
      downloads: 743,
      questions: 20,
      estimatedTime: '10 min',
      tags: ['healthcare', 'medical', 'assessment'],
      featured: true
    },
    {
      id: '7',
      title: 'Marketing Campaign Survey',
      category: 'marketing',
      description: 'Gather insights about your marketing campaigns and audience preferences.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
      rating: 4.4,
      downloads: 1123,
      questions: 11,
      estimatedTime: '5 min',
      tags: ['marketing', 'campaign', 'analytics'],
      featured: false
    },
    {
      id: '8',
      title: 'Employee Satisfaction Survey',
      category: 'business',
      description: 'Measure employee satisfaction and engagement in your organization.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
      rating: 4.7,
      downloads: 2341,
      questions: 16,
      estimatedTime: '7 min',
      tags: ['hr', 'employee', 'satisfaction'],
      featured: true
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredTemplates = templates.filter(template => template.featured);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
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
                <Grid3X3 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Template Gallery
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-3 py-2 rounded-xl border-gray-300 hover:bg-gray-50/80 transition-all duration-300"
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/60 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#673AB7]/50 focus:border-transparent bg-white/80 backdrop-blur-xl"
              />
            </div>
            <Button variant="outline" className="px-4 py-3 rounded-xl border-gray-300/50 hover:bg-gray-50/80 transition-all duration-300">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white/40 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-[#673AB7] to-[#5E35B1] text-white shadow-lg'
                    : 'text-gray-600 hover:bg-white/80 hover:text-gray-900'
                }`}
              >
                <category.icon className="h-4 w-4" />
                <span className="font-medium">{category.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedCategory === category.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200/80 text-gray-600'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Featured Templates */}
        {selectedCategory === 'all' && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Featured Templates
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <span className="text-sm text-gray-600">Most Popular</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  viewMode={viewMode}
                  onUseTemplate={onUseTemplate}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Templates */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {selectedCategory === 'all' ? 'All Templates' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <span className="text-sm text-gray-600 bg-white/80 px-3 py-1 rounded-full">
              {filteredTemplates.length} templates
            </span>
          </div>
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  viewMode={viewMode}
                  onUseTemplate={onUseTemplate}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  viewMode={viewMode}
                  onUseTemplate={onUseTemplate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Template Card Component
const TemplateCard: React.FC<{
  template: any;
  viewMode: 'grid' | 'list';
  onUseTemplate: (template: any) => void;
}> = ({ template, viewMode, onUseTemplate }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center space-x-6">
          <img
            src={template.image}
            alt={template.title}
            className="w-24 h-24 rounded-xl object-cover flex-shrink-0 shadow-lg"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{template.title}</h3>
              {template.featured && (
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Featured
                </span>
              )}
            </div>
            <p className="text-gray-600 mb-3">{template.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>{template.rating}</span>
              </div>
              <span>{template.downloads} downloads</span>
              <span>{template.questions} questions</span>
              <span>{template.estimatedTime}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="rounded-xl">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={() => onUseTemplate(template)}
              size="sm"
              className="bg-gradient-to-r from-[#673AB7] to-[#5E35B1] hover:from-[#5E35B1] hover:to-[#4A148C] text-white rounded-xl shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Use Template
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative">
        <img
          src={template.image}
          alt={template.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {template.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
              Featured
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button variant="ghost" size="icon" className="w-8 h-8 bg-white/90 hover:bg-white rounded-lg shadow-lg">
            <Star className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{template.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span>{template.rating}</span>
            </div>
            <span>{template.downloads}</span>
          </div>
          <div className="text-sm text-gray-500">
            {template.estimatedTime}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex-1 rounded-xl">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={() => onUseTemplate(template)}
            size="sm"
            className="flex-1 bg-gradient-to-r from-[#673AB7] to-[#5E35B1] hover:from-[#5E35B1] hover:to-[#4A148C] text-white rounded-xl shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Use Template
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateGalleryPage;
