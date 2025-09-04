export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  links: {
    github?: string;
    demo?: string;
    external?: string;
  };
  priority: 'featured' | 'secondary' | 'upcoming';
  gridSize: 'large' | 'medium' | 'small';
  cover?: {
    src: string;
    alt: string;
    placeholder?: string;
  };
  status: 'completed' | 'in-progress' | 'planned';
  featured?: boolean;
}

export interface BentoGridProps {
  projects: Project[];
  class?: string;
}
