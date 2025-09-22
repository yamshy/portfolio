import { describe, expect, it } from 'vitest';

import {
  calculateGcContent,
  cleanSequence,
  getReverseComplement,
  translateFrames,
} from '../../../src/lib/sequenceUtils';

describe('sequenceUtils', () => {
  it('cleans sequences by removing invalid characters and uppercasing', () => {
    expect(cleanSequence('atg-xxgct\ntaa??')).toBe('ATGGCTTAA');
    expect(cleanSequence('123abc')).toBe('AC');
  });

  it('calculates GC content percentages consistently', () => {
    expect(calculateGcContent('')).toBe(0);
    expect(calculateGcContent('ATGC')).toBe(50);
    expect(calculateGcContent('GGGCCC')).toBe(100);

    const sequence = 'ATGGCTTAA';
    const gcBases = (sequence.match(/[GC]/g)?.length ?? 0) / sequence.length;
    const expected = Number((gcBases * 100).toFixed(2));
    expect(calculateGcContent(sequence)).toBe(expected);
  });

  it('computes reverse complements', () => {
    expect(getReverseComplement('ATGC')).toBe('GCAT');
    expect(getReverseComplement('')).toBe('');
  });

  it('translates sequences into three reading frames', () => {
    expect(translateFrames('')).toEqual(['', '', '']);

    const frames = translateFrames('ATGGCTTAA');
    expect(frames).toEqual(['MA*', 'WL', 'GL']);
  });
});
