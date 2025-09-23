import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, it } from 'vitest';

import SequenceWorkbench from '../../../../src/components/demos/SequenceWorkbench.svelte';

describe('SequenceWorkbench', () => {
  it('cleans input sequences and updates derived analyses', async () => {
    const { container } = render(SequenceWorkbench);
    const textarea = screen.getByPlaceholderText(
      'Paste genomic sequence',
    ) as HTMLTextAreaElement;

    const rawInput = 'atg-xxgct\ntaa??';
    await fireEvent.input(textarea, { target: { value: rawInput } });
    await tick();

    const cleanedSequence = 'ATGGCTTAA';
    expect(textarea.value).toBe(cleanedSequence);
    const gcBases =
      (cleanedSequence.match(/[GC]/g)?.length ?? 0) / cleanedSequence.length;
    const expectedGc = Number((gcBases * 100).toFixed(2));

    const gcParagraph = screen.getByText('GC Content').nextElementSibling;
    expect(gcParagraph?.textContent).toBe(
      `${expectedGc}% GC across ${cleanedSequence.length} bp`,
    );

    const reverseComplementHeading = screen.getByText('Reverse Complement');
    expect(reverseComplementHeading.nextElementSibling?.textContent).toBe(
      'TTAAGCCAT',
    );

    const frameHeadings = screen.getAllByRole('heading', { level: 5 });
    const expectedFrames = ['MA*', 'WL', 'GL'];
    expectedFrames.forEach((peptide, index) => {
      expect(frameHeadings[index].nextElementSibling?.textContent).toBe(
        peptide,
      );
    });

    const reverseComplementCode = container.querySelector('code');
    expect(reverseComplementCode?.textContent).toBe('TTAAGCCAT');
  });

  it('handles inputs that strip to an empty sequence gracefully', async () => {
    render(SequenceWorkbench);
    const textarea = screen.getByPlaceholderText(
      'Paste genomic sequence',
    ) as HTMLTextAreaElement;

    await fireEvent.input(textarea, { target: { value: '123456---' } });
    await tick();

    expect(textarea.value).toBe('');
    const gcParagraph = screen.getByText('GC Content').nextElementSibling;
    expect(gcParagraph?.textContent).toBe('0% GC across 0 bp');

    const reverseComplementHeading = screen.getByText('Reverse Complement');
    expect(reverseComplementHeading.nextElementSibling?.textContent).toBe('');

    const frameHeadings = screen.getAllByRole('heading', { level: 5 });
    frameHeadings.forEach((heading) => {
      expect(heading.nextElementSibling?.textContent).toBe('');
    });
  });
});
