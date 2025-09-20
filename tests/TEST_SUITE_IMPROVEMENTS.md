# Test Suite Improvement Plan

## 1. Current Pain Points

- **Unit tests duplicate production markup instead of exercising components.** Files such as `tests/unit/components/content/ContactForm.test.ts`, `tests/unit/components/content/ProjectCard.test.ts`, and `tests/unit/components/navigation/SidebarNav.test.ts` manually recreate HTML strings and then assert against them.【F:tests/unit/components/content/ContactForm.test.ts†L1-L160】【F:tests/unit/components/content/ProjectCard.test.ts†L1-L200】【F:tests/unit/components/navigation/SidebarNav.test.ts†L1-L160】 These tests never import the Astro components they target, so they will keep passing even if the real component markup, props, or interactions regress.
- **`OrganicShapes` coverage mirrors implementation details instead of verifying runtime behaviour.** The current unit test reimplements configuration objects and helper logic rather than exercising the code in `src/utils/organic`.【F:tests/unit/components/effects/OrganicShapes.test.ts†L1-L200】 As a result, it cannot catch regressions in the actual helpers that drive the animation layer (for example `generateAnimationTiming`, `TimerManager`, or the SVG path builders).【F:src/utils/organic/animation-helpers.ts†L1-L60】【F:src/utils/organic/connection-algorithms.ts†L1-L60】
- **`updateProgress` only has a single happy-path assertion.** The test suite does not verify multiple scroll positions, cache invalidation, or failure cases beyond “does not throw,” leaving logic in `src/utils/updateProgress.ts` largely untested (for example the fallback to progress percentage when the nav wrapper is missing).【F:tests/unit/updateProgress.test.ts†L1-L60】【F:src/utils/updateProgress.ts†L1-L160】
- **Playwright specs rely on defensive `if` guards that hide regressions.** Many assertions in `tests/e2e/*.spec.ts` are wrapped in visibility checks, so elements that disappear make the test silently pass instead of fail.【F:tests/e2e/components.spec.ts†L29-L83】【F:tests/e2e/navigation.spec.ts†L33-L70】 None of the flows validate real outcomes such as progress-bar updates after scrolling or form submission behaviour.

## 2. High-Impact Improvements

### 2.1 Exercise Astro/Svelte components directly

- Add `@astrojs/test` (or `@testing-library/astro` once it lands for Astro 5) plus `@testing-library/svelte` for `.svelte` components. Update `vitest.config.ts` to register the Astro test plugin and use `tests/setup.ts` to expose `@testing-library/jest-dom` matchers.
- Rewrite component specs to render the real component:
  - Example for `ProjectCard`:

    ```ts
    import { render, screen } from '@astrojs/test/client';
    import ProjectCard from '@/components/content/grids/ProjectCard.astro';

    it('renders image alt text when provided', async () => {
      const { cleanup } = await render(ProjectCard, {
        props: {
          title: 'Observability Dashboard',
          description: 'Surface error budgets in real time',
          href: 'https://example.com',
          tags: ['Astro', 'TypeScript'],
          image: '/demo.png',
        },
      });
      expect(
        screen.getByRole('img', { name: /observability dashboard/i }),
      ).toBeVisible();
      cleanup();
    });
    ```

  - Follow the same approach for `ContactForm` (submit events, required validation), `SidebarNav` (active-state toggling via `updateProgress`), and `MobileNav`.

- Benefits: the tests will fail when component props change, markup diverges, or accessibility regressions slip in.

### 2.2 Cover organic animation utilities with focused unit tests

- Create new specs under `tests/unit/utils/organic/` to exercise `generateAnimationTiming`, `debounce`, `TimerManager`, `buildConnectionPairs`, `computeControlPoint`, and `createPathData` using deterministic mocks for `Math.random` and DOM rectangles.【F:src/utils/organic/animation-helpers.ts†L1-L60】【F:src/utils/organic/connection-algorithms.ts†L1-L60】【F:src/utils/organic/blob-config.ts†L1-L60】
- Assert observable behaviour: timers are cleared, reduced-motion guard skips hot segments, mobile vs. desktop connection pairs differ, control-point calculations avoid the hero rectangle.
- Once these helpers are covered, shrink `OrganicShapes.test.ts` to a thin integration test that mounts `OrganicShapes.astro` and confirms the helper outputs are consumed correctly instead of duplicating constants.

### 2.3 Expand `updateProgress` scenarios

- Add table-driven tests that simulate scroll positions at the start, middle, and end of the document to assert the progress bar height and active button state, including cases where `window.scrollY` is updated, the nav wrapper is missing, or a section is removed mid-scroll.【F:src/utils/updateProgress.ts†L61-L160】
- Verify cache invalidation by removing and re-adding nav buttons between calls (ensuring `cachedNavSections` repopulates).
- Mock `getBoundingClientRect` to assert the fallback path when relative positions cannot be read.

### 2.4 Make Playwright scenarios deterministic and outcome-focused

- Replace `if` checks with explicit expectations backed by helper utilities that wait for required elements. For example, assert that clicking “Projects” scrolls `#work` into view by monitoring `page.evaluate(() => location.hash)` or measuring `element.boundingBox()` before and after the click.【F:tests/e2e/navigation.spec.ts†L33-L70】
- Add accessibility regression coverage with `@axe-core/playwright` to surface WCAG issues automatically (axe is already installed in `devDependencies`).
- Add flows for:
  - Contact form submission: fill inputs, intercept the POST request (or use `page.waitForEvent('request')`) and assert payload contents.
  - Progress indicator: scroll using `page.mouse.wheel` and assert the inline `height` style updates beyond its initial value.【F:src/utils/updateProgress.ts†L93-L160】
  - Mobile navigation: set a narrow viewport and assert that the hamburger menu opens/closes correctly.

### 2.5 Reduce duplication with shared fixtures

- Move reusable DOM builders (e.g., nav markup used in multiple tests) into helpers under `tests/fixtures/`. Use TypeScript factories so unit tests can customise props without copy/pasting large template literals.
- Populate realistic mock data by importing the real `mainNavItems`/`externalLinks` arrays from `src/components/navigation/navLinks.ts`, ensuring unit tests stay aligned with production data.【F:src/components/navigation/navLinks.ts†L1-L56】

## 3. Suggested Roadmap

1. **Quick wins (1–2 days):**
   - Add organic utility specs and refactor `OrganicShapes` tests to rely on them.
   - Expand `updateProgress` tests with additional scroll scenarios.
2. **Component fidelity upgrade (2–3 days):**
   - Integrate `@astrojs/test` & testing-library tooling.
   - Port `ProjectCard`, `ContactForm`, and `SidebarNav` specs to render real components.
3. **End-to-end hardening (2–3 days):**
   - Refactor Playwright tests to remove guard clauses, add axe scans, and cover progress bar & form flows.
   - Introduce mobile-navigation and reduced-motion assertions.
4. **Continuous improvement:**
   - Configure CI to collect Playwright traces on failure and publish Vitest coverage reports.
   - Consider adding visual regression snapshots (e.g., Playwright `toHaveScreenshot`) once deterministic rendering is stabilised.

Implementing the steps above will align the test suite with the actual Astro application, expose regressions earlier, and make the checks more trustworthy for future refactors.
