import type { AstroComponentFactory } from 'astro/runtime/server/render/index.js';
import { renderToString } from 'astro/runtime/server/render/index.js';
import { describe, expect, it } from 'vitest';

import ProjectCard from '../../../../src/components/home/ProjectCard.astro';
import type { Project } from '../../../../src/content/home';

const createProject = (
  layout: Project['layout'],
  overrides: Partial<Project> = {},
): Project => ({
  title: 'Test Project',
  summary: 'Testing summary copy',
  problem: 'A repeatable problem statement for validation.',
  solution: 'A measured solution capturing implementation details.',
  stack: ['Astro', 'TypeScript'],
  results: ['Improved rendering flow'],
  challenges: ['Ensuring helper reuse across layouts'],
  layout,
  ...overrides,
});

type AstroSSRResult = Parameters<typeof renderToString>[0];

const createResponse = (): AstroSSRResult['response'] => {
  const headers = new Headers();
  return {
    status: 200,
    statusText: 'OK',
    get headers() {
      return headers;
    },
    set headers(_) {
      throw new Error(
        'Reassigning response headers is not supported in tests.',
      );
    },
  };
};

const createTestResult = (): AstroSSRResult => {
  type CreateAstroParams = Parameters<AstroSSRResult['createAstro']>;
  const createAstro: AstroSSRResult['createAstro'] = (
    astroGlobal: CreateAstroParams[0],
    props: CreateAstroParams[1],
    slots: CreateAstroParams[2],
  ) =>
    ({
      ...(astroGlobal as unknown as Record<string, unknown>),
      props,
      slots: slots ?? ({} as CreateAstroParams[2]),
    }) as ReturnType<AstroSSRResult['createAstro']>;

  return {
    base: '/',
    userAssetsBase: undefined,
    cancelled: false,
    styles: new Set(),
    scripts: new Set(),
    links: new Set(),
    componentMetadata: new Map(),
    inlinedScripts: new Map(),
    params: {},
    resolve: async (specifier: string) => specifier,
    response: createResponse(),
    request: new Request('http://example.com/'),
    renderers: [],
    clientDirectives: new Map(),
    compressHTML: false,
    partial: false,
    pathname: '/',
    cookies: undefined,
    serverIslandNameMap: new Map(),
    trailingSlash: 'ignore',
    key: Promise.resolve({} as CryptoKey),
    _metadata: {
      hasHydrationScript: false,
      rendererSpecificHydrationScripts: new Set(),
      hasRenderedHead: false,
      renderedScripts: new Set(),
      hasDirectives: new Set(),
      hasRenderedServerIslandRuntime: false,
      headInTree: false,
      extraHead: [],
      extraStyleHashes: [],
      extraScriptHashes: [],
      propagators: new Set(),
    },
    cspDestination: 'meta',
    shouldInjectCspMetaTags: false,
    cspAlgorithm: 'SHA-256',
    scriptHashes: [],
    scriptResources: [],
    styleHashes: [],
    styleResources: [],
    directives: [],
    isStrictDynamic: false,
    actionResult: undefined,
    createAstro,
  };
};

const renderProjectCard = async (project: Project) => {
  const result = createTestResult();
  const html = await renderToString(
    result,
    ProjectCard as unknown as AstroComponentFactory,
    { project },
    {},
  );

  if (typeof html !== 'string') {
    throw new Error('ProjectCard did not render static HTML.');
  }

  document.body.innerHTML = html;
  return document.body.querySelector('article.project-card');
};

describe('ProjectCard', () => {
  it('renders the wide layout with grouped details and link', async () => {
    const project = createProject('wide', { link: 'https://example.com' });
    const article = await renderProjectCard(project);

    expect(article).not.toBeNull();
    expect(article).toHaveClass('project-card--wide');

    const header = article?.querySelector('header');
    expect(header?.querySelector('h3')?.textContent).toBe(project.title);
    expect(header?.querySelector('p')?.textContent).toBe(project.summary);

    const contentHeadings = Array.from(
      article?.querySelectorAll('.project-card__content h4') ?? [],
    ).map((heading) => heading.textContent);
    expect(contentHeadings).toEqual(['Problem', 'Solution', 'Stack']);

    const footerHeadings = Array.from(
      article?.querySelectorAll('.project-card__footer h4') ?? [],
    ).map((heading) => heading.textContent);
    expect(footerHeadings).toEqual(['Results', 'Technical Challenges']);

    const link = article?.querySelector('.project-card__link');
    expect(link).toHaveAttribute('href', project.link);
  });

  it('renders the standard layout definition list with detail headings', async () => {
    const project = createProject('standard');
    const article = await renderProjectCard(project);

    expect(article).not.toBeNull();
    expect(article).toHaveClass('project-card--standard');

    const terms = Array.from(article?.querySelectorAll('dl dt') ?? []).map(
      (term) => term.textContent,
    );
    expect(terms).toEqual(['Problem', 'Solution']);

    const detailHeadings = Array.from(
      article?.querySelectorAll('.project-card__meta h4') ?? [],
    ).map((heading) => heading.textContent);
    expect(detailHeadings).toEqual([
      'Stack',
      'Results',
      'Technical Challenges',
    ]);
  });

  it('renders the tall layout with separate narrative and detail sections', async () => {
    const project = createProject('tall');
    const article = await renderProjectCard(project);

    expect(article).not.toBeNull();
    expect(article).toHaveClass('project-card--tall');

    const metaSections = article?.querySelectorAll('.project-card__meta');
    expect(metaSections?.length).toBe(2);

    const narrativeHeadings = Array.from(
      metaSections?.[0]?.querySelectorAll('h4') ?? [],
    ).map((heading) => heading.textContent);
    expect(narrativeHeadings).toEqual(['Problem', 'Solution']);

    const detailHeadings = Array.from(
      metaSections?.[1]?.querySelectorAll('h4') ?? [],
    ).map((heading) => heading.textContent);
    expect(detailHeadings).toEqual([
      'Stack',
      'Results',
      'Technical Challenges',
    ]);
  });
});
