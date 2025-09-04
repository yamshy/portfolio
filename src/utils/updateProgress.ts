export function updateProgress() {
  const progressBar = document.getElementById('progress-bar');
  const allNavElements = document.querySelectorAll('.nav-organic-button');

  if (!progressBar || allNavElements.length === 0) return;

  const scrollTop = window.pageYOffset;

  const navOrder = [
    {
      selector: '.nav-organic-button[data-section="about"]',
      target: '#about',
    },
    {
      selector: '.nav-organic-button[data-section="work"]',
      target: '#work',
    },
    {
      selector: '.nav-organic-button[data-section="evolution"]',
      target: '#evolution',
    },
    {
      selector: '.nav-organic-button[data-section="contact"]',
      target: '#contact',
    },
  ];

  let progressPercentage = 0;
  let activeElement: HTMLElement | null = null;

  navOrder.forEach((navItem, index) => {
    const element = document.querySelector(navItem.selector);
    if (!element) return;

    const targetElement = document.querySelector(navItem.target);
    if (!targetElement) return;

    const targetPosition = (targetElement as HTMLElement).offsetTop;
    const nextTargetElement = navOrder[index + 1]
      ? document.querySelector(navOrder[index + 1].target)
      : null;
    const nextTargetPosition = nextTargetElement
      ? (nextTargetElement as HTMLElement).offsetTop
      : document.documentElement.scrollHeight;

    const viewportOffset = window.innerHeight * 0.3;

    if (
      scrollTop >= targetPosition - viewportOffset &&
      scrollTop < nextTargetPosition - viewportOffset
    ) {
      const sectionProgress = Math.min(
        (scrollTop - (targetPosition - viewportOffset)) /
          (nextTargetPosition - targetPosition || 1),
        1,
      );
      progressPercentage = ((index + sectionProgress) / navOrder.length) * 100;
      activeElement = element as HTMLElement;
    }
  });

  if (activeElement) {
    const activeButton = (activeElement as HTMLElement).querySelector(
      '.cell-nav-shape',
    );
    if (activeButton) {
      const buttonRect = activeButton.getBoundingClientRect();
      const navContainer = document.querySelector('.nav-wrapper');
      if (navContainer) {
        const containerRect = navContainer.getBoundingClientRect();
        const relativeTop = buttonRect.top - containerRect.top;
        const buttonCenter = relativeTop + buttonRect.height / 2;
        const containerHeight = containerRect.height;
        const centerPercentage = (buttonCenter / containerHeight) * 100;

        progressBar.style.height = `${Math.min(centerPercentage, 100)}%`;
      }
    }
  } else {
    progressBar.style.height = `${Math.min(progressPercentage, 100)}%`;
  }

  allNavElements.forEach((element) => {
    (element as HTMLElement).classList.remove('active');
  });

  if (activeElement) {
    (activeElement as HTMLElement).classList.add('active');
  }
}
