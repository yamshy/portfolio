export interface Project {
  title: string;
  link: string;
  description: string;
  technologies: string[];
  image?: string;
  featured?: boolean;
}

export interface NavigationItem {
  href: string;
  label: string;
  section?: string;
  style: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface TimelinePhase {
  period: string;
  title: string;
  description: string;
  tags: string[];
  variant: 'coral' | 'mocha' | 'blue';
}

export interface FormValidation {
  name: boolean;
  email: boolean;
  subject: boolean;
  message: boolean;
}

export type GlassCardVariant = 'coral' | 'mocha' | 'blue' | 'yellow';
export type GlassCardSize = 'sm' | 'md' | 'lg';
