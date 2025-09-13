import React, { useState, useEffect } from 'react';
import type { Question, QuestionType } from '@/types/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Copy, 
  Trash2, 
  Plus, 
  Upload,
  Image as ImageIcon,
  Video,
  FileText
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface InlineQuestionEditorProps {
  question: Question;
  questionNumber: number;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  theme?: {
    primaryColor: string;
    backgroundColor: string;
    fontFamily: string;
  };
  onOpenImageModal: (onInsert: (data: any) => void) => void;
  onOpenVideoModal: (onInsert: (data: any) => void) => void;
  onAddTitleDescription?: () => void;
}

const InlineQuestionEditor: React.FC<InlineQuestionEditorProps> = ({
  question,
  questionNumber,
  onUpdate,
  onDelete,
  onDuplicate,
  theme,
  onOpenImageModal,
  onOpenVideoModal,
  onAddTitleDescription
}) => {
  const [newOption, setNewOption] = useState('');

  // Debug logging
  useEffect(() => {
    console.log('InlineQuestionEditor - question updated:', question);
  }, [question]);

  const questionTypes: { value: QuestionType; label: string; icon: string }[] = [
    { value: 'short_text', label: 'Short Answer', icon: 'Aa' },
    { value: 'long_text', label: 'Paragraph', icon: '¶' },
    { value: 'multiple_choice', label: 'Multiple Choice', icon: '○' },
    { value: 'checkbox', label: 'Checkboxes', icon: '☐' },
    { value: 'dropdown', label: 'Dropdown', icon: '▼' },
    { value: 'multiple_choice_grid', label: 'Multiple Choice Grid', icon: '⊞' },
    { value: 'checkbox_grid', label: 'Checkbox Grid', icon: '⊟' },
    { value: 'linear_scale', label: 'Linear Scale', icon: '⚡' },
    { value: 'date', label: 'Date', icon: '📅' },
    { value: 'time', label: 'Time', icon: '🕐' },
    { value: 'email', label: 'Email', icon: '✉️' },
    { value: 'number', label: 'Number', icon: '🔢' },
    { value: 'file_upload', label: 'File Upload', icon: '📎' },
  ];

  const addOption = () => {
    console.log('addOption called with:', newOption);
    const trimmedOption = newOption.trim();
    
    if (trimmedOption) {
      const option = {
        id: uuidv4(),
        text: trimmedOption,
        value: trimmedOption.toLowerCase().replace(/\s+/g, '_')
      };
      console.log('Adding option:', option);
      
      const currentOptions = question.options || [];
      const updatedOptions = [...currentOptions, option];
      
      console.log('Current options:', currentOptions);
      console.log('Updated options:', updatedOptions);
      
      onUpdate({
        options: updatedOptions
      });
      
      setNewOption('');
      console.log('Option added successfully');
    } else {
      console.log('Cannot add option - newOption is empty:', newOption);
    }
  };

  const removeOption = (optionId: string) => {
    if (question.options) {
      const updatedOptions = question.options.filter(option => option.id !== optionId);
      onUpdate({ options: updatedOptions });
    }
  };

  const handleInsertImage = (imageData: { url: string; alt?: string; title?: string }) => {
    onUpdate({
      settings: {
        ...question.settings,
        imageUrl: imageData.url,
        imageAlt: imageData.alt,
        imageTitle: imageData.title
      }
    });
  };

  const handleInsertVideo = (videoData: { url: string; title?: string; description?: string }) => {
    onUpdate({
      settings: {
        ...question.settings,
        videoUrl: videoData.url,
        videoTitle: videoData.title,
        videoDescription: videoData.description
      }
    });
  };


  const renderQuestionContent = () => {
    switch (question.type) {
      case 'short_text':
        return (
          <div className="mt-6">
            <Input
              placeholder="Short answer text"
              disabled
              className="border-gray-300"
            />
          </div>
        );

      case 'long_text':
        return (
          <div className="mt-6">
            <Textarea
              placeholder="Long answer text"
              disabled
              className="border-gray-300 min-h-[100px]"
            />
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="mt-6 space-y-4">
            {(question.options || []).map((option, index) => (
              <div key={option.id} className="flex items-center space-x-3">
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                <Input
                  value={option.text}
                  onChange={(e) => {
                    const updatedOptions = [...(question.options || [])];
                    updatedOptions[index] = { ...option, text: e.target.value };
                    onUpdate({ options: updatedOptions });
                  }}
                  className="flex-1 border-gray-300 focus:border-[#673ab7] focus:ring-[#673ab7]"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeOption(option.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
              <Input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Add option"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addOption();
                  }
                }}
                className="flex-1 border-gray-300 focus:border-[#673ab7] focus:ring-[#673ab7]"
              />
              <Button
                size="sm"
                type="button"
                onClick={addOption}
                disabled={!newOption.trim()}
                className="text-white"
                style={{ 
                  backgroundColor: theme?.primaryColor || '#673ab7',
                  opacity: newOption.trim() ? 1 : 0.5
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div className="mt-6 space-y-4">
            {(question.options || []).map((option, index) => (
              <div key={option.id} className="flex items-center space-x-3">
                <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                <Input
                  value={option.text}
                  onChange={(e) => {
                    const updatedOptions = [...(question.options || [])];
                    updatedOptions[index] = { ...option, text: e.target.value };
                    onUpdate({ options: updatedOptions });
                  }}
                  className="flex-1 border-gray-300 focus:border-[#673ab7] focus:ring-[#673ab7]"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeOption(option.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
              <Input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Add option"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addOption();
                  }
                }}
                className="flex-1 border-gray-300 focus:border-[#673ab7] focus:ring-[#673ab7]"
              />
              <Button
                size="sm"
                type="button"
                onClick={addOption}
                disabled={!newOption.trim()}
                className="text-white"
                style={{ 
                  backgroundColor: theme?.primaryColor || '#673ab7',
                  opacity: newOption.trim() ? 1 : 0.5
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 'dropdown':
        return (
          <div className="mt-6 space-y-4">
            {(question.options || []).map((option, index) => (
              <div key={option.id} className="flex items-center space-x-3">
                <span className="text-sm text-gray-500 w-4">{index + 1}.</span>
                <Input
                  value={option.text}
                  onChange={(e) => {
                    const updatedOptions = [...(question.options || [])];
                    updatedOptions[index] = { ...option, text: e.target.value };
                    onUpdate({ options: updatedOptions });
                  }}
                  className="flex-1 border-gray-300 focus:border-[#673ab7] focus:ring-[#673ab7]"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeOption(option.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500 w-4">{(question.options?.length || 0) + 1}.</span>
              <Input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Add option"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addOption();
                  }
                }}
                className="flex-1 border-gray-300 focus:border-[#673ab7] focus:ring-[#673ab7]"
              />
              <Button
                size="sm"
                type="button"
                onClick={addOption}
                disabled={!newOption.trim()}
                className="text-white"
                style={{ 
                  backgroundColor: theme?.primaryColor || '#673ab7',
                  opacity: newOption.trim() ? 1 : 0.5
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 'linear_scale':
        const min = question.settings?.linearScaleMin || 1;
        const max = question.settings?.linearScaleMax || 5;
        return (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <Input
                value={question.settings?.linearScaleLabels?.min || min.toString()}
                onChange={(e) => onUpdate({
                  settings: {
                    ...question.settings,
                    linearScaleLabels: {
                      ...question.settings?.linearScaleLabels,
                      min: e.target.value
                    }
                  }
                })}
                className="w-24 border-gray-300 focus:border-[#673ab7] focus:ring-[#673ab7] text-center"
              />
              <span>to</span>
              <Input
                value={question.settings?.linearScaleLabels?.max || max.toString()}
                onChange={(e) => onUpdate({
                  settings: {
                    ...question.settings,
                    linearScaleLabels: {
                      ...question.settings?.linearScaleLabels,
                      max: e.target.value
                    }
                  }
                })}
                className="w-24 border-gray-300 focus:border-[#673ab7] focus:ring-[#673ab7] text-center"
              />
            </div>
            
            <div className="flex items-center justify-between">
              {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((value) => (
                <div key={value} className="flex flex-col items-center space-y-2">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-500">{value}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'file_upload':
        return (
          <div className="mt-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">File upload placeholder</p>
            </div>
          </div>
        );

      case 'title_description':
        return (
          <div className="mt-6 space-y-4">
            <div>
              <Input
                value={question.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="Title"
                className="text-2xl font-semibold border-none focus:ring-0 p-0 bg-transparent"
              />
            </div>
            <div>
              <Textarea
                value={question.description || ''}
                onChange={(e) => onUpdate({ description: e.target.value })}
                placeholder="Description (optional)"
                className="text-base text-gray-600 border-none focus:ring-0 p-0 resize-none bg-transparent"
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="mt-6">
            <p className="text-gray-500">Question type not implemented yet</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      {/* Google Forms-style Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-gray-600 hover:text-gray-800"
            title="Add question"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onAddTitleDescription}
            className="text-gray-600 hover:text-gray-800"
            title="Add title and description"
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onOpenImageModal(handleInsertImage)}
            className="text-gray-600 hover:text-gray-800"
            title="Add image"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onOpenVideoModal(handleInsertVideo)}
            className="text-gray-600 hover:text-gray-800"
            title="Add video"
          >
            <Video className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-gray-600 hover:text-gray-800"
            title="Add section"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Question Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {question.type === 'title_description' ? (
            <span className="text-sm text-gray-500">Title & Description</span>
          ) : (
            <>
              <span className="text-sm text-gray-500">Question {questionNumber}</span>
              <Select
                value={question.type}
                onValueChange={(value: QuestionType) => onUpdate({ type: value })}
              >
                <SelectTrigger className="w-48 border-gray-300 focus:border-[#673ab7] focus:ring-[#673ab7]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {questionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center space-x-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={onDuplicate}
            className="text-gray-400 hover:text-gray-600"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Question Title */}
      {question.type !== 'title_description' && (
        <div className="mb-4">
          <Input
            value={question.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Question title"
            className="text-lg font-medium border-none focus:ring-0 p-0"
          />
        </div>
      )}

      {/* Question Description */}
      {question.type !== 'title_description' && (
        <div className="mb-4">
          <Input
            value={question.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Description (optional)"
            className="text-sm text-gray-600 border-none focus:ring-0 p-0"
          />
        </div>
      )}

      {/* Question Content */}
      {renderQuestionContent()}

      {/* Display inserted images and videos */}
      {question.settings?.imageUrl && (
        <div className="mt-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <img
              src={question.settings.imageUrl}
              alt={question.settings.imageAlt || 'Inserted image'}
              className="max-w-full h-auto max-h-48 mx-auto rounded"
            />
            {question.settings.imageTitle && (
              <p className="text-sm text-gray-600 mt-2 text-center">{question.settings.imageTitle}</p>
            )}
          </div>
        </div>
      )}

      {question.settings?.videoUrl && (
        <div className="mt-4">
          <div className="border border-gray-200 rounded-lg p-4">
            {question.settings.videoUrl.includes('youtube.com') || question.settings.videoUrl.includes('youtu.be') ? (
              <div className="aspect-video">
                <iframe
                  src={question.settings.videoUrl.replace('watch?v=', 'embed/')}
                  className="w-full h-full rounded"
                  allowFullScreen
                />
              </div>
            ) : (
              <video
                src={question.settings.videoUrl}
                controls
                className="max-w-full h-auto max-h-48 mx-auto rounded"
              />
            )}
            {question.settings.videoTitle && (
              <p className="text-sm text-gray-600 mt-2 text-center">{question.settings.videoTitle}</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default InlineQuestionEditor;