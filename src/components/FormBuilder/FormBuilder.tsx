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
  Trash2, 
  Copy,
  MoreVertical,
  GripVertical,
  ArrowLeft,
  FileText
} from 'lucide-react';
import QuestionEditor from './QuestionEditor';
import QuestionRenderer from './QuestionRenderer';
import InlineQuestionEditor from './InlineQuestionEditor';
import FormSettings from './FormSettings';
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
        primaryColor: '#4285f4',
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
        : undefined
    };

    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      updatedAt: new Date()
    }));
    setSelectedQuestionId(newQuestion.id);
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

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    const newQuestions = [...form.questions];
    const [movedQuestion] = newQuestions.splice(fromIndex, 1);
    newQuestions.splice(toIndex, 0, movedQuestion);
    
    setForm(prev => ({
      ...prev,
      questions: newQuestions,
      updatedAt: new Date()
    }));
  };

  const selectedQuestion = form.questions.find(q => q.id === selectedQuestionId);

  return (
    <div 
      className="min-h-screen w-full"
      style={{
        backgroundColor: form.settings.theme.backgroundColor,
        fontFamily: form.settings.theme.fontFamily
      }}
    >
      {/* Header - Google Forms Style */}
      <div 
        className="border-b border-gray-200 px-6 py-4"
        style={{ backgroundColor: form.settings.theme.backgroundColor }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBackToLanding && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToLanding}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2 py-1"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-sm">Back</span>
              </Button>
            )}
                         <div className="flex items-center space-x-2">
               <div 
                 className="w-7 h-7 rounded flex items-center justify-center"
                 style={{ backgroundColor: form.settings.theme.primaryColor }}
               >
                 <FileText className="h-3.5 w-3.5 text-white" />
               </div>
              <Input
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                className="text-base font-medium border-none focus-visible:ring-0 px-0 text-gray-900 placeholder:text-gray-400"
                placeholder="Untitled form"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2 py-1"
            >
              <Settings className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-sm">Settings</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 text-sm"
            >
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Preview
            </Button>
            <Button 
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 text-sm"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save
            </Button>
           <Button 
               className="text-white px-3 py-1.5 text-sm"
               style={{ 
                 backgroundColor: form.settings.theme.primaryColor,
                 '--tw-shadow-color': form.settings.theme.primaryColor
               } as React.CSSProperties}
             >
               <Send className="h-3.5 w-3.5 mr-1.5" />
               Send
             </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {isPreviewMode ? (
          <div className="max-w-2xl mx-auto">
            <Card 
              className="shadow-sm border border-gray-200"
              style={{ backgroundColor: form.settings.theme.backgroundColor }}
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900">{form.title}</CardTitle>
                {form.description && (
                  <p className="text-gray-600 mt-2 text-sm">{form.description}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {form.questions.map((question, index) => (
                  <QuestionRenderer
                    key={question.id}
                    question={question}
                    questionNumber={index + 1}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Form Header */}
            <Card 
              className="mb-8 border border-gray-200 transition-all duration-200 ease-out hover:shadow-lg"
              style={{ backgroundColor: form.settings.theme.backgroundColor }}
            >
              <CardContent className="p-8">
                <div className="space-y-4">
                  <Input
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    className="text-2xl font-medium border-none focus-visible:ring-0 px-0 text-gray-900 placeholder:text-gray-400"
                    placeholder="Untitled form"
                  />
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Form description"
                    className="border-none focus-visible:ring-0 px-0 resize-none text-gray-600 placeholder:text-gray-400 text-sm"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <div className="space-y-6">
              {form.questions.map((question, index) => (
                <Card
                  key={question.id}
                  className={`transition-all duration-200 ease-out border border-gray-200 hover:shadow-lg group transform hover:scale-[1.01] ${
                    selectedQuestionId === question.id ? 'ring-2 ring-opacity-50' : ''
                  }`}
                  style={{ 
                    backgroundColor: form.settings.theme.backgroundColor,
                    borderColor: selectedQuestionId === question.id ? form.settings.theme.primaryColor : undefined,
                    boxShadow: selectedQuestionId === question.id ? `0 0 0 2px ${form.settings.theme.primaryColor}, 0 10px 25px -5px rgba(0, 0, 0, 0.1)` : undefined
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center space-x-2 text-gray-400 mt-1">
                        <GripVertical className="h-4 w-4" />
                        <span className="text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <InlineQuestionEditor
                          question={question}
                          questionNumber={index + 1}
                          onUpdate={(updates) => updateQuestion(question.id, updates)}
                          onDelete={() => deleteQuestion(question.id)}
                          onDuplicate={() => duplicateQuestion(question.id)}
                          isSelected={selectedQuestionId === question.id}
                          onSelect={() => setSelectedQuestionId(question.id)}
                          theme={form.settings.theme}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Question Button */}
            <Card className="mt-8 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all duration-200 ease-out hover:shadow-md hover:scale-[1.01]">
              <CardContent className="p-6">
                {showQuestionTypeSelector ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Text Questions */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Text</h4>
                                          <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
                    onClick={() => { addQuestion('short_text'); setShowQuestionTypeSelector(false); }}
                  >
                          <span className="text-lg mr-2">Aa</span>
                          Short answer
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left"
                          onClick={() => { addQuestion('long_text'); setShowQuestionTypeSelector(false); }}
                        >
                          <span className="text-lg mr-2">¶</span>
                          Paragraph
                        </Button>
                      </div>
                      
                      {/* Choice Questions */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Choice</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left"
                          onClick={() => { addQuestion('multiple_choice'); setShowQuestionTypeSelector(false); }}
                        >
                          <span className="text-lg mr-2">○</span>
                          Multiple choice
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left"
                          onClick={() => { addQuestion('checkbox'); setShowQuestionTypeSelector(false); }}
                        >
                          <span className="text-lg mr-2">☐</span>
                          Checkboxes
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left"
                          onClick={() => { addQuestion('dropdown'); setShowQuestionTypeSelector(false); }}
                        >
                          <span className="text-lg mr-2">▼</span>
                          Dropdown
                        </Button>
                      </div>
                      
                      {/* Grid Questions */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Grid</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left"
                          onClick={() => { addQuestion('multiple_choice_grid'); setShowQuestionTypeSelector(false); }}
                        >
                          <span className="text-lg mr-2">⊞</span>
                          Multiple choice grid
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left"
                          onClick={() => { addQuestion('checkbox_grid'); setShowQuestionTypeSelector(false); }}
                        >
                          <span className="text-lg mr-2">⊟</span>
                          Checkbox grid
                        </Button>
                      </div>
                      
                      {/* Other Questions */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Other</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left"
                          onClick={() => { addQuestion('linear_scale'); setShowQuestionTypeSelector(false); }}
                        >
                          <span className="text-lg mr-2">⚡</span>
                          Linear scale
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left"
                          onClick={() => { addQuestion('date'); setShowQuestionTypeSelector(false); }}
                        >
                          <span className="text-lg mr-2">📅</span>
                          Date
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left"
                          onClick={() => { addQuestion('time'); setShowQuestionTypeSelector(false); }}
                        >
                          <span className="text-lg mr-2">🕐</span>
                          Time
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left"
                          onClick={() => { addQuestion('email'); setShowQuestionTypeSelector(false); }}
                        >
                          <span className="text-lg mr-2">✉️</span>
                          Email
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left"
                          onClick={() => { addQuestion('number'); setShowQuestionTypeSelector(false); }}
                        >
                          <span className="text-lg mr-2">🔢</span>
                          Number
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowQuestionTypeSelector(false)}
                      className="text-gray-500"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full h-16 text-base font-medium border-2 border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Add Question button clicked');
                      setShowQuestionTypeSelector(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <FormSettings
          form={form}
          onUpdate={(updates) => setForm(prev => ({ ...prev, ...updates }))}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Floating Action Button */}
      {!isPreviewMode && !showQuestionTypeSelector && (
                  <div className="fixed bottom-6 right-6 z-50">
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('FAB clicked');
                setShowQuestionTypeSelector(true);
              }}
              className="w-14 h-14 rounded-full shadow-lg text-white transition-all duration-300 hover:scale-110 hover:shadow-xl"
              size="icon"
              style={{ 
                backgroundColor: form.settings.theme.primaryColor
              }}
            >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Question Type Selector Modal */}
      {showQuestionTypeSelector && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center transition-all duration-200 ease-out" 
          onClick={() => setShowQuestionTypeSelector(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto transform transition-all duration-200 ease-out" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Add Question</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQuestionTypeSelector(false)}
              >
                ✕
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Text Questions */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Text</h4>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={(e) => { 
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Short text button clicked');
                    addQuestion('short_text'); 
                    setShowQuestionTypeSelector(false); 
                  }}
                >
                  <span className="text-lg mr-2">Aa</span>
                  Short answer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => { addQuestion('long_text'); setShowQuestionTypeSelector(false); }}
                >
                  <span className="text-lg mr-2">¶</span>
                  Paragraph
                </Button>
              </div>
              
              {/* Choice Questions */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Choice</h4>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => { addQuestion('multiple_choice'); setShowQuestionTypeSelector(false); }}
                >
                  <span className="text-lg mr-2">○</span>
                  Multiple choice
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => { addQuestion('checkbox'); setShowQuestionTypeSelector(false); }}
                >
                  <span className="text-lg mr-2">☐</span>
                  Checkboxes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => { addQuestion('dropdown'); setShowQuestionTypeSelector(false); }}
                >
                  <span className="text-lg mr-2">▼</span>
                  Dropdown
                </Button>
              </div>
              
              {/* Grid Questions */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Grid</h4>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => { addQuestion('multiple_choice_grid'); setShowQuestionTypeSelector(false); }}
                >
                  <span className="text-lg mr-2">⊞</span>
                  Multiple choice grid
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => { addQuestion('checkbox_grid'); setShowQuestionTypeSelector(false); }}
                >
                  <span className="text-lg mr-2">⊟</span>
                  Checkbox grid
                </Button>
              </div>
              
              {/* Other Questions */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Other</h4>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => { addQuestion('linear_scale'); setShowQuestionTypeSelector(false); }}
                >
                  <span className="text-lg mr-2">⚡</span>
                  Linear scale
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => { addQuestion('date'); setShowQuestionTypeSelector(false); }}
                >
                  <span className="text-lg mr-2">📅</span>
                  Date
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => { addQuestion('time'); setShowQuestionTypeSelector(false); }}
                >
                  <span className="text-lg mr-2">🕐</span>
                  Time
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => { addQuestion('email'); setShowQuestionTypeSelector(false); }}
                >
                  <span className="text-lg mr-2">✉️</span>
                  Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => { addQuestion('number'); setShowQuestionTypeSelector(false); }}
                >
                  <span className="text-lg mr-2">🔢</span>
                  Number
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;
