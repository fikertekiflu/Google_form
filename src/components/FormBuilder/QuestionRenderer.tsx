import React, { useState } from 'react';
import type { Question } from '@/types/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface QuestionRendererProps {
  question: Question;
  questionNumber: number;
  isPreview?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  questionNumber,
  isPreview = false,
  value,
  onChange
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [textValue, setTextValue] = useState('');

  const handleOptionChange = (optionValue: string, isMultiple: boolean = false) => {
    if (isMultiple) {
      const newSelected = selectedOptions.includes(optionValue)
        ? selectedOptions.filter(v => v !== optionValue)
        : [...selectedOptions, optionValue];
      setSelectedOptions(newSelected);
      onChange?.(newSelected);
    } else {
      onChange?.(optionValue);
    }
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'short_text':
        return (
          <Input
            placeholder="Your answer"
            value={textValue}
            onChange={(e) => {
              setTextValue(e.target.value);
              onChange?.(e.target.value);
            }}
            disabled={isPreview}
          />
        );

      case 'long_text':
        return (
          <Textarea
            placeholder="Your answer"
            value={textValue}
            onChange={(e) => {
              setTextValue(e.target.value);
              onChange?.(e.target.value);
            }}
            disabled={isPreview}
            rows={4}
          />
        );

      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange?.(e.target.value)}
                  disabled={isPreview}
                  className="text-blue-600"
                />
                <span className="text-sm">{option.text}</span>
              </label>
            ))}
            {question.settings?.allowOther && (
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value="other"
                  checked={value === 'other'}
                  onChange={(e) => onChange?.(e.target.value)}
                  disabled={isPreview}
                  className="text-blue-600"
                />
                <span className="text-sm">{question.settings.otherText || 'Other:'}</span>
                {value === 'other' && (
                  <Input
                    placeholder="Please specify"
                    className="flex-1 text-sm"
                    disabled={isPreview}
                  />
                )}
              </label>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={selectedOptions.includes(option.value)}
                  onChange={(e) => handleOptionChange(option.value, true)}
                  disabled={isPreview}
                  className="text-blue-600"
                />
                <span className="text-sm">{option.text}</span>
              </label>
            ))}
            {question.settings?.allowOther && (
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  value="other"
                  checked={selectedOptions.includes('other')}
                  onChange={(e) => handleOptionChange('other', true)}
                  disabled={isPreview}
                  className="text-blue-600"
                />
                <span className="text-sm">{question.settings.otherText || 'Other:'}</span>
                {selectedOptions.includes('other') && (
                  <Input
                    placeholder="Please specify"
                    className="flex-1 text-sm"
                    disabled={isPreview}
                  />
                )}
              </label>
            )}
          </div>
        );

      case 'dropdown':
        return (
          <Select value={value} onValueChange={onChange} disabled={isPreview}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'linear_scale':
        const min = question.settings?.linearScaleMin || 1;
        const max = question.settings?.linearScaleMax || 5;
        const minLabel = question.settings?.linearScaleLabels?.min;
        const maxLabel = question.settings?.linearScaleLabels?.max;
        
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{minLabel || min}</span>
              <span>{maxLabel || max}</span>
            </div>
            <div className="flex items-center justify-between space-x-2">
              {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((num) => (
                <label key={num} className="flex flex-col items-center space-y-1 cursor-pointer">
                  <input
                    type="radio"
                    name={`scale-${question.id}`}
                    value={num.toString()}
                    checked={value === num.toString()}
                    onChange={(e) => onChange?.(e.target.value)}
                    disabled={isPreview}
                    className="text-blue-600"
                  />
                  <span className="text-xs">{num}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={isPreview}
          />
        );

      case 'time':
        return (
          <Input
            type="time"
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={isPreview}
          />
        );

      case 'email':
        return (
          <Input
            type="email"
            placeholder="Enter your email"
            value={textValue}
            onChange={(e) => {
              setTextValue(e.target.value);
              onChange?.(e.target.value);
            }}
            disabled={isPreview}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder="Enter a number"
            value={textValue}
            onChange={(e) => {
              setTextValue(e.target.value);
              onChange?.(e.target.value);
            }}
            disabled={isPreview}
            min={question.validation?.min}
            max={question.validation?.max}
          />
        );

      case 'multiple_choice_grid':
        return (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 text-left text-sm font-medium bg-gray-50"></th>
                    {question.gridColumns?.map((col) => (
                      <th key={col.id} className="border border-gray-300 p-2 text-center text-sm font-medium bg-gray-50">
                        {col.text}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {question.gridRows?.map((row) => (
                    <tr key={row.id}>
                      <td className="border border-gray-300 p-2 text-sm font-medium bg-gray-50">
                        {row.text}
                      </td>
                      {question.gridColumns?.map((col) => (
                        <td key={col.id} className="border border-gray-300 p-2 text-center">
                          <input
                            type="radio"
                            name={`grid-${question.id}-${row.id}`}
                            value={`${row.value}-${col.value}`}
                            disabled={isPreview}
                            className="text-blue-600"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'checkbox_grid':
        return (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 text-left text-sm font-medium bg-gray-50"></th>
                    {question.gridColumns?.map((col) => (
                      <th key={col.id} className="border border-gray-300 p-2 text-center text-sm font-medium bg-gray-50">
                        {col.text}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {question.gridRows?.map((row) => (
                    <tr key={row.id}>
                      <td className="border border-gray-300 p-2 text-sm font-medium bg-gray-50">
                        {row.text}
                      </td>
                      {question.gridColumns?.map((col) => (
                        <td key={col.id} className="border border-gray-300 p-2 text-center">
                          <input
                            type="checkbox"
                            value={`${row.value}-${col.value}`}
                            disabled={isPreview}
                            className="text-blue-600"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'paragraph':
        return (
          <div className="text-gray-600 text-sm">
            <p>{question.description || 'Paragraph text'}</p>
          </div>
        );

      case 'title_description':
        return (
          <div className="space-y-2">
            <h4 className="text-lg font-medium text-gray-900">{question.title}</h4>
            {question.description && (
              <p className="text-gray-600 text-sm">{question.description}</p>
            )}
          </div>
        );

      case 'image':
        return (
          <div className="space-y-2">
            {question.settings?.imageUrl && (
              <img 
                src={question.settings.imageUrl} 
                alt={question.settings.imageAlt || 'Question image'}
                className="max-w-full h-auto rounded-lg"
              />
            )}
            {question.settings?.imageAlt && (
              <p className="text-xs text-gray-500 text-center">{question.settings.imageAlt}</p>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="space-y-2">
            {question.settings?.videoUrl && (
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Video: {question.settings.videoTitle || question.settings.videoUrl}</p>
              </div>
            )}
          </div>
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div className="border-l-4 border-l-[#673ab7] bg-white p-4">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {questionNumber}. {question.title}
            {question.required && <span className="text-red-500 ml-1 font-bold">*</span>}
          </h3>
          {question.description && (
            <p className="text-sm text-gray-600 mt-1">{question.description}</p>
          )}
        </div>
        
        <div className="mt-4">
          {renderQuestionContent()}
        </div>
      </div>
    </div>
  );
};

export default QuestionRenderer;
