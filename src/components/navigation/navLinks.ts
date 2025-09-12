// Shared navigation link sources for both SidebarNav and MobileNav

export type MainNavItem = {
  href: string;
  label: string;
  section: 'about' | 'work' | 'evolution' | 'contact';
  style: string;
};

export type ExternalLink = {
  href: string;
  label: string;
  style: string;
};

export const mainNavItems: MainNavItem[] = [
  {
    href: '#about',
    label: 'Home',
    section: 'about',
    style:
      'bg-glass-coral border-coral text-coral hover:bg-coral hover:rotate-1',
  },
  {
    href: '#work',
    label: 'Projects',
    section: 'work',
    style: 'bg-glass-blue border-blue text-blue hover:bg-blue hover:rotate-1',
  },
  {
    href: '#evolution',
    label: 'Experience',
    section: 'evolution',
    style:
      'bg-glass-mocha border-mocha text-mocha hover:bg-mocha hover:-rotate-1',
  },
  {
    href: '#contact',
    label: 'Contact',
    section: 'contact',
    style:
      'bg-glass-yellow border-accent-yellow text-text-dark hover:bg-accent-yellow hover:-rotate-1',
  },
];

export const externalLinks: ExternalLink[] = [
  {
    href: 'https://github.com/yamshy',
    label: 'GitHub',
    style:
      'bg-glass-mocha border-mocha text-mocha hover:bg-mocha hover:-rotate-1',
  },
  {
    href: 'mailto:sajudia@proton.me',
    label: 'Email',
    style:
      'bg-glass-coral border-coral text-coral hover:bg-coral hover:rotate-1',
  },
];