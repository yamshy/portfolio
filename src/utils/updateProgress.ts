const SECTION_IDS = ['about', 'work', 'evolution', 'contact'] as const;

type SectionId = (typeof SECTION_IDS)[number];

type NavSection = {
  element: HTMLElement;
  target: HTMLElement;
};

let cachedNavSections: NavSection[] | null = null;
let cachedNavWrapper: HTMLElement | null = null;
let cachedProgressBar: HTMLElement | null = null;

const isInDocument = <T extends Element>(
  element: T | null | undefined,
): element is T => !!element && document.contains(element);

const isSectionId = (value: string | undefined): value is SectionId =>
  typeof value === 'string' &&
  (SECTION_IDS as readonly string[]).includes(value);

const resolveProgressBar = (): HTMLElement | null => {
  if (isInDocument(cachedProgressBar)) {
    return cachedProgressBar;
  }

  cachedProgressBar = document.getElementById('progress-bar');
  return cachedProgressBar;
};

const resolveNavWrapper = (): HTMLElement | null => {
  if (isInDocument(cachedNavWrapper)) {
    return cachedNavWrapper;
  }

  cachedNavWrapper = document.querySelector<HTMLElement>('.nav-wrapper');
  return cachedNavWrapper;
};

const resolveNavSections = (): NavSection[] => {
  if (
    cachedNavSections &&
    cachedNavSections.every(
      ({ element, target }) => isInDocument(element) && isInDocument(target),
    )
  ) {
    return cachedNavSections;
  }

  const navElements = Array.from(
    document.querySelectorAll<HTMLElement>('.nav-organic-button[data-section]'),
  );

  cachedNavSections = navElements
    .map((element) => {
      const sectionId = element.dataset.section;
      if (!isSectionId(sectionId)) {
        return null;
      }

      const target = document.getElementById(sectionId);
      if (!isInDocument(target)) {
        return null;
      }

      return { element, target } satisfies NavSection;
    })
    .filter(Boolean) as NavSection[];

  return cachedNavSections;
};

export function updateProgress() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const progressBar = resolveProgressBar();
  const navSections = resolveNavSections();
  const allNavElements = Array.from(
    document.querySelectorAll<HTMLElement>('.nav-organic-button'),
  );

  if (!progressBar || navSections.length === 0 || allNavElements.length === 0) {
    return;
  }

  const scrollTop = window.scrollY;
  const viewportOffset = window.innerHeight * 0.3;
  const documentHeight = document.documentElement.scrollHeight;

  let progressPercentage = 0;
  let activeElement: HTMLElement | null = null;

  for (let index = 0; index < navSections.length; index += 1) {
    const { element, target } = navSections[index];
    const targetPosition = target.offsetTop;
    const nextTargetPosition =
      navSections[index + 1]?.target.offsetTop ?? documentHeight;

    if (scrollTop >= nextTargetPosition - viewportOffset) {
      progressPercentage = ((index + 1) / navSections.length) * 100;
      continue;
    }

    if (scrollTop >= targetPosition - viewportOffset) {
      const sectionProgress = Math.min(
        (scrollTop - (targetPosition - viewportOffset)) /
          Math.max(nextTargetPosition - targetPosition, 1),
        1,
      );

      progressPercentage =
        ((index + sectionProgress) / navSections.length) * 100;
      activeElement = element;
      break;
    }
  }

  const navWrapper = resolveNavWrapper();
  const activeButton =
    activeElement?.querySelector<HTMLElement>('.cell-nav-shape');

  const progressHeight = (() => {
    if (isInDocument(activeButton) && isInDocument(navWrapper)) {
      const buttonRect = activeButton.getBoundingClientRect();
      const containerRect = navWrapper.getBoundingClientRect();
      const relativeTop = buttonRect.top - containerRect.top;
      const buttonCenter = relativeTop + buttonRect.height / 2;
      const containerHeight = containerRect.height || 1;

      return Math.min((buttonCenter / containerHeight) * 100, 100);
    }

    return Math.min(progressPercentage, 100);
  })();

  progressBar.style.height = `${progressHeight}%`;

  allNavElements.forEach((element) => {
    element.classList.toggle('active', element === activeElement);
  });
}
