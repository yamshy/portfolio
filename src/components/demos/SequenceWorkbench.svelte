<script lang="ts">
  import { derived, writable } from 'svelte/store';

  import {
    calculateGcContent,
    cleanSequence,
    getReverseComplement,
    translateFrames,
  } from '../../lib/sequenceUtils';

  const defaultSequence =
    'ATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAGCTAGGACTAGCTAGGTCAGTCTGAGTGA';

  const sequence = writable(defaultSequence);

  const baseKeyPattern = /^[GCAT]$/i;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented) return;

    const { altKey, ctrlKey, metaKey, key } = event;

    if (altKey || ctrlKey || metaKey) return;

    if (key.length === 1 && !baseKeyPattern.test(key)) {
      event.preventDefault();
    }
  };

  const sanitizeSequenceWithSelection = (
    value: string,
    selectionStart: number,
    selectionEnd: number,
  ) => {
    let sanitizedValue = '';
    let sanitizedStart = 0;
    let sanitizedEnd = 0;

    const clampedStart = Math.max(0, Math.min(selectionStart, value.length));
    const clampedEnd = Math.max(0, Math.min(selectionEnd, value.length));

    for (let index = 0; index < value.length; index += 1) {
      const character = value[index];

      if (!baseKeyPattern.test(character)) continue;

      sanitizedValue += character.toUpperCase();

      if (index < clampedStart) sanitizedStart += 1;
      if (index < clampedEnd) sanitizedEnd += 1;
    }

    const sanitizedLength = sanitizedValue.length;

    return {
      value: sanitizedValue,
      selectionStart: Math.min(sanitizedStart, sanitizedLength),
      selectionEnd: Math.min(sanitizedEnd, sanitizedLength),
    };
  };

  const handleSequenceInput = (event: Event) => {
    const target = event.currentTarget as HTMLTextAreaElement | null;
    if (!target) return;

    const rawValue = target.value;
    const selectionStart = target.selectionStart ?? rawValue.length;
    const selectionEnd = target.selectionEnd ?? rawValue.length;

    const {
      value: sanitizedValue,
      selectionStart: sanitizedStart,
      selectionEnd: sanitizedEnd,
    } = sanitizeSequenceWithSelection(rawValue, selectionStart, selectionEnd);

    if (rawValue !== sanitizedValue) {
      target.value = sanitizedValue;

      const applySelection = () => target.setSelectionRange(sanitizedStart, sanitizedEnd);

      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(applySelection);
      } else {
        setTimeout(applySelection, 0);
      }
    }

    sequence.set(sanitizedValue);
  };

  const cleanedSequence = derived(sequence, ($sequence) => cleanSequence($sequence));

  const gcContent = derived(cleanedSequence, ($sequence) =>
    calculateGcContent($sequence)
  );

  const reverseComplement = derived(cleanedSequence, ($sequence) =>
    getReverseComplement($sequence)
  );

  const peptides = derived(cleanedSequence, ($sequence) => translateFrames($sequence));
</script>

<section class="workbench" aria-label="Sequence analysis tool">
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
        value={$sequence}
        on:keydown={handleKeyDown}
        on:input={handleSequenceInput}
        spellcheck="false"
        rows="6"
        placeholder="Paste genomic sequence"
      ></textarea>
    </label>

    <div class="workbench__panel">
      <div>
        <h4>GC Content</h4>
        <p><strong>{$gcContent}%</strong> GC across {$cleanedSequence.length} bp</p>
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
    display: grid;
    gap: clamp(var(--space-md), 3vw, var(--space-lg));
    padding: clamp(var(--space-md), 4vw, var(--space-lg));
    max-width: min(60rem, 100%);
    margin-inline: auto;
    background: color-mix(in oklab, var(--color-surface) 92%, transparent 8%);
    border-radius: var(--radius-lg);
    border: 1px solid color-mix(in oklab, var(--color-border) 60%, transparent 40%);
    box-shadow: var(--shadow-sm);
  }

  header h3 {
    font-size: var(--heading-md);
  }

  header p {
    max-width: 68ch;
  }

  .workbench__grid {
    display: grid;
    gap: clamp(var(--space-md), 3vw, var(--space-lg));
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
    min-height: 160px;
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
    display: grid;
    gap: var(--space-md);
    padding: var(--space-md);
    background: color-mix(in oklab, var(--color-surface-strong) 45%, var(--color-surface) 55%);
    border-radius: var(--radius-md);
    border: 1px solid color-mix(in oklab, var(--color-border) 60%, transparent 40%);
    box-shadow: var(--shadow-sm);
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
      padding: var(--space-md);
    }
  }
</style>
