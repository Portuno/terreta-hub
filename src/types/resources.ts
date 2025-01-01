export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  resource_type: 'guide' | 'course' | 'link';
  url?: string;
  instructor?: string;
  course_syllabus?: string;
  content_format?: string;
  duration?: string;
  user_id: string;
}

export interface ResourceFormFields {
  title: string;
  description: string;
  resourceType: 'guide' | 'course' | 'link';
  url?: string;
  instructor?: string;
  courseSyllabus?: string;
  contentFormat?: string;
  duration?: string;
}