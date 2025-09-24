import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

const setupMobileNavMock = vi.fn<() => (() => void) | undefined>();

vi.mock('../../../src/scripts/setupMobileNav', () => ({
  setupMobileNav: setupMobileNavMock,
}));

type InitMobileNav =
  (typeof import('../../../src/scripts/initMobileNav'))['default'];

let initMobileNav: InitMobileNav;

beforeAll(async () => {
  ({ default: initMobileNav } = await import(
    '../../../src/scripts/initMobileNav'
  ));
});

describe('initMobileNav', () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let setupCleanup: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    setupCleanup = vi.fn();
    setupMobileNavMock.mockReturnValue(setupCleanup);
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
    setupMobileNavMock.mockReset();
    vi.clearAllMocks();
  });

  it('removes the astro:page-load listener when cleaned up', () => {
    const cleanup = initMobileNav();

    expect(cleanup).toBeTypeOf('function');

    const pageLoadListener = addEventListenerSpy.mock.calls.find(
      ([eventName]) => eventName === 'astro:page-load',
    )?.[1] as EventListener | undefined;

    expect(pageLoadListener).toBeTypeOf('function');

    cleanup();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'astro:page-load',
      pageLoadListener,
    );
  });

  it('invokes the setup cleanup and removes the astro:before-swap listener when cleaned up', () => {
    const cleanup = initMobileNav();

    expect(cleanup).toBeTypeOf('function');

    const beforeSwapListener = addEventListenerSpy.mock.calls.find(
      ([eventName]) => eventName === 'astro:before-swap',
    )?.[1] as EventListener | undefined;

    expect(beforeSwapListener).toBeTypeOf('function');

    cleanup();

    expect(setupCleanup).toHaveBeenCalledTimes(1);
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'astro:before-swap',
      beforeSwapListener,
    );
  });
});
