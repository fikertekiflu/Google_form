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
  MoreVertical,
  Settings,
  Eye
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface InlineQuestionEditorProps {
  question: Question;
  questionNumber: number;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  isSelected: boolean;
  onSelect: () => void;
  theme?: {
    primaryColor: string;
    backgroundColor: string;
    fontFamily: string;
  };
}

const InlineQuestionEditor: React.FC<InlineQuestionEditorProps> = ({
  question,
  questionNumber,
  onUpdate,
  onDelete,
  onDuplicate,
  isSelected,
  onSelect,
  theme
}) => {
  const [newOption, setNewOption] = useState('');
  const [showOptions, setShowOptions] = useState(false);

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
      onUpdate({
        options: question.options.filter(opt => opt.id !== optionId)
      });
    }
  };

  const updateOption = (optionId: string, text: string) => {
    if (question.options) {
      onUpdate({
        options: question.options.map(opt =>
          opt.id === optionId ? { ...opt, text, value: text.toLowerCase().replace(/\s+/g, '_') } : opt
        )
      });
    }
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'short_text':
        return (
          <div className="mt-4">
            <Input
              placeholder="Short answer text"
              className="border-gray-300 focus:border-[#673ab7] focus:ring-[#673ab7]"
              disabled
            />
          </div>
        );

      case 'long_text':
        return (
          <div className="mt-4">
            <Textarea
              placeholder="Long answer text"
              className="border-gray-300 focus:border-[#673ab7] focus:ring-[#673ab7]"
              rows={3}
              disabled
            />
          </div>
        );

             case 'multiple_choice':
       case 'checkbox':
         return (
           <div className="mt-6 space-y-4">
                         {question.options?.map((option, index) => (
               <div key={option.id} className="flex items-center space-x-4">
                 <div className={`w-4 h-4 ${question.type === 'multiple_choice' ? 'border-2 border-gray-300 rounded-full' : 'border-2 border-gray-300 rounded'}`}></div>
                <Input
                  value={option.text}
                  onChange={(e) => updateOption(option.id, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 border-gray-300"
                  style={{
                    '--tw-ring-color': theme?.primaryColor || '#673ab7',
                    '--tw-border-opacity': '1'
                  } as React.CSSProperties}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(option.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center space-x-4">
              <div className={`w-4 h-4 ${question.type === 'multiple_choice' ? 'border-2 border-gray-300 rounded-full' : 'border-2 border-gray-300 rounded'}`}></div>
              <Input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Add option"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    console.log('Enter pressed, adding option');
                    addOption();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
                className="flex-1 border-gray-300 focus:border-[#673ab7] focus:ring-[#673ab7]"
              />
                           <Button 
                 size="sm"
                 type="button"
                 onClick={(e) => {
                   e.preventDefault();
                   e.stopPropagation();
                   e.nativeEvent.stopImmediatePropagation();
                   console.log('Add option button clicked, newOption:', newOption);
                   addOption();
                 }} 
                 className="text-white cursor-pointer transition-all duration-200 hover:scale-105"
                 disabled={!newOption.trim()}
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
            {question.options?.map((option, index) => (
              <div key={option.id} className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 w-4">{index + 1}.</span>
                <Input
                  value={option.text}
                  onChange={(e) => updateOption(option.id, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 border-gray-300 focus:border-[#673ab7] focus:ring-[#673ab7]"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(option.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 w-4">{(question.options?.length || 0) + 1}.</span>
              <Input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Add option"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    console.log('Enter pressed, adding dropdown option');
                    addOption();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
                className="flex-1 border-gray-300 focus:border-[#673ab7] focus:ring-[#673ab7]"
              />
                           <Button 
                size="sm" 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  console.log('Add dropdown option button clicked, newOption:', newOption);
                  addOption();
                }} 
                className="text-white cursor-pointer"
                disabled={!newOption.trim()}
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
            <div className="flex items-center justify-between space-x-2">
              {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((num) => (
                <div key={num} className="flex flex-col items-center space-y-1">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                  <span className="text-xs text-gray-600">{num}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="mt-4">
            <Input
              placeholder={`${question.type.replace('_', ' ')} input`}
              className="border-gray-300 focus:border-[#673ab7] focus:ring-[#673ab7]"
              disabled
            />
          </div>
        );
    }
  };

  return (
    <div 
      className="border-l-4 p-6 transition-all duration-200 ease-out hover:shadow-md" 
      onClick={onSelect}
      style={{
        borderLeftColor: theme?.primaryColor || '#673ab7',
        backgroundColor: theme?.backgroundColor || 'white'
      }}
    >
      <div className="space-y-6">
        {/* Question Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-4">
                         {/* Question Type Selector */}
             <div className="flex items-center space-x-4">
              <Select
                value={question.type}
                onValueChange={(value: QuestionType) => onUpdate({ type: value })}
              >
                <SelectTrigger 
                  className="w-48 border-gray-300 transition-all duration-200 hover:shadow-sm hover:scale-[1.02]"
                  style={{
                    '--tw-ring-color': theme?.primaryColor || '#673ab7',
                    '--tw-border-opacity': '1'
                  } as React.CSSProperties}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {questionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
                             {/* Required Toggle */}
               <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`required-${question.id}`}
                  checked={question.required}
                  onChange={(e) => onUpdate({ required: e.target.checked })}
                  className="w-4 h-4 border-gray-300 rounded"
                  style={{
                    '--tw-ring-color': theme?.primaryColor || '#673ab7',
                    '--tw-text-opacity': '1'
                  } as React.CSSProperties}
                />
                <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
                  Required
                </label>
              </div>
            </div>

            {/* Question Title */}
            <Input
              value={question.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Question"
              className="text-lg font-medium border-none focus-visible:ring-0 px-0 text-gray-900 placeholder:text-gray-400"
            />

            {/* Question Description */}
            <Textarea
              value={question.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Description (optional)"
              className="border-none focus-visible:ring-0 px-0 resize-none text-gray-600 placeholder:text-gray-400 text-sm"
              rows={1}
            />
          </div>

                     {/* Action Buttons */}
                       <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out">
                         <Button
               variant="ghost"
               size="sm"
               onClick={(e) => {
                 e.stopPropagation();
                 onDuplicate();
               }}
                               className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-3 transition-all duration-200 hover:scale-110"
               title="Duplicate question"
             >
              <Copy className="h-4 w-4" />
            </Button>
                         <Button
               variant="ghost"
               size="sm"
               onClick={(e) => {
                 e.stopPropagation();
                 onDelete();
               }}
                               className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-3 transition-all duration-200 hover:scale-110"
               title="Delete question"
             >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Question Content */}
        {renderQuestionContent()}
      </div>
    </div>
  );
};

export default InlineQuestionEditor;
