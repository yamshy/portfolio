<script lang="ts">
  import { derived, writable } from 'svelte/store';

  const COMPLEMENT_MAP = {
    A: 'T',
    T: 'A',
    G: 'C',
    C: 'G',
  } as const;

  const CODON_MAP = {
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

  const defaultSequence =
    'ATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAGCTAGGACTAGCTAGGTCAGTCTGAGTGA';

  const sequence = writable(defaultSequence);

  const cleanSequence = derived(sequence, ($sequence) =>
    $sequence.replace(/[^acgtACGT]/g, '').toUpperCase()
  );

  const gcContent = derived(cleanSequence, ($sequence) => {
    if ($sequence.length === 0) return 0;
    const gc = ($sequence.match(/[GC]/g) ?? []).length;
    return Number(((gc / $sequence.length) * 100).toFixed(2));
  });

  const reverseComplement = derived(cleanSequence, ($sequence) =>
    $sequence
      .split('')
      .reverse()
      .map((base) => COMPLEMENT_MAP[base as keyof typeof COMPLEMENT_MAP])
      .join('')
  );

  const translate = (seq: string) => {
    const peptides: string[] = [];
    for (let frame = 0; frame < 3; frame += 1) {
      let peptide = '';
      for (let i = frame; i < seq.length; i += 3) {
        const codon = seq.slice(i, i + 3);
        if (codon.length < 3) break;
        peptide += CODON_MAP[codon as keyof typeof CODON_MAP] ?? '?';
      }
      peptides.push(peptide);
    }
    return peptides;
  };

  const peptides = derived(cleanSequence, translate);
</script>

<section class="workbench u-surface-card" aria-label="Sequence analysis tool">
  <header>
    <p class="u-title-overline">Live Demo</p>
    <h3>Sequence Workbench</h3>
    <p>
      Paste any FASTA snippet to inspect GC balance, translation frames, and reverse complements.
      All computation runs client-side for secure hypothesis exploration.
    </p>
  </header>

  <div class="workbench__grid">
    <label>
      <span>DNA Sequence</span>
      <textarea
        bind:value={$sequence}
        spellcheck="false"
        rows="6"
        placeholder="Paste genomic sequence"
      ></textarea>
    </label>

    <div class="workbench__panel u-surface-card">
      <div>
        <h4>GC Content</h4>
        <p><strong>{$gcContent}%</strong> GC across {$cleanSequence.length} bp</p>
        <div class="meter">
          <div class="meter__fill" style={`width: ${Math.min(100, $gcContent)}%`}></div>
        </div>
      </div>
      <div>
        <h4>Reverse Complement</h4>
        <code>{$reverseComplement}</code>
      </div>
    </div>

    <div class="workbench__frames">
      <h4>Translations</h4>
      <div class="frames">
        {#each $peptides as peptide, index}
          <article>
            <h5>Frame {index + 1}</h5>
            <p>{peptide}</p>
          </article>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .workbench {
    --surface-card-background: color-mix(
      in oklab,
      var(--color-surface) 92%,
      transparent 8%
    );
    --surface-card-border-color: color-mix(
      in oklab,
      var(--color-border) 60%,
      transparent 40%
    );
    display: grid;
    gap: var(--space-lg);
  }

  header h3 {
    font-size: var(--heading-md);
  }

  header p {
    max-width: 68ch;
  }

  .workbench__grid {
    display: grid;
    gap: var(--space-lg);
  }

  label {
    display: grid;
    gap: 0.5rem;
    font-size: 0.85rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-subtle);
  }

  textarea {
    border-radius: var(--radius-md);
    border: 1px solid color-mix(in oklab, var(--color-border) 55%, transparent 45%);
    background: color-mix(in oklab, var(--color-surface) 80%, transparent 20%);
    padding: var(--space-sm);
    font-family: "Berkeley Mono", "IBM Plex Mono", "Fira Code", monospace;
    font-size: 0.95rem;
    color: var(--color-text);
    min-height: 180px;
    resize: vertical;
    transition: border-color var(--duration-base) var(--ease-smooth),
      box-shadow var(--duration-base) var(--ease-smooth);
  }

  textarea:focus-visible {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 20%, transparent);
  }

  .workbench__panel {
    --surface-card-padding: var(--space-md);
    --surface-card-radius: var(--radius-md);
    --surface-card-background: color-mix(
      in oklab,
      var(--color-surface-strong) 45%,
      var(--color-surface) 55%
    );
    --surface-card-border-color: color-mix(
      in oklab,
      var(--color-border) 60%,
      transparent 40%
    );
    display: grid;
    gap: var(--space-md);
  }

  .workbench__panel code {
    display: block;
    max-width: 100%;
    word-break: break-all;
    font-size: 0.85rem;
    background: color-mix(in oklab, var(--color-code-bg) 10%, transparent 90%);
    padding: 0.75rem;
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
  }

  .meter {
    position: relative;
    width: 100%;
    height: 14px;
    background: color-mix(in oklab, var(--color-surface-muted) 30%, transparent 70%);
    border-radius: 999px;
    overflow: hidden;
  }

  .meter__fill {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      color-mix(in oklab, var(--color-primary) 70%, transparent) 0%,
      color-mix(in oklab, var(--color-science-green) 60%, transparent) 50%,
      color-mix(in oklab, var(--color-science-purple) 60%, transparent) 100%
    );
    transition: width var(--duration-slow) var(--ease-smooth);
  }

  .workbench__frames {
    background: color-mix(in oklab, var(--color-surface-strong) 35%, var(--color-surface) 65%);
    border-radius: var(--radius-md);
    border: 1px solid color-mix(in oklab, var(--color-border) 55%, transparent 45%);
    padding: var(--space-md);
    display: grid;
    gap: var(--space-md);
  }

  .frames {
    display: grid;
    gap: var(--space-sm);
  }

  article {
    background: color-mix(in oklab, var(--color-surface) 70%, transparent 30%);
    border-radius: var(--radius-sm);
    padding: var(--space-sm);
    border: 1px solid color-mix(in oklab, var(--color-border) 55%, transparent 45%);
  }

  article h5 {
    margin-bottom: 0.25rem;
    font-size: 0.85rem;
    font-family: var(--font-sans);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-subtle);
  }

  article p {
    font-family: "Berkeley Mono", "IBM Plex Mono", "Fira Code", monospace;
    font-size: 0.85rem;
    color: var(--color-text-muted);
    word-break: break-all;
  }

  @media (min-width: 960px) {
    .workbench__grid {
      grid-template-columns: repeat(12, 1fr);
    }

    label {
      grid-column: span 7;
    }

    .workbench__panel {
      grid-column: span 5;
    }

    .workbench__frames {
      grid-column: span 12;
    }
  }

  @media (max-width: 600px) {
    .workbench {
      --surface-card-padding: var(--space-md);
    }
  }
</style>
