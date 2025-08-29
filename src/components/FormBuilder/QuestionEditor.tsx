import React, { useState } from 'react';
import type { Question, QuestionType } from '@/types/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface QuestionEditorProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onUpdate,
  onDelete
}) => {
  const [newOption, setNewOption] = useState('');

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
    { value: 'paragraph', label: 'Paragraph', icon: '¶' },
    { value: 'title_description', label: 'Title & Description', icon: '📝' },
    { value: 'image', label: 'Image', icon: '🖼️' },
    { value: 'video', label: 'Video', icon: '🎥' },
  ];

  const addOption = () => {
    if (newOption.trim() && question.options) {
      const option = {
        id: uuidv4(),
        text: newOption.trim(),
        value: newOption.trim().toLowerCase().replace(/\s+/g, '_')
      };
      onUpdate({
        options: [...question.options, option]
      });
      setNewOption('');
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

  const renderOptionsEditor = () => {
    if (!['multiple_choice', 'checkbox', 'dropdown'].includes(question.type)) {
      return null;
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-indigo-600 text-xs font-medium">5</span>
          </div>
          <h4 className="font-semibold text-gray-700">Answer Options</h4>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div key={option.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-[#673ab7] transition-all duration-200">
                <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
                  <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                </div>
                <Input
                  value={option.text}
                  onChange={(e) => updateOption(option.id, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 border-0 focus:ring-0 bg-transparent text-sm"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(option.id)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-[#673ab7] transition-all duration-200">
              <div className="flex items-center justify-center w-6 h-6 bg-[#673ab7] rounded-full">
                <Plus className="h-3 w-3 text-white" />
              </div>
              <Input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Add new option..."
                onKeyPress={(e) => e.key === 'Enter' && addOption()}
                className="flex-1 border-0 focus:ring-0 bg-transparent text-sm"
              />
              <Button 
                size="sm" 
                onClick={addOption}
                className="bg-[#673ab7] hover:bg-[#5e35b1] text-white px-3 py-1 rounded-lg"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
        
        {/* Additional settings for multiple choice and checkbox */}
        {['multiple_choice', 'checkbox'].includes(question.type) && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="allowOther"
                  checked={question.settings?.allowOther || false}
                  onChange={(e) => onUpdate({
                    settings: { ...question.settings, allowOther: e.target.checked }
                  })}
                  className="w-4 h-4 text-[#673ab7] border-gray-300 rounded focus:ring-[#673ab7]"
                />
                <div>
                  <label htmlFor="allowOther" className="text-sm font-medium text-gray-700">
                    Include "Other" option
                  </label>
                  <p className="text-xs text-gray-500">Allow respondents to add custom answers</p>
                </div>
              </div>
            </div>
            
            {question.settings?.allowOther && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <label className="text-sm font-medium text-blue-800 mb-2 block">Other Option Text</label>
                <Input
                  value={question.settings.otherText || 'Other:'}
                  onChange={(e) => onUpdate({
                    settings: { ...question.settings, otherText: e.target.value }
                  })}
                  placeholder="Other option text"
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="shuffleOptions"
                  checked={question.settings?.shuffleOptions || false}
                  onChange={(e) => onUpdate({
                    settings: { ...question.settings, shuffleOptions: e.target.checked }
                  })}
                  className="w-4 h-4 text-[#673ab7] border-gray-300 rounded focus:ring-[#673ab7]"
                />
                <div>
                  <label htmlFor="shuffleOptions" className="text-sm font-medium text-gray-700">
                    Shuffle option order
                  </label>
                  <p className="text-xs text-gray-500">Randomize the order of options for each respondent</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderLinearScaleEditor = () => {
    if (question.type !== 'linear_scale') return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center">
            <span className="text-teal-600 text-xs font-medium">5</span>
          </div>
          <h4 className="font-semibold text-gray-700">Scale Configuration</h4>
        </div>
        
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-4 border border-teal-200">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Minimum Value</label>
              <Input
                type="number"
                value={question.settings?.linearScaleMin || 1}
                onChange={(e) => onUpdate({
                  settings: { ...question.settings, linearScaleMin: parseInt(e.target.value) }
                })}
                className="border-teal-300 focus:border-teal-500 focus:ring-teal-500"
                min={1}
                max={10}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Maximum Value</label>
              <Input
                type="number"
                value={question.settings?.linearScaleMax || 5}
                onChange={(e) => onUpdate({
                  settings: { ...question.settings, linearScaleMax: parseInt(e.target.value) }
                })}
                className="border-teal-300 focus:border-teal-500 focus:ring-teal-500"
                min={2}
                max={10}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Minimum Label (Optional)</label>
              <Input
                value={question.settings?.linearScaleLabels?.min || ''}
                onChange={(e) => onUpdate({
                  settings: {
                    ...question.settings,
                    linearScaleLabels: {
                      ...question.settings?.linearScaleLabels,
                      min: e.target.value
                    }
                  }
                })}
                placeholder="e.g., Not at all satisfied"
                className="border-teal-300 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Maximum Label (Optional)</label>
              <Input
                value={question.settings?.linearScaleLabels?.max || ''}
                onChange={(e) => onUpdate({
                  settings: {
                    ...question.settings,
                    linearScaleLabels: {
                      ...question.settings?.linearScaleLabels,
                      max: e.target.value
                    }
                  }
                })}
                placeholder="e.g., Extremely satisfied"
                className="border-teal-300 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
          </div>
          
          {/* Preview */}
          <div className="mt-4 p-3 bg-white rounded-lg border border-teal-200">
            <p className="text-xs font-medium text-gray-600 mb-2">Preview:</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{question.settings?.linearScaleLabels?.min || question.settings?.linearScaleMin || 1}</span>
              <span>{question.settings?.linearScaleLabels?.max || question.settings?.linearScaleMax || 5}</span>
            </div>
            <div className="flex items-center justify-between space-x-2 mt-2">
              {Array.from({ length: (question.settings?.linearScaleMax || 5) - (question.settings?.linearScaleMin || 1) + 1 }, (_, i) => (question.settings?.linearScaleMin || 1) + i).map((num) => (
                <div key={num} className="flex flex-col items-center space-y-1">
                  <div className="w-4 h-4 border-2 border-teal-300 rounded-full"></div>
                  <span className="text-xs text-gray-600">{num}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGridEditor = () => {
    if (!['multiple_choice_grid', 'checkbox_grid'].includes(question.type)) return null;

    const addGridRow = () => {
      const newRow = {
        id: uuidv4(),
        text: `Row ${(question.gridRows?.length || 0) + 1}`,
        value: `row${(question.gridRows?.length || 0) + 1}`
      };
      onUpdate({
        gridRows: [...(question.gridRows || []), newRow]
      });
    };

    const addGridColumn = () => {
      const newCol = {
        id: uuidv4(),
        text: `Column ${(question.gridColumns?.length || 0) + 1}`,
        value: `col${(question.gridColumns?.length || 0) + 1}`
      };
      onUpdate({
        gridColumns: [...(question.gridColumns || []), newCol]
      });
    };

    const updateGridRow = (rowId: string, text: string) => {
      onUpdate({
        gridRows: question.gridRows?.map(row =>
          row.id === rowId ? { ...row, text, value: text.toLowerCase().replace(/\s+/g, '_') } : row
        )
      });
    };

    const updateGridColumn = (colId: string, text: string) => {
      onUpdate({
        gridColumns: question.gridColumns?.map(col =>
          col.id === colId ? { ...col, text, value: text.toLowerCase().replace(/\s+/g, '_') } : col
        )
      });
    };

    const removeGridRow = (rowId: string) => {
      onUpdate({
        gridRows: question.gridRows?.filter(row => row.id !== rowId)
      });
    };

    const removeGridColumn = (colId: string) => {
      onUpdate({
        gridColumns: question.gridColumns?.filter(col => col.id !== colId)
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600 text-xs font-medium">5</span>
          </div>
          <h4 className="font-semibold text-gray-700">Grid Configuration</h4>
        </div>
        
        {/* Grid Rows */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xs">R</span>
            </div>
            <h5 className="font-medium text-gray-700">Grid Rows</h5>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="space-y-3">
              {question.gridRows?.map((row, index) => (
                <div key={row.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-all duration-200">
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
                    <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <Input
                    value={row.text}
                    onChange={(e) => updateGridRow(row.id, e.target.value)}
                    placeholder={`Row ${index + 1}`}
                    className="flex-1 border-0 focus:ring-0 bg-transparent text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGridRow(row.id)}
                    className="text-blue-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border-2 border-dashed border-blue-300 hover:border-blue-500 transition-all duration-200">
                <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full">
                  <Plus className="h-3 w-3 text-white" />
                </div>
                <Button size="sm" onClick={addGridRow} variant="ghost" className="text-blue-600 hover:text-blue-700">
                  Add Row
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Columns */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xs">C</span>
            </div>
            <h5 className="font-medium text-gray-700">Grid Columns</h5>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="space-y-3">
              {question.gridColumns?.map((col, index) => (
                <div key={col.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-green-200 hover:border-green-400 transition-all duration-200">
                  <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                    <span className="text-xs font-medium text-green-600">{index + 1}</span>
                  </div>
                  <Input
                    value={col.text}
                    onChange={(e) => updateGridColumn(col.id, e.target.value)}
                    placeholder={`Column ${index + 1}`}
                    className="flex-1 border-0 focus:ring-0 bg-transparent text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGridColumn(col.id)}
                    className="text-green-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border-2 border-dashed border-green-300 hover:border-green-500 transition-all duration-200">
                <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
                  <Plus className="h-3 w-3 text-white" />
                </div>
                <Button size="sm" onClick={addGridColumn} variant="ghost" className="text-green-600 hover:text-green-700">
                  Add Column
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Grid Preview */}
        {question.gridRows && question.gridColumns && (
          <div className="space-y-3">
            <h5 className="font-medium text-gray-700">Grid Preview</h5>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2 text-left text-xs font-medium bg-gray-100"></th>
                      {question.gridColumns?.map((col) => (
                        <th key={col.id} className="border border-gray-300 p-2 text-center text-xs font-medium bg-gray-100">
                          {col.text}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {question.gridRows?.map((row) => (
                      <tr key={row.id}>
                        <td className="border border-gray-300 p-2 text-xs font-medium bg-gray-50">
                          {row.text}
                        </td>
                        {question.gridColumns?.map((col) => (
                          <td key={col.id} className="border border-gray-300 p-2 text-center">
                            <div className="w-3 h-3 border border-gray-400 rounded-full mx-auto"></div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#673ab7] to-[#5e35b1] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-medium">⚙️</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Question Settings</h3>
              <p className="text-sm text-gray-500">Customize your question properties</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDelete}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* Question Type */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xs font-medium">1</span>
            </div>
            <label className="text-sm font-semibold text-gray-700">Question Type</label>
          </div>
          <Select
            value={question.type}
            onValueChange={(value: QuestionType) => onUpdate({ type: value })}
          >
            <SelectTrigger className="h-12 border-gray-200 hover:border-[#673ab7] focus:border-[#673ab7] focus:ring-[#673ab7] transition-all duration-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-gray-200 shadow-lg">
              {questionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value} className="hover:bg-gray-50">
                  <div className="flex items-center space-x-3 py-1">
                    <span className="text-lg">{type.icon}</span>
                    <span className="font-medium">{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Question Title */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xs font-medium">2</span>
            </div>
            <label className="text-sm font-semibold text-gray-700">Question Text</label>
          </div>
          <Input
            value={question.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Enter your question here..."
            className="h-12 border-gray-200 hover:border-[#673ab7] focus:border-[#673ab7] focus:ring-[#673ab7] transition-all duration-200 text-base"
          />
        </div>

        {/* Question Description */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-xs font-medium">3</span>
            </div>
            <label className="text-sm font-semibold text-gray-700">Description (Optional)</label>
          </div>
          <Textarea
            value={question.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Add helpful context or instructions..."
            className="border-gray-200 hover:border-[#673ab7] focus:border-[#673ab7] focus:ring-[#673ab7] transition-all duration-200 resize-none"
            rows={3}
          />
        </div>

        {/* Required Toggle */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 text-xs font-medium">4</span>
            </div>
            <label className="text-sm font-semibold text-gray-700">Required Field</label>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="relative">
              <input
                type="checkbox"
                id="required"
                checked={question.required}
                onChange={(e) => onUpdate({ required: e.target.checked })}
                className="sr-only"
              />
              <label
                htmlFor="required"
                className={`block w-12 h-6 rounded-full transition-all duration-200 cursor-pointer ${
                  question.required ? 'bg-[#673ab7]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    question.required ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </label>
            </div>
            <div>
              <label htmlFor="required" className="text-sm font-medium text-gray-700 cursor-pointer">
                Make this question required
              </label>
              <p className="text-xs text-gray-500">Respondents must answer this question</p>
            </div>
          </div>
        </div>

        {/* Options Editor */}
        {renderOptionsEditor()}

        {/* Linear Scale Editor */}
        {renderLinearScaleEditor()}

        {/* Grid Editor */}
        {renderGridEditor()}

        {/* Validation Settings */}
        {['short_text', 'long_text', 'email', 'number'].includes(question.type) && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xs font-medium">6</span>
              </div>
              <h4 className="font-semibold text-gray-700">Validation Rules</h4>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Minimum Length</label>
                  <Input
                    type="number"
                    value={question.validation?.minLength || ''}
                    onChange={(e) => onUpdate({
                      validation: {
                        ...question.validation,
                        minLength: e.target.value ? parseInt(e.target.value) : undefined
                      }
                    })}
                    placeholder="0"
                    className="border-red-300 focus:border-red-500 focus:ring-red-500"
                    min={0}
                  />
                  <p className="text-xs text-gray-500">Minimum characters required</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Maximum Length</label>
                  <Input
                    type="number"
                    value={question.validation?.maxLength || ''}
                    onChange={(e) => onUpdate({
                      validation: {
                        ...question.validation,
                        maxLength: e.target.value ? parseInt(e.target.value) : undefined
                      }
                    })}
                    placeholder="No limit"
                    className="border-red-300 focus:border-red-500 focus:ring-red-500"
                    min={1}
                  />
                  <p className="text-xs text-gray-500">Maximum characters allowed</p>
                </div>
              </div>
              
              {question.type === 'number' && (
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-red-200">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Minimum Value</label>
                    <Input
                      type="number"
                      value={question.validation?.min || ''}
                      onChange={(e) => onUpdate({
                        validation: {
                          ...question.validation,
                          min: e.target.value ? parseInt(e.target.value) : undefined
                        }
                      })}
                      placeholder="No minimum"
                      className="border-red-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Maximum Value</label>
                    <Input
                      type="number"
                      value={question.validation?.max || ''}
                      onChange={(e) => onUpdate({
                        validation: {
                          ...question.validation,
                          max: e.target.value ? parseInt(e.target.value) : undefined
                        }
                      })}
                      placeholder="No maximum"
                      className="border-red-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionEditor;
