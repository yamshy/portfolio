import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, it } from 'vitest';

import Ic50Visualizer from '../../../../src/components/visualizations/Ic50Visualizer.svelte';

const expectedStates = [
  {
    name: 'TRP-Kinase Inhibitor',
    buttonLabel: 'TRP-Kinase',
    ic50: '14.2 μM',
    hill: '1.10',
    mechanism: 'Competitive',
    notes:
      'Stabilised formulation deployed to wet-lab automation; 18% faster screening turnaround.',
    markerCx: 169.1373006629834,
    pathPoints: [
      '40,60.68350792823537',
      '130,85.73109500445477',
      '220,203.2639108267279',
    ],
  },
  {
    name: 'KRAS-G12C Covalent',
    buttonLabel: 'KRAS-G12C',
    ic50: '4.8 μM',
    hill: '1.80',
    mechanism: 'Covalent irreversible',
    notes:
      'Requires staged incubation profile orchestrated by Kubernetes cron workflows.',
    markerCx: 140.87447424253523,
    pathPoints: [
      '40,60.150479420753186',
      '130,111.29020617226949',
      '220,219.32621480232825',
    ],
  },
  {
    name: 'Epigenetic Modulator',
    buttonLabel: 'Epigenetic',
    ic50: '38.5 μM',
    hill: '0.90',
    mechanism: 'Allosteric',
    notes: 'High-throughput QC aggregated via Arrow buffers for GPU normalisation.',
    markerCx: 195.12764377051005,
    pathPoints: [
      '40,60.75017795753803',
      '130,75.26379500037308',
      '220,172.39430092840794',
    ],
  },
];

describe('Ic50Visualizer', () => {
  it('renders accessible metadata and the initial curve for the default compound', () => {
    const { container } = render(Ic50Visualizer);
    const initialState = expectedStates[0];

    expect(screen.getByTestId('ic50-visualizer')).toBeInTheDocument();
    expect(screen.getByText('Dose response curve with interactive compound selector.')).toBeInTheDocument();

    const svg = screen.getByRole('img', { name: /Dose response curve/ });
    expect(svg).toHaveAttribute('aria-labelledby', 'ic50-title ic50-desc');
    expect(container.querySelector('#ic50-desc')).toHaveTextContent(
      'Plot shows normalised cell viability across logarithmic dose concentration for the selected compound.',
    );

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(initialState.name);
    expect(screen.getByRole('button', { name: initialState.buttonLabel })).toHaveClass('active');
    expect(screen.getByText(initialState.ic50)).toBeInTheDocument();
    expect(screen.getByText(initialState.hill)).toBeInTheDocument();
    expect(screen.getByText(initialState.mechanism)).toBeInTheDocument();
    expect(screen.getByText(initialState.notes)).toBeInTheDocument();

    const marker = container.querySelector('circle.viz__marker');
    expect(marker).not.toBeNull();
    expect(marker?.getAttribute('cy')).toBe('140');
    expect(Number(marker?.getAttribute('cx'))).toBeCloseTo(initialState.markerCx, 5);

    const path = container.querySelector('path.viz__curve');
    expect(path).not.toBeNull();
    const d = path?.getAttribute('d') ?? '';
    expect(d.startsWith('M ')).toBe(true);
    initialState.pathPoints.forEach((point) => {
      expect(d).toContain(point);
    });
  });

  it('updates the active compound details and curve when selecting pills', async () => {
    const { container } = render(Ic50Visualizer);
    const buttons = screen.getAllByRole('button');
    const getPath = () => container.querySelector('path.viz__curve');
    const getMarker = () => container.querySelector('circle.viz__marker');

    let previousPath = getPath()?.getAttribute('d') ?? '';

    for (let index = 0; index < expectedStates.length; index += 1) {
      const state = expectedStates[index];
      if (index > 0) {
        await fireEvent.click(buttons[index]);
        await tick();
      }

      buttons.forEach((button, buttonIndex) => {
        if (buttonIndex === index) {
          expect(button).toHaveClass('active');
        } else {
          expect(button).not.toHaveClass('active');
        }
      });

      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(state.name);
      expect(screen.getByText(state.ic50)).toBeInTheDocument();
      expect(screen.getByText(state.hill)).toBeInTheDocument();
      expect(screen.getByText(state.mechanism)).toBeInTheDocument();
      expect(screen.getByText(state.notes)).toBeInTheDocument();

      const marker = getMarker();
      expect(marker).not.toBeNull();
      expect(Number(marker?.getAttribute('cx'))).toBeCloseTo(state.markerCx, 5);

      const path = getPath();
      expect(path).not.toBeNull();
      const d = path?.getAttribute('d') ?? '';
      expect(d).not.toHaveLength(0);
      state.pathPoints.forEach((point) => {
        expect(d).toContain(point);
      });

      if (index > 0) {
        expect(d).not.toBe(previousPath);
      }
      previousPath = d;
    }
  });
});
