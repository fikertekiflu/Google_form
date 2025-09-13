import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  File, 
  Image, 
  X, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Download
} from 'lucide-react';

interface FileUploadProps {
  question: {
    id: string;
    title: string;
    required: boolean;
    validation?: {
      fileTypes?: string[];
      maxFileSize?: number;
    };
    settings?: {
      allowMultiple?: boolean;
    };
  };
  value?: File[];
  onChange: (files: File[]) => void;
  theme: {
    primaryColor: string;
  };
}

const FileUpload: React.FC<FileUploadProps> = ({
  question,
  value = [],
  onChange,
  theme
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (question.validation?.maxFileSize && file.size > question.validation.maxFileSize) {
      const maxSizeMB = Math.round(question.validation.maxFileSize / (1024 * 1024));
      return `File size must be less than ${maxSizeMB}MB`;
    }

    // Check file type
    if (question.validation?.fileTypes) {
      const isValidType = question.validation.fileTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });

      if (!isValidType) {
        const allowedTypes = question.validation.fileTypes
          .map(type => type.replace('/*', ''))
          .join(', ');
        return `File type must be one of: ${allowedTypes}`;
      }
    }

    return null;
  };

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newFiles = [...value];
    let hasError = false;

    fileArray.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        hasError = true;
        return;
      }

      // Check if file already exists
      const exists = newFiles.some(existingFile => 
        existingFile.name === file.name && existingFile.size === file.size
      );

      if (!exists) {
        if (question.settings?.allowMultiple) {
          newFiles.push(file);
        } else {
          newFiles.splice(0, newFiles.length, file);
        }
      }
    });

    if (!hasError) {
      setError(null);
      onChange(newFiles);
    }
  }, [value, question, onChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const removeFile = useCallback((index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
    setError(null);
  }, [value, onChange]);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else {
      return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAcceptedTypes = () => {
    if (!question.validation?.fileTypes) return 'All files';
    return question.validation.fileTypes
      .map(type => {
        if (type === 'image/*') return 'Images';
        if (type === 'application/pdf') return 'PDF';
        return type;
      })
      .join(', ');
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="h-6 w-6 text-gray-400" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragOver ? 'Drop files here' : 'Upload files'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop files here, or click to select
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Accepted: {getAcceptedTypes()}
              {question.validation?.maxFileSize && (
                <span> • Max size: {formatFileSize(question.validation.maxFileSize)}</span>
              )}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2"
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose Files
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            multiple={question.settings?.allowMultiple}
            accept={question.validation?.fileTypes?.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* File List */}
      {value.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">
            Uploaded Files ({value.length})
          </h4>
          <div className="space-y-2">
            {value.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Required Indicator */}
      {question.required && (
        <p className="text-sm text-gray-500">
          * This field is required
        </p>
      )}
    </div>
  );
};

export default FileUpload;
