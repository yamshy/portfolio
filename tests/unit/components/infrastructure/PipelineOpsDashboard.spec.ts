import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import PipelineOpsDashboard from '../../../../src/components/infrastructure/PipelineOpsDashboard.svelte';

describe('PipelineOpsDashboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.75);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('updates metrics over time and clears its interval on destroy', async () => {
    const intervalSpy = vi.spyOn(window, 'setInterval');
    const clearSpy = vi.spyOn(window, 'clearInterval');
    const { container } = render(PipelineOpsDashboard);

    expect(intervalSpy).toHaveBeenCalledTimes(1);
    expect(intervalSpy.mock.calls[0][1]).toBe(3200);

    vi.advanceTimersByTime(3200);
    await tick();

    const metricItems = container.querySelectorAll<HTMLLIElement>(
      '.dashboard__card--metrics li',
    );
    expect(metricItems[0].querySelector('strong')?.textContent).toContain(
      '324',
    );
    expect(metricItems[1].querySelector('strong')?.textContent).toContain('21');
    expect(metricItems[2].querySelector('strong')?.textContent).toContain(
      '43.5',
    );

    const nodeValueSpans =
      container.querySelectorAll<HTMLSpanElement>('.node__meter span');
    expect(nodeValueSpans[0].textContent).toContain('99%');
    expect(nodeValueSpans[1].textContent).toContain('95%');

    const intervalId = intervalSpy.mock.results[0]?.value as number;
    cleanup();

    expect(clearSpy).toHaveBeenCalledWith(intervalId);
  });
});
