import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

vi.mock('../../../src/scripts/setupMobileNav', () => ({
  setupMobileNav: vi.fn(() => vi.fn()),
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

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
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
});
