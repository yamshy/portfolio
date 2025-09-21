import { render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, it, vi } from 'vitest';

import PipelineOpsDashboard from '../../../../src/components/infrastructure/PipelineOpsDashboard.svelte';

const METRICS_CONFIG = [
  { label: 'Reads/hour', unit: 'M', baseline: 312, variance: 24 },
  { label: 'Latency', unit: 'min', baseline: 18, variance: 6 },
  { label: 'Cost / 10k samples', unit: '$', baseline: 42, variance: 3 },
];

const NODE_TARGETS = [
  { id: 'ingest', target: 96 },
  { id: 'qc', target: 92 },
  { id: 'align', target: 80 },
  { id: 'variant', target: 74 },
];

const INTERVAL_MS = 3200;
const NODE_VARIANCE = 6;

describe('PipelineOpsDashboard', () => {
  it('applies deterministic jitter updates and clears intervals on unmount', async () => {
    vi.useFakeTimers();

    const randomSequence = [
      0.6, 0.3, 0.8, 0.1, 0.7, 0.4, 0.9, 0.2, 0.55, 0.45, 0.65, 0.35, 0.75,
      0.25, 0.85, 0.15,
    ];
    let callIndex = 0;

    const randomMock = vi.spyOn(Math, 'random').mockImplementation(() => {
      const value = randomSequence[callIndex] ?? 0.5;
      callIndex += 1;
      return value;
    });

    try {
      const { unmount } = render(PipelineOpsDashboard);

      const metricsCard = screen.getByRole('heading', {
        level: 4,
        name: 'Throughput Envelope',
      }).parentElement as HTMLElement;
      const nodesCard = screen.getByRole('heading', {
        level: 4,
        name: 'Workflow reliability',
      }).parentElement as HTMLElement;

      const readMetricValues = () =>
        Array.from(metricsCard.querySelectorAll('strong')).map((element) =>
          Number(element.childNodes[0]?.textContent?.trim()),
        );

      const readNodeValues = () =>
        Array.from(nodesCard.querySelectorAll('.node__meter span')).map(
          (element) => Number.parseInt(element.textContent ?? '', 10),
        );

      const metricsBefore = readMetricValues();
      const nodesBefore = readNodeValues();

      expect(metricsBefore).toEqual(
        METRICS_CONFIG.map((metric) => metric.baseline),
      );
      expect(nodesBefore).toEqual([92, 84, 71, 67]);

      await vi.advanceTimersByTimeAsync(INTERVAL_MS);
      await tick();

      const metricsAfter = readMetricValues();
      const nodesAfter = readNodeValues();

      expect(metricsAfter).toEqual([316.8, 15.6, 43.8]);
      expect(nodesAfter).toEqual([91, 94, 79, 79]);

      metricsAfter.forEach((value, index) => {
        const { baseline, variance } = METRICS_CONFIG[index];
        expect(value).not.toBe(metricsBefore[index]);
        expect(value).toBeGreaterThanOrEqual(baseline - variance);
        expect(value).toBeLessThanOrEqual(baseline + variance);
      });

      nodesAfter.forEach((value, index) => {
        const { target } = NODE_TARGETS[index];
        expect(value).not.toBe(nodesBefore[index]);
        expect(value).toBeGreaterThanOrEqual(target - NODE_VARIANCE);
        expect(value).toBeLessThanOrEqual(target + NODE_VARIANCE);
      });

      expect(randomMock).toHaveBeenCalledTimes(8);

      unmount();

      await vi.advanceTimersByTimeAsync(INTERVAL_MS);

      expect(randomMock).toHaveBeenCalledTimes(8);
    } finally {
      randomMock.mockRestore();
      vi.useRealTimers();
    }
  });
});
