import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Upload, 
  Camera, 
  Link, 
  Image as ImageIcon, 
  X, 
  AlertCircle,
  Download
} from 'lucide-react';

interface ImageInsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (imageData: { url: string; alt?: string; title?: string }) => void;
  theme: {
    primaryColor: string;
  };
}

const ImageInsertModal: React.FC<ImageInsertModalProps> = ({
  isOpen,
  onClose,
  onInsertImage,
  theme
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'webcam' | 'url' | 'photos' | 'drive' | 'images'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageTitle, setImageTitle] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const tabs = [
    { id: 'upload' as const, label: 'Upload', icon: Upload },
    { id: 'webcam' as const, label: 'Webcam', icon: Camera },
    { id: 'url' as const, label: 'By URL', icon: Link },
    { id: 'photos' as const, label: 'Photos', icon: ImageIcon },
    { id: 'drive' as const, label: 'Google Drive', icon: Download },
    { id: 'images' as const, label: 'Google Images', icon: ImageIcon }
  ];

  const handleFileUpload = useCallback((files: FileList | File[]) => {
    const file = Array.from(files)[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setImageUrl(url);
      setError(null);
    } else {
      setError('Please select a valid image file');
    }
  }, []);

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
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleUrlChange = useCallback((url: string) => {
    setImageUrl(url);
    setError(null);
    
    // Validate URL and create preview
    if (url) {
      const img = new Image();
      img.onload = () => {
        setPreviewUrl(url);
      };
      img.onerror = () => {
        setError('Invalid image URL');
        setPreviewUrl(null);
      };
      img.src = url;
    } else {
      setPreviewUrl(null);
    }
  }, []);

  const startWebcam = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      setStream(mediaStream);
      if (webcamRef.current) {
        webcamRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      setError('Unable to access webcam. Please check permissions.');
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = webcamRef.current.videoWidth;
        canvas.height = webcamRef.current.videoHeight;
        context.drawImage(webcamRef.current, 0, 0);
        
        const dataUrl = canvas.toDataURL('image/png');
        setPreviewUrl(dataUrl);
        setImageUrl(dataUrl);
        stopWebcam();
      }
    }
  }, [stopWebcam]);

  const handleInsert = useCallback(() => {
    if (imageUrl) {
      onInsertImage({
        url: imageUrl,
        alt: imageAlt,
        title: imageTitle
      });
      onClose();
      // Reset form
      setImageUrl('');
      setImageAlt('');
      setImageTitle('');
      setPreviewUrl(null);
      setError(null);
    }
  }, [imageUrl, imageAlt, imageTitle, onInsertImage, onClose]);

  const handleClose = useCallback(() => {
    stopWebcam();
    onClose();
    // Reset form
    setImageUrl('');
    setImageAlt('');
    setImageTitle('');
    setPreviewUrl(null);
    setError(null);
  }, [stopWebcam, onClose]);

  if (!isOpen) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload':
        return (
          <div className="space-y-6">
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
                {/* Google Forms-style cloud icon */}
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                  </svg>
                </div>
                
                <div>
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                    Browse
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    or drag a file here
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        );

      case 'webcam':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900 mb-4">Take a Photo</p>
              
              {!stream ? (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                  <Button
                    onClick={startWebcam}
                    className="px-6 py-2"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative mx-auto w-full max-w-md">
                    <video
                      ref={webcamRef}
                      autoPlay
                      playsInline
                      className="w-full h-auto rounded-lg border border-gray-300"
                    />
                  </div>
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={capturePhoto}
                      className="px-6 py-2"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Capture Photo
                    </Button>
                    <Button
                      variant="outline"
                      onClick={stopWebcam}
                      className="px-6 py-2"
                    >
                      Stop Camera
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'url':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        );

      case 'photos':
        return (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">Photos</p>
            <p className="text-sm text-gray-500">Access your photo library</p>
            <p className="text-xs text-gray-400 mt-2">Feature coming soon</p>
          </div>
        );

      case 'drive':
        return (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Download className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">Google Drive</p>
            <p className="text-sm text-gray-500">Access your Google Drive files</p>
            <p className="text-xs text-gray-400 mt-2">Feature coming soon</p>
          </div>
        );

      case 'images':
        return (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">Google Images</p>
            <p className="text-sm text-gray-500">Search for images online</p>
            <p className="text-xs text-gray-400 mt-2">Feature coming soon</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Insert image</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 flex-shrink-0">
          <div className="flex space-x-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 flex-1 overflow-y-auto">
          {renderTabContent()}

          {/* Image Preview - Google Forms Style */}
          {previewUrl && (
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Preview</h3>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                {/* Form-like header */}
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                    <span className="text-sm font-medium text-gray-700">Untitled form</span>
                  </div>
                </div>
                
                {/* Form content with image */}
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Form title */}
                    <div className="border-b border-gray-200 pb-2">
                      <h2 className="text-xl font-normal text-gray-900 text-left">Untitled form</h2>
                      <p className="text-sm text-gray-500 mt-1 text-left">Form description</p>
                    </div>
                    
                    {/* Image in form context */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-auto max-h-64 object-contain rounded"
                      />
                    </div>
                    
                    {/* Sample question below image */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">1</span>
                        <span className="text-sm text-gray-500">*</span>
                      </div>
                      <div className="text-sm text-gray-600 text-left">Untitled Question</div>
                      <div className="w-full h-8 border border-gray-300 rounded bg-white"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Image Details */}
          {imageUrl && (
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Image Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alt Text (optional)
                  </label>
                  <Input
                    placeholder="Describe the image for accessibility"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title (optional)
                  </label>
                  <Input
                    placeholder="Image title"
                    value={imageTitle}
                    onChange={(e) => setImageTitle(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}
        </div>

        {/* Footer - Always visible */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleClose}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleInsert}
            disabled={!imageUrl}
            className="px-4 py-2"
            style={{ backgroundColor: theme.primaryColor }}
          >
            Insert Image
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageInsertModal;
