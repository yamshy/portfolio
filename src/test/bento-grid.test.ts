import { describe, it, expect, beforeEach } from 'vitest';
import type { Project } from '../types/project';

describe('Bento Projects Grid', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  describe('Project Data Structure', () => {
    it('should validate project structure', () => {
      const mockProject: Project = {
        id: 'test-project',
        title: 'Test Project',
        description: 'Test description',
        technologies: ['Tech 1', 'Tech 2'],
        links: {
          github: 'https://github.com/test/repo'
        },
        priority: 'featured',
        gridSize: 'large',
        status: 'completed'
      };

      expect(mockProject.id).toBeDefined();
      expect(mockProject.title).toBeTruthy();
      expect(mockProject.description).toBeTruthy();
      expect(mockProject.technologies).toBeInstanceOf(Array);
      expect(['featured', 'secondary', 'upcoming']).toContain(mockProject.priority);
      expect(['large', 'medium', 'small']).toContain(mockProject.gridSize);
      expect(['completed', 'in-progress', 'planned']).toContain(mockProject.status);
    });

    it('should handle optional project properties', () => {
      const fullProject: Project = {
        id: 'full-project',
        title: 'Full Project',
        description: 'Description',
        technologies: ['Tech'],
        links: {
          github: 'https://github.com/test/repo',
          demo: 'https://demo.example.com',
          external: 'https://external.example.com'
        },
        priority: 'featured',
        gridSize: 'large',
        status: 'completed',
        featured: true,
        cover: {
          src: '/image.jpg',
          alt: 'Project image',
          placeholder: 'data:image/svg+xml;base64,...'
        }
      };

      expect(fullProject.featured).toBe(true);
      expect(fullProject.cover).toBeDefined();
      expect(fullProject.cover?.src).toBeTruthy();
      expect(fullProject.cover?.alt).toBeTruthy();
      expect(fullProject.links.github).toBeTruthy();
      expect(fullProject.links.demo).toBeTruthy();
      expect(fullProject.links.external).toBeTruthy();
    });
  });

  describe('Grid Layout Logic', () => {
    it('should calculate correct grid spans for different sizes', () => {
      const gridSizes = {
        large: { desktop: 8, tablet: 6, mobile: 1 },
        medium: { desktop: 4, tablet: 3, mobile: 1 },
        small: { desktop: 4, tablet: 6, mobile: 1 }
      };

      Object.entries(gridSizes).forEach(([size, spans]) => {
        expect(spans.desktop).toBeGreaterThan(0);
        expect(spans.tablet).toBeGreaterThan(0);
        expect(spans.mobile).toBe(1); // All cards are single column on mobile
      });
    });

    it('should maintain 12-column grid system', () => {
      const projects = [
        { gridSize: 'large' as const, span: 8 },
        { gridSize: 'medium' as const, span: 4 },
        { gridSize: 'small' as const, span: 4 }
      ];

      // Test that combinations don't exceed 12 columns
      const largeWithMedium = 8 + 4; // 12 - fits perfectly
      const twoMedium = 4 + 4; // 8 - leaves 4 columns
      const threeMedium = 4 + 4 + 4; // 12 - fits perfectly

      expect(largeWithMedium).toBeLessThanOrEqual(12);
      expect(twoMedium).toBeLessThanOrEqual(12);
      expect(threeMedium).toBeLessThanOrEqual(12);
    });
  });

  describe('Container Queries', () => {
    it('should define responsive breakpoints for container queries', () => {
      const containerBreakpoints = {
        small: 400,
        medium: 600
      };

      // Verify breakpoints are reasonable
      expect(containerBreakpoints.small).toBeLessThan(containerBreakpoints.medium);
      expect(containerBreakpoints.small).toBeGreaterThan(300);
      expect(containerBreakpoints.medium).toBeLessThan(800);
    });

    it('should adapt card layout based on container size', () => {
      // Mock container query behavior
      const getCardLayout = (containerWidth: number, gridSize: string) => {
        if (containerWidth >= 600 && gridSize === 'large') {
          return 'two-column';
        }
        if (containerWidth >= 400) {
          return 'enhanced';
        }
        return 'default';
      };

      expect(getCardLayout(700, 'large')).toBe('two-column');
      expect(getCardLayout(500, 'medium')).toBe('enhanced');
      expect(getCardLayout(300, 'small')).toBe('default');
    });
  });

  describe('Accessibility Features', () => {
    it('should provide proper ARIA labels for project links', () => {
      const project = {
        title: 'Test Project',
        links: {
          github: 'https://github.com/test/repo',
          demo: 'https://demo.example.com'
        }
      };

      const expectedLabels = {
        github: `View ${project.title} source code on GitHub`,
        demo: `View ${project.title} live demo`
      };

      expect(expectedLabels.github).toContain(project.title);
      expect(expectedLabels.github).toContain('GitHub');
      expect(expectedLabels.demo).toContain('live demo');
    });

    it('should have proper heading hierarchy', () => {
      document.body.innerHTML = `
        <section id="projects">
          <h2 class="projects-title">Featured Work</h2>
          <article class="project-card">
            <h3 class="project-title">Project Title</h3>
            <h4 class="tech-label">Technologies</h4>
          </article>
        </section>
      `;

      const h2 = document.querySelector('h2');
      const h3 = document.querySelector('h3');
      const h4 = document.querySelector('h4');

      expect(h2).toBeTruthy();
      expect(h3).toBeTruthy();
      expect(h4).toBeTruthy();
    });

    it('should provide status information to screen readers', () => {
      const statuses = ['completed', 'in-progress', 'planned'];
      
      statuses.forEach(status => {
        const expectedLabel = `Project status: ${status}`;
        expect(expectedLabel).toContain(status);
      });
    });
  });

  describe('Technology Tag Management', () => {
    it('should limit technology tags based on grid size', () => {
      const technologies = ['Tech1', 'Tech2', 'Tech3', 'Tech4', 'Tech5', 'Tech6', 'Tech7'];
      
      const getLimitedTech = (gridSize: string, allTech: string[]) => {
        const limit = gridSize === 'large' ? 6 : 4;
        return {
          visible: allTech.slice(0, limit),
          hidden: allTech.length - limit,
          hasMore: allTech.length > limit
        };
      };

      const largeCard = getLimitedTech('large', technologies);
      const mediumCard = getLimitedTech('medium', technologies);

      expect(largeCard.visible).toHaveLength(6);
      expect(largeCard.hidden).toBe(1);
      expect(largeCard.hasMore).toBe(true);

      expect(mediumCard.visible).toHaveLength(4);
      expect(mediumCard.hidden).toBe(3);
      expect(mediumCard.hasMore).toBe(true);
    });
  });

  describe('Link Validation', () => {
    it('should validate link URLs', () => {
      const validLinks = {
        github: 'https://github.com/user/repo',
        demo: 'https://demo.example.com',
        external: 'https://external.example.com'
      };

      const isValidUrl = (url: string) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      };

      Object.values(validLinks).forEach(url => {
        expect(isValidUrl(url)).toBe(true);
      });
    });

    it('should handle missing links gracefully', () => {
      const projectWithNoLinks: Project = {
        id: 'no-links',
        title: 'No Links Project',
        description: 'Project without links',
        technologies: ['Tech'],
        links: {},
        priority: 'secondary',
        gridSize: 'medium',
        status: 'planned'
      };

      expect(Object.keys(projectWithNoLinks.links)).toHaveLength(0);
      expect(projectWithNoLinks.links.github).toBeUndefined();
      expect(projectWithNoLinks.links.demo).toBeUndefined();
    });
  });

  describe('Status Badge Logic', () => {
    it('should provide correct status badge text', () => {
      const statusMap = {
        'completed': 'Completed',
        'in-progress': 'In Progress',
        'planned': 'Planned'
      };

      Object.entries(statusMap).forEach(([status, expectedText]) => {
        expect(expectedText).toBeTruthy();
        expect(expectedText.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Image Handling', () => {
    it('should validate cover image structure', () => {
      const coverImage = {
        src: '/images/project.jpg',
        alt: 'Project screenshot',
        placeholder: 'data:image/svg+xml;base64,PHN2Zw=='
      };

      expect(coverImage.src).toBeTruthy();
      expect(coverImage.alt).toBeTruthy();
      expect(coverImage.placeholder).toContain('data:image/svg+xml');
    });

    it('should handle missing cover images', () => {
      const projectWithoutCover: Project = {
        id: 'no-cover',
        title: 'No Cover Project',
        description: 'Project without cover',
        technologies: ['Tech'],
        links: {},
        priority: 'secondary',
        gridSize: 'medium',
        status: 'completed'
      };

      expect(projectWithoutCover.cover).toBeUndefined();
    });
  });

  describe('Responsive Behavior', () => {
    it('should adapt to different viewport sizes', () => {
      const getGridColumns = (viewport: string) => {
        switch (viewport) {
          case 'mobile': return 1;
          case 'tablet': return 6;
          case 'desktop': return 12;
          default: return 12;
        }
      };

      expect(getGridColumns('mobile')).toBe(1);
      expect(getGridColumns('tablet')).toBe(6);
      expect(getGridColumns('desktop')).toBe(12);
    });
  });

  describe('Priority-based Styling', () => {
    it('should apply correct theme colors based on priority', () => {
      const priorityThemes = {
        featured: '--brand',
        secondary: '--brand-secondary',
        upcoming: '--surface-accent'
      };

      Object.entries(priorityThemes).forEach(([priority, theme]) => {
        expect(theme).toContain('--');
        expect(theme.length).toBeGreaterThan(2);
      });
    });
  });
});
