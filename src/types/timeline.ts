export interface TimelinePhase {
  id: string;
  period: string;
  title: string;
  description: string;
  expandedDescription?: string;
  skills: string[];
  links?: Array<{
    label: string;
    url: string;
    type: 'external' | 'internal';
  }>;
  themeColor: 'coral' | 'mocha' | 'blue' | 'yellow';
  isCurrentRole?: boolean;
}

export interface TimelineProps {
  phases: TimelinePhase[];
  class?: string;
}
