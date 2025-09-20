import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, it } from 'vitest';

import Ic50Visualizer from '../../../../src/components/visualizations/Ic50Visualizer.svelte';

type Compound = {
  name: string;
  ic50: number;
  hill: number;
  mechanism: string;
  notes: string;
};

const compounds: Compound[] = [
  {
    name: 'TRP-Kinase Inhibitor',
    ic50: 14.2,
    hill: 1.1,
    mechanism: 'Competitive',
    notes:
      'Stabilised formulation deployed to wet-lab automation; 18% faster screening turnaround.',
  },
  {
    name: 'KRAS-G12C Covalent',
    ic50: 4.8,
    hill: 1.8,
    mechanism: 'Covalent irreversible',
    notes:
      'Requires staged incubation profile orchestrated by Kubernetes cron workflows.',
  },
  {
    name: 'Epigenetic Modulator',
    ic50: 38.5,
    hill: 0.9,
    mechanism: 'Allosteric',
    notes:
      'High-throughput QC aggregated via Arrow buffers for GPU normalisation.',
  },
];

const buildPath = (compound: Compound) => {
  const points: string[] = [];
  for (let i = 0; i <= 100; i += 1) {
    const dose = Math.pow(10, (i / 100) * 3 - 1);
    const response = 100 / (1 + Math.pow(dose / compound.ic50, compound.hill));
    const x = ((Math.log10(dose) + 1) / 4) * 240 + 40;
    const y = 220 - (response / 100) * 160;
    points.push(`${x},${y}`);
  }
  return `M ${points.join(' L ')}`;
};

const markerPosition = (ic50: number) =>
  ((Math.log10(ic50) + 1) / 4) * 240 + 40;

describe('Ic50Visualizer', () => {
  it('builds dose-response paths identically to the component implementation', () => {
    const { container } = render(Ic50Visualizer);
    const path = container.querySelector('path.viz__curve');
    expect(path?.getAttribute('d')).toBe(buildPath(compounds[0]));
  });

  it('moves the dose marker and updates active state when selecting compounds', async () => {
    const { container } = render(Ic50Visualizer);
    const getMarker = () => container.querySelector('circle.viz__marker');
    const getPath = () => container.querySelector('path.viz__curve');
    const buttons = screen.getAllByRole('button');

    expect(buttons[0]).toHaveClass('active');
    expect(parseFloat(getMarker()?.getAttribute('cx') ?? '')).toBeCloseTo(
      markerPosition(compounds[0].ic50),
      5,
    );
    expect(getPath()?.getAttribute('d')).toBe(buildPath(compounds[0]));

    await fireEvent.click(buttons[1]);
    await tick();

    expect(buttons[1]).toHaveClass('active');
    expect(buttons[0]).not.toHaveClass('active');
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      compounds[1].name,
    );
    expect(parseFloat(getMarker()?.getAttribute('cx') ?? '')).toBeCloseTo(
      markerPosition(compounds[1].ic50),
      5,
    );
    expect(getPath()?.getAttribute('d')).toBe(buildPath(compounds[1]));

    await fireEvent.click(buttons[2]);
    await tick();

    expect(buttons[2]).toHaveClass('active');
    expect(buttons[1]).not.toHaveClass('active');
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      compounds[2].name,
    );
    expect(parseFloat(getMarker()?.getAttribute('cx') ?? '')).toBeCloseTo(
      markerPosition(compounds[2].ic50),
      5,
    );
  });
});
