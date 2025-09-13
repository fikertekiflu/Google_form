import React, { useState, useEffect } from 'react';
import type { Form, Question, QuestionType } from '@/types/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Settings, 
  Eye, 
  Send, 
  Save, 
  ArrowLeft,
  FileText,
  Download,
  Share2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import QuestionRenderer from './QuestionRenderer';
import InlineQuestionEditor from './InlineQuestionEditor';
import FormSettings from './FormSettings';
import ImageInsertModal from './ImageInsertModal';
import VideoInsertModal from './VideoInsertModal';
import { v4 as uuidv4 } from 'uuid';

interface FormBuilderProps {
  onBackToLanding?: () => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ onBackToLanding }) => {
  const [form, setForm] = useState<Form>({
    id: uuidv4(),
    title: 'Untitled Form',
    description: '',
    questions: [],
    settings: {
      allowAnonymous: true,
      collectEmail: false,
      showProgressBar: true,
      allowMultipleResponses: true,
      theme: {
        primaryColor: '#673AB7', // Google Forms purple
        backgroundColor: '#ffffff',
        fontFamily: 'Inter'
      }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showQuestionTypeSelector, setShowQuestionTypeSelector] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  // Global modals state
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [modalContext, setModalContext] = useState<{
    questionId?: string;
    onInsert?: (data: any) => void;
  }>({});

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 18000000); // Auto-save after 5 hours of inactivity

      return () => clearTimeout(timer);
    }
  }, [form, hasUnsavedChanges]);

  // Track changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [form]);

  const handleAutoSave = async () => {
    if (!hasUnsavedChanges) return;
    
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Save to localStorage as temporary save
      localStorage.setItem(`formflow_temp_${form.id}`, JSON.stringify({
        ...form,
        updatedAt: new Date()
      }));
      
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      setShowSaveSuccess(true);
      
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      localStorage.setItem(`formflow_${form.id}`, JSON.stringify({
        ...form,
        updatedAt: new Date()
      }));
      
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      setShowSaveSuccess(true);
      
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSend = () => {
    // Implement send functionality
    console.log('Sending form:', form);
    alert('Form sharing functionality will be implemented here!');
  };

  const handleExport = () => {
    // Export form data as PDF instead of JSON
    const formData = {
      title: form.title,
      description: form.description,
      questions: form.questions,
      settings: form.settings,
      exportDate: new Date().toISOString(),
      exportType: 'PDF'
    };
    
    // Create a simple PDF-like structure (in a real app, you'd use a PDF library)
    const pdfContent = `
FormFlow - Form Export
=====================

Form Title: ${formData.title}
Description: ${formData.description}
Export Date: ${new Date(formData.exportDate).toLocaleDateString()}

Questions:
${formData.questions.map((q, index) => `
${index + 1}. ${q.title}
   Type: ${q.type}
   Required: ${q.required ? 'Yes' : 'No'}
   ${q.options ? `Options: ${q.options.map(opt => opt.text).join(', ')}` : ''}
`).join('')}

Form Settings:
- Theme: ${formData.settings.theme.primaryColor}
- Collect Email: ${formData.settings.collectEmail ? 'Yes' : 'No'}
- Show Progress Bar: ${formData.settings.showProgressBar ? 'Yes' : 'No'}
    `;
    
    // Create and download the file
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Form exported as PDF:', formData);
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Sharing form:', form);
    alert('Form sharing functionality will be implemented here!');
  };

  const addQuestion = (type: QuestionType) => {
    console.log('Adding question of type:', type);
    const newQuestion: Question = {
      id: uuidv4(),
      type,
      title: 'Untitled Question',
      required: false,
      options: type === 'multiple_choice' || type === 'checkbox' || type === 'dropdown' 
        ? [
            { id: uuidv4(), text: 'Option 1', value: 'option1' },
            { id: uuidv4(), text: 'Option 2', value: 'option2' }
          ] 
        : undefined,
      gridRows: type === 'multiple_choice_grid' || type === 'checkbox_grid'
        ? [
            { id: uuidv4(), text: 'Row 1', value: 'row1' },
            { id: uuidv4(), text: 'Row 2', value: 'row2' }
          ]
        : undefined,
      gridColumns: type === 'multiple_choice_grid' || type === 'checkbox_grid'
        ? [
            { id: uuidv4(), text: 'Column 1', value: 'col1' },
            { id: uuidv4(), text: 'Column 2', value: 'col2' },
            { id: uuidv4(), text: 'Column 3', value: 'col3' }
          ]
        : undefined,
      settings: type === 'linear_scale' 
        ? { linearScaleMin: 1, linearScaleMax: 5 }
        : type === 'multiple_choice' || type === 'checkbox'
        ? { allowOther: false, otherText: 'Other:', shuffleOptions: false }
        : type === 'file_upload'
        ? { allowMultiple: false }
        : undefined,
      validation: type === 'file_upload'
        ? { 
            fileTypes: ['image/*', 'application/pdf'],
            maxFileSize: 10 * 1024 * 1024 // 10MB
          }
        : undefined
    };

    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      updatedAt: new Date()
    }));
    setSelectedQuestionId(newQuestion.id);
  };

  const addTitleDescription = () => {
    console.log('Adding title and description section');
    const newTitleDescription: Question = {
      id: uuidv4(),
      type: 'title_description',
      title: 'Untitled Title',
      description: 'Description (optional)',
      required: false
    };

    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newTitleDescription],
      updatedAt: new Date()
    }));
    setSelectedQuestionId(newTitleDescription.id);
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    console.log('updateQuestion called with:', { questionId, updates });
    setForm(prev => {
      const newForm = {
        ...prev,
        questions: prev.questions.map(q => 
          q.id === questionId ? { ...q, ...updates } : q
        ),
        updatedAt: new Date()
      };
      console.log('Updated form:', newForm);
      return newForm;
    });
  };

  const deleteQuestion = (questionId: string) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId),
      updatedAt: new Date()
    }));
    if (selectedQuestionId === questionId) {
      setSelectedQuestionId(null);
    }
  };

  const duplicateQuestion = (questionId: string) => {
    const questionToDuplicate = form.questions.find(q => q.id === questionId);
    if (questionToDuplicate) {
      const duplicatedQuestion: Question = {
        ...questionToDuplicate,
        id: uuidv4(),
        title: `${questionToDuplicate.title} (Copy)`,
        options: questionToDuplicate.options?.map(opt => ({
          ...opt,
          id: uuidv4()
        }))
      };
      
      setForm(prev => ({
        ...prev,
        questions: [...prev.questions, duplicatedQuestion],
        updatedAt: new Date()
      }));
    }
  };


  // Global modal handlers
  const openImageModal = (questionId?: string, onInsert?: (data: any) => void) => {
    setModalContext({ questionId, onInsert });
    setShowImageModal(true);
  };

  const openVideoModal = (questionId?: string, onInsert?: (data: any) => void) => {
    setModalContext({ questionId, onInsert });
    setShowVideoModal(true);
  };

  const handleInsertImage = (imageData: { url: string; alt?: string; title?: string }) => {
    if (modalContext.questionId && modalContext.onInsert) {
      modalContext.onInsert(imageData);
    }
    setShowImageModal(false);
    setModalContext({});
  };

  const handleInsertVideo = (videoData: { url: string; title?: string; description?: string }) => {
    if (modalContext.questionId && modalContext.onInsert) {
      modalContext.onInsert(videoData);
    }
    setShowVideoModal(false);
    setModalContext({});
  };


  return (
    <div 
      className="min-h-screen w-full"
      style={{
        backgroundColor: form.settings.theme.backgroundColor,
        fontFamily: form.settings.theme.fontFamily
      }}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBackToLanding}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#673AB7] to-[#5E35B1] rounded-lg flex items-center justify-center shadow-sm">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="text-lg font-medium text-gray-900">FormFlow</span>
                {lastSaved && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Last saved {lastSaved.toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Save Status */}
            {showSaveSuccess && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>Saved successfully!</span>
              </div>
            )}
            
            {hasUnsavedChanges && !isSaving && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-lg text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Unsaved changes</span>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all duration-200"
            >
              <Settings className="h-4 w-4 mr-2" />
              <span className="text-sm">Settings</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-4 py-2 text-sm rounded-lg transition-all duration-200"
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleSave}
              disabled={isSaving}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-4 py-2 text-sm rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 mr-2 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleExport}
              className="px-4 py-2 rounded-lg border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleShare}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-4 py-2 text-sm rounded-lg transition-all duration-200"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            
            <Button 
              onClick={handleSend}
              className="text-white px-4 py-2 text-sm rounded-lg transition-all duration-200 hover:shadow-lg"
              style={{ 
                backgroundColor: form.settings.theme.primaryColor,
                '--tw-shadow-color': form.settings.theme.primaryColor
              } as React.CSSProperties}
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {isPreviewMode ? (
          <div className="max-w-2xl mx-auto">
            <Card 
              className="shadow-lg border border-gray-200 rounded-xl overflow-hidden"
              style={{ backgroundColor: form.settings.theme.backgroundColor }}
            >
              <CardHeader className="pb-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <CardTitle className="text-2xl font-semibold text-gray-900">{form.title}</CardTitle>
                {form.description && (
                  <p className="text-gray-600 mt-3 text-base leading-relaxed">{form.description}</p>
                )}
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {form.questions.map((question, index) => (
                  <QuestionRenderer
                    key={question.id}
                    question={question}
                    questionNumber={index + 1}
                    theme={form.settings.theme}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            {/* Form Header */}
            <Card 
              className="mb-8 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ease-out overflow-hidden"
              style={{ backgroundColor: form.settings.theme.backgroundColor }}
            >
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Input
                      value={form.title}
                      onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                      className="text-3xl font-semibold border-none focus-visible:ring-0 px-0 text-gray-900 placeholder:text-gray-400 bg-transparent"
                      placeholder="Untitled form"
                    />
                    <Textarea
                      value={form.description}
                      onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Form description"
                      className="border-none focus-visible:ring-0 px-0 resize-none text-gray-600 placeholder:text-gray-400 text-base bg-transparent"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <div className="space-y-8">
              {form.questions.map((question, index) => (
                <Card
                  key={question.id}
                  className={`transition-all duration-300 ease-out border border-gray-200 rounded-xl hover:shadow-lg group transform hover:scale-[1.01] ${
                    selectedQuestionId === question.id ? 'ring-2 ring-opacity-50 shadow-lg' : ''
                  }`}
                  style={{ 
                    backgroundColor: form.settings.theme.backgroundColor,
                    borderColor: selectedQuestionId === question.id ? form.settings.theme.primaryColor : undefined,
                    boxShadow: selectedQuestionId === question.id ? `0 0 0 2px ${form.settings.theme.primaryColor}, 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` : undefined
                  }}
                >
                  <CardContent className="p-6">
                    <InlineQuestionEditor
                      question={question}
                      questionNumber={index + 1}
                      onUpdate={(updates) => updateQuestion(question.id, updates)}
                      onDelete={() => deleteQuestion(question.id)}
                      onDuplicate={() => duplicateQuestion(question.id)}
                      theme={form.settings.theme}
                      onOpenImageModal={(onInsert) => openImageModal(question.id, onInsert)}
                      onOpenVideoModal={(onInsert) => openVideoModal(question.id, onInsert)}
                      onAddTitleDescription={addTitleDescription}
                    />
                  </CardContent>
                </Card>
              ))}

              {/* Add First Question Button - Shows when no questions exist */}
              {form.questions.length === 0 && (
                <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all duration-300 ease-out hover:shadow-lg rounded-xl">
                  <CardContent className="p-12 text-center">
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#673AB7] to-[#5E35B1] rounded-full flex items-center justify-center shadow-lg">
                        <Plus className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Start building your form</h3>
                        <p className="text-gray-600 mb-6">Add your first question to get started</p>
                      </div>
                      <Button
                        onClick={() => setShowQuestionTypeSelector(true)}
                        className="px-8 py-3 text-base font-medium rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                        style={{ backgroundColor: form.settings.theme.primaryColor }}
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add your first question
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Floating Action Button for Adding Questions */}
            {!isPreviewMode && (
              <div className="fixed bottom-8 right-8 z-50">
                <Button
                  onClick={() => setShowQuestionTypeSelector(!showQuestionTypeSelector)}
                  className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  style={{ backgroundColor: form.settings.theme.primaryColor }}
                >
                  <Plus className="h-6 w-6 text-white" />
                </Button>
                
                {/* Question Type Selector */}
                {showQuestionTypeSelector && (
                  <div className="absolute bottom-16 right-0 mb-4 bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-80">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Add Question</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { type: 'short_text' as QuestionType, label: 'Short Answer', icon: 'Aa' },
                          { type: 'long_text' as QuestionType, label: 'Paragraph', icon: '¶' },
                          { type: 'multiple_choice' as QuestionType, label: 'Multiple Choice', icon: '○' },
                          { type: 'checkbox' as QuestionType, label: 'Checkboxes', icon: '☐' },
                          { type: 'dropdown' as QuestionType, label: 'Dropdown', icon: '▼' },
                          { type: 'linear_scale' as QuestionType, label: 'Linear Scale', icon: '⚡' },
                          { type: 'date' as QuestionType, label: 'Date', icon: '📅' },
                          { type: 'email' as QuestionType, label: 'Email', icon: '✉️' },
                          { type: 'file_upload' as QuestionType, label: 'File Upload', icon: '📎' }
                        ].map((item) => (
                          <Button
                            key={item.type}
                            variant="ghost"
                            onClick={() => {
                              addQuestion(item.type);
                              setShowQuestionTypeSelector(false);
                            }}
                            className="justify-start p-3 h-auto text-left hover:bg-gray-50 rounded-lg transition-all duration-200"
                          >
                            <span className="text-lg mr-3">{item.icon}</span>
                            <span className="text-sm font-medium text-gray-700">{item.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Settings Panel */}
            {showSettings && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <FormSettings
                    form={form}
                    onUpdate={(updates) => setForm(prev => ({ ...prev, ...updates }))}
                    onClose={() => setShowSettings(false)}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Global Modals */}
      <ImageInsertModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onInsertImage={handleInsertImage}
        theme={form.settings.theme}
      />

      <VideoInsertModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        onInsertVideo={handleInsertVideo}
        theme={form.settings.theme}
      />
    </div>
  );
};

export default FormBuilder;
