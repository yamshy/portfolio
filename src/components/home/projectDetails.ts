import type { Project } from '../../content/home';

export type ProjectDetail = {
  title: string;
  items: readonly string[];
  listClass?: string;
};

export type ProjectDetailMap = Record<
  'stack' | 'results' | 'challenges',
  ProjectDetail
>;

export function getProjectDetails(
  project: Pick<Project, 'stack' | 'results' | 'challenges'>,
): ProjectDetailMap {
  return {
    stack: {
      title: 'Stack',
      items: project.stack,
      listClass: 'project-card__tags',
    },
    results: {
      title: 'Results',
      items: project.results,
    },
    challenges: {
      title: 'Technical Challenges',
      items: project.challenges,
    },
  };
}
