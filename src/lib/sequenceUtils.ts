export const COMPLEMENT_MAP = {
  A: 'T',
  T: 'A',
  G: 'C',
  C: 'G',
} as const;

export const CODON_MAP = {
  TTT: 'F',
  TTC: 'F',
  TTA: 'L',
  TTG: 'L',
  CTT: 'L',
  CTC: 'L',
  CTA: 'L',
  CTG: 'L',
  ATT: 'I',
  ATC: 'I',
  ATA: 'I',
  ATG: 'M',
  GTT: 'V',
  GTC: 'V',
  GTA: 'V',
  GTG: 'V',
  TCT: 'S',
  TCC: 'S',
  TCA: 'S',
  TCG: 'S',
  CCT: 'P',
  CCC: 'P',
  CCA: 'P',
  CCG: 'P',
  ACT: 'T',
  ACC: 'T',
  ACA: 'T',
  ACG: 'T',
  GCT: 'A',
  GCC: 'A',
  GCA: 'A',
  GCG: 'A',
  TAT: 'Y',
  TAC: 'Y',
  TAA: '*',
  TAG: '*',
  CAT: 'H',
  CAC: 'H',
  CAA: 'Q',
  CAG: 'Q',
  AAT: 'N',
  AAC: 'N',
  AAA: 'K',
  AAG: 'K',
  GAT: 'D',
  GAC: 'D',
  GAA: 'E',
  GAG: 'E',
  TGT: 'C',
  TGC: 'C',
  TGA: '*',
  TGG: 'W',
  CGT: 'R',
  CGC: 'R',
  CGA: 'R',
  CGG: 'R',
  AGT: 'S',
  AGC: 'S',
  AGA: 'R',
  AGG: 'R',
  GGT: 'G',
  GGC: 'G',
  GGA: 'G',
  GGG: 'G',
} as const;

export type ComplementBase = keyof typeof COMPLEMENT_MAP;
export type Codon = keyof typeof CODON_MAP;

export const cleanSequence = (sequence: string): string =>
  sequence.replace(/[^acgtACGT]/g, '').toUpperCase();

export const calculateGcContent = (sequence: string): number => {
  const normalizedSequence = cleanSequence(sequence);
  if (!normalizedSequence.length) return 0;
  const gcBases = (normalizedSequence.match(/[GC]/g) ?? []).length;
  return Number(((gcBases / normalizedSequence.length) * 100).toFixed(2));
};

export const getReverseComplement = (sequence: string): string =>
  cleanSequence(sequence)
    .split('')
    .reverse()
    .map((base) => COMPLEMENT_MAP[base as ComplementBase] ?? '')
    .join('');

export const translateFrames = (sequence: string): string[] => {
  const normalizedSequence = cleanSequence(sequence);
  const peptides: string[] = [];

  for (let frame = 0; frame < 3; frame += 1) {
    let peptide = '';

    for (let i = frame; i < normalizedSequence.length; i += 3) {
      const codon = normalizedSequence.slice(i, i + 3);
      if (codon.length < 3) break;
      peptide += CODON_MAP[codon as Codon] ?? '?';
    }

    peptides.push(peptide);
  }

  return peptides;
};
