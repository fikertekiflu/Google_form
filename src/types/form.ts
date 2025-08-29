export type QuestionType = 
  | 'short_text'
  | 'long_text'
  | 'multiple_choice'
  | 'checkbox'
  | 'dropdown'
  | 'linear_scale'
  | 'multiple_choice_grid'
  | 'checkbox_grid'
  | 'date'
  | 'time'
  | 'file_upload'
  | 'email'
  | 'number'
  | 'paragraph'
  | 'title_description'
  | 'image'
  | 'video';

export interface QuestionOption {
  id: string;
  text: string;
  value: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: QuestionOption[];
  gridRows?: QuestionOption[];
  gridColumns?: QuestionOption[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    fileTypes?: string[];
    maxFileSize?: number;
  };
  settings?: {
    allowMultiple?: boolean;
    allowOther?: boolean;
    otherText?: string;
    shuffleOptions?: boolean;
    linearScaleMin?: number;
    linearScaleMax?: number;
    linearScaleLabels?: {
      min?: string;
      max?: string;
    };
    imageUrl?: string;
    videoUrl?: string;
    imageAlt?: string;
    videoTitle?: string;
  };
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  settings: {
    allowAnonymous: boolean;
    collectEmail: boolean;
    showProgressBar: boolean;
    allowMultipleResponses: boolean;
    responseLimit?: number;
    theme: {
      primaryColor: string;
      backgroundColor: string;
      fontFamily: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface FormResponse {
  id: string;
  formId: string;
  answers: {
    questionId: string;
    value: string | string[] | number | Date;
  }[];
  submittedAt: Date;
  respondentEmail?: string;
}

export interface FormBuilderState {
  currentForm: Form | null;
  selectedQuestionId: string | null;
  isPreviewMode: boolean;
  isPublished: boolean;
}
