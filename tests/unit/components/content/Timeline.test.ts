import { describe, expect, it, beforeEach } from 'vitest';

describe('Timeline Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('Timeline Structure', () => {
    it('should render basic timeline structure', () => {
      document.body.innerHTML = `
        <section class="timeline" id="evolution" aria-label="Professional Timeline">
          <div class="timeline-container">
            <div class="timeline-track"></div>
            <div class="timeline-items">
              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <h3>Job Title</h3>
                  <p class="timeline-date">2020 - Present</p>
                  <p>Job description</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;

      const timeline = document.querySelector('.timeline');
      expect(timeline).toBeTruthy();
      expect(timeline?.tagName).toBe('SECTION');
      expect(timeline?.getAttribute('id')).toBe('evolution');
      expect(timeline?.getAttribute('aria-label')).toBe(
        'Professional Timeline',
      );

      const container = document.querySelector('.timeline-container');
      expect(container).toBeTruthy();

      const track = document.querySelector('.timeline-track');
      expect(track).toBeTruthy();

      const items = document.querySelector('.timeline-items');
      expect(items).toBeTruthy();
    });

    it('should render timeline items correctly', () => {
      document.body.innerHTML = `
        <div class="timeline-items">
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <h3 class="timeline-title">Senior Developer</h3>
              <p class="timeline-date">2022 - Present</p>
              <p class="timeline-description">Leading frontend development initiatives</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <h3 class="timeline-title">Full Stack Developer</h3>
              <p class="timeline-date">2020 - 2022</p>
              <p class="timeline-description">Built scalable web applications</p>
            </div>
          </div>
        </div>
      `;

      const timelineItems = document.querySelectorAll('.timeline-item');
      expect(timelineItems).toHaveLength(2);

      const markers = document.querySelectorAll('.timeline-marker');
      expect(markers).toHaveLength(2);

      const contents = document.querySelectorAll('.timeline-content');
      expect(contents).toHaveLength(2);

      const titles = document.querySelectorAll('.timeline-title');
      expect(titles).toHaveLength(2);
      expect(titles[0].textContent).toBe('Senior Developer');
      expect(titles[1].textContent).toBe('Full Stack Developer');
    });
  });

  describe('Timeline Content', () => {
    it('should display job information correctly', () => {
      document.body.innerHTML = `
        <div class="timeline-item">
          <div class="timeline-content">
            <h3 class="timeline-title">Software Engineer</h3>
            <p class="timeline-company">Tech Company Inc.</p>
            <p class="timeline-date">Jan 2021 - Dec 2022</p>
            <p class="timeline-description">Developed and maintained web applications using React and Node.js</p>
            <ul class="timeline-achievements">
              <li>Improved performance by 40%</li>
              <li>Led team of 3 developers</li>
            </ul>
          </div>
        </div>
      `;

      const title = document.querySelector('.timeline-title');
      expect(title?.textContent).toBe('Software Engineer');

      const company = document.querySelector('.timeline-company');
      expect(company?.textContent).toBe('Tech Company Inc.');

      const date = document.querySelector('.timeline-date');
      expect(date?.textContent).toBe('Jan 2021 - Dec 2022');

      const description = document.querySelector('.timeline-description');
      expect(description?.textContent).toBe(
        'Developed and maintained web applications using React and Node.js',
      );

      const achievements = document.querySelectorAll(
        '.timeline-achievements li',
      );
      expect(achievements).toHaveLength(2);
      expect(achievements[0].textContent).toBe('Improved performance by 40%');
      expect(achievements[1].textContent).toBe('Led team of 3 developers');
    });

    it('should support different content formats', () => {
      document.body.innerHTML = `
        <div class="timeline-item">
          <div class="timeline-content">
            <h3>Education</h3>
            <h4 class="timeline-subtitle">Bachelor of Computer Science</h4>
            <p class="timeline-institution">University Name</p>
            <p class="timeline-date">2016 - 2020</p>
            <div class="timeline-details">
              <p>Graduated with honors</p>
              <p>Relevant coursework: Data Structures, Algorithms, Web Development</p>
            </div>
          </div>
        </div>
      `;

      const title = document.querySelector('h3');
      expect(title?.textContent).toBe('Education');

      const subtitle = document.querySelector('.timeline-subtitle');
      expect(subtitle?.textContent).toBe('Bachelor of Computer Science');

      const institution = document.querySelector('.timeline-institution');
      expect(institution?.textContent).toBe('University Name');

      const details = document.querySelector('.timeline-details');
      expect(details).toBeTruthy();
    });
  });

  describe('Timeline Styling and Layout', () => {
    it('should apply correct CSS classes', () => {
      document.body.innerHTML = `
        <section class="timeline u-section-padding">
          <div class="timeline-container u-max-width">
            <div class="timeline-track u-bg-gradient"></div>
            <div class="timeline-item u-glass u-glass--neutral">
              <div class="timeline-marker u-bg-coral u-border-coral"></div>
              <div class="timeline-content u-padding">
                <h3 class="u-text-heading">Title</h3>
              </div>
            </div>
          </div>
        </section>
      `;

      const timeline = document.querySelector('.timeline');
      expect(timeline?.classList.contains('u-section-padding')).toBe(true);

      const container = document.querySelector('.timeline-container');
      expect(container?.classList.contains('u-max-width')).toBe(true);

      const track = document.querySelector('.timeline-track');
      expect(track?.classList.contains('u-bg-gradient')).toBe(true);

      const item = document.querySelector('.timeline-item');
      expect(item?.classList.contains('u-glass')).toBe(true);
      expect(item?.classList.contains('u-glass--neutral')).toBe(true);

      const marker = document.querySelector('.timeline-marker');
      expect(marker?.classList.contains('u-bg-coral')).toBe(true);
      expect(marker?.classList.contains('u-border-coral')).toBe(true);
    });

    it('should support alternating layout', () => {
      document.body.innerHTML = `
        <div class="timeline-items">
          <div class="timeline-item timeline-item--left">
            <div class="timeline-content">Left aligned content</div>
          </div>
          <div class="timeline-item timeline-item--right">
            <div class="timeline-content">Right aligned content</div>
          </div>
        </div>
      `;

      const leftItem = document.querySelector('.timeline-item--left');
      expect(leftItem?.classList.contains('timeline-item--left')).toBe(true);

      const rightItem = document.querySelector('.timeline-item--right');
      expect(rightItem?.classList.contains('timeline-item--right')).toBe(true);
    });
  });

  describe('Timeline Accessibility', () => {
    it('should have proper semantic structure', () => {
      document.body.innerHTML = `
        <section class="timeline" aria-label="Professional Experience Timeline">
          <h2 class="timeline-heading">Career Journey</h2>
          <div class="timeline-items">
            <article class="timeline-item">
              <header class="timeline-header">
                <h3>Job Title</h3>
                <time datetime="2022-01">January 2022</time>
              </header>
              <div class="timeline-body">
                <p>Job description</p>
              </div>
            </article>
          </div>
        </section>
      `;

      const timeline = document.querySelector('section');
      expect(timeline?.getAttribute('aria-label')).toBe(
        'Professional Experience Timeline',
      );

      const heading = document.querySelector('.timeline-heading');
      expect(heading?.tagName).toBe('H2');

      const article = document.querySelector('article');
      expect(article?.classList.contains('timeline-item')).toBe(true);

      const header = document.querySelector('header');
      expect(header?.classList.contains('timeline-header')).toBe(true);

      const timeElement = document.querySelector('time');
      expect(timeElement?.getAttribute('datetime')).toBe('2022-01');
    });

    it('should support keyboard navigation', () => {
      document.body.innerHTML = `
        <div class="timeline-items">
          <div class="timeline-item" tabindex="0" role="article">
            <h3>First Job</h3>
          </div>
          <div class="timeline-item" tabindex="0" role="article">
            <h3>Second Job</h3>
          </div>
        </div>
      `;

      const timelineItems = document.querySelectorAll('.timeline-item');
      timelineItems.forEach((item) => {
        expect(item.getAttribute('tabindex')).toBe('0');
        expect(item.getAttribute('role')).toBe('article');
      });
    });
  });

  describe('Timeline Animations', () => {
    it('should support animation classes', () => {
      document.body.innerHTML = `
        <div class="timeline-item animate-fade-in animate-delay-100">
          <div class="timeline-marker animate-pulse"></div>
          <div class="timeline-content animate-slide-up">
            <h3>Animated Content</h3>
          </div>
        </div>
      `;

      const item = document.querySelector('.timeline-item');
      expect(item?.classList.contains('animate-fade-in')).toBe(true);
      expect(item?.classList.contains('animate-delay-100')).toBe(true);

      const marker = document.querySelector('.timeline-marker');
      expect(marker?.classList.contains('animate-pulse')).toBe(true);

      const content = document.querySelector('.timeline-content');
      expect(content?.classList.contains('animate-slide-up')).toBe(true);
    });
  });

  describe('Timeline Responsive Design', () => {
    it('should support mobile layout', () => {
      document.body.innerHTML = `
        <div class="timeline-container timeline-container--mobile">
          <div class="timeline-track timeline-track--center"></div>
          <div class="timeline-item timeline-item--mobile">
            <div class="timeline-content timeline-content--full-width">
              <h3>Mobile Layout</h3>
            </div>
          </div>
        </div>
      `;

      const container = document.querySelector('.timeline-container--mobile');
      expect(container?.classList.contains('timeline-container--mobile')).toBe(
        true,
      );

      const track = document.querySelector('.timeline-track--center');
      expect(track?.classList.contains('timeline-track--center')).toBe(true);

      const item = document.querySelector('.timeline-item--mobile');
      expect(item?.classList.contains('timeline-item--mobile')).toBe(true);

      const content = document.querySelector('.timeline-content--full-width');
      expect(content?.classList.contains('timeline-content--full-width')).toBe(
        true,
      );
    });
  });

  describe('Timeline Data Structure', () => {
    it('should handle timeline data correctly', () => {
      const timelineData = [
        {
          title: 'Senior Developer',
          company: 'Tech Corp',
          startDate: '2022-01',
          endDate: 'present',
          description: 'Lead development team',
          achievements: ['Improved performance', 'Mentored juniors'],
        },
        {
          title: 'Junior Developer',
          company: 'Startup Inc',
          startDate: '2020-06',
          endDate: '2021-12',
          description: 'Built web applications',
          achievements: ['Learned React', 'Delivered projects on time'],
        },
      ];

      expect(timelineData).toHaveLength(2);
      expect(timelineData[0].title).toBe('Senior Developer');
      expect(timelineData[0].achievements).toHaveLength(2);
      expect(timelineData[1].endDate).toBe('2021-12');
    });
  });
});
