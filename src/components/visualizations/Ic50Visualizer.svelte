<script lang="ts">
  import { derived, writable } from 'svelte/store';

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
      notes: 'Stabilised formulation deployed to wet-lab automation; 18% faster screening turnaround.',
    },
    {
      name: 'KRAS-G12C Covalent',
      ic50: 4.8,
      hill: 1.8,
      mechanism: 'Covalent irreversible',
      notes: 'Requires staged incubation profile orchestrated by Kubernetes cron workflows.',
    },
    {
      name: 'Epigenetic Modulator',
      ic50: 38.5,
      hill: 0.9,
      mechanism: 'Allosteric',
      notes: 'High-throughput QC aggregated via Arrow buffers for GPU normalisation.',
    },
  ];

  const selection = writable(0);

  const active = derived(selection, ($selection) => compounds[$selection]);

  const buildPath = (compound: Compound) => {
    const points: string[] = [];
    for (let i = 0; i <= 100; i += 1) {
      const dose = Math.pow(10, (i / 100) * 3 - 1); // 0.1 to 1000 uM
      const response = 100 / (1 + Math.pow(dose / compound.ic50, compound.hill));
      const x = ((Math.log10(dose) + 1) / 4) * 240 + 40;
      const y = 220 - (response / 100) * 160;
      points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')}`;
  };

  const pathStore = derived(active, ($active) => buildPath($active));
</script>

<div class="viz" data-testid="ic50-visualizer">
  <div class="viz__header">
    <div>
      <p class="u-title-overline">Scientific Data Visualisation</p>
      <h3>{$active.name}</h3>
    </div>
    <div class="viz__pills">
      {#each compounds as compound, index}
        <button
          class:active={index === $selection}
          on:click={() => selection.set(index)}
          type="button"
        >
          {compound.name.split(' ')[0]}
        </button>
      {/each}
    </div>
  </div>

  <figure class="viz__chart">
    <figcaption class="sr-only">Dose response curve with interactive compound selector.</figcaption>
    <svg viewBox="0 0 320 240" role="img" aria-labelledby="ic50-title ic50-desc">
      <title id="ic50-title">Dose response curve</title>
      <desc id="ic50-desc">
        Plot shows normalised cell viability across logarithmic dose concentration for the selected
        compound.
      </desc>
      <defs>
        <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="var(--color-science-green)" />
          <stop offset="80%" stop-color="var(--color-science-purple)" />
        </linearGradient>
      </defs>
      <rect x="40" y="40" width="240" height="160" rx="14" class="viz__grid" />
      <g class="viz__axes">
        <line x1="40" y1="200" x2="280" y2="200" />
        <line x1="40" y1="40" x2="40" y2="200" />
        <text x="280" y="220">[Dose] μM</text>
        <text x="14" y="52" transform="rotate(-90 14 52)">Viability %</text>
      </g>
      <g class="viz__ticks">
        {#each [0.1, 1, 10, 100, 1000] as tick, index}
          <line x1={(index / 4) * 240 + 40} y1="200" x2={(index / 4) * 240 + 40} y2="205" />
          <text x={(index / 4) * 240 + 40} y="218">{tick}</text>
        {/each}
        {#each [0, 25, 50, 75, 100] as tick}
          <line x1="35" y1={200 - (tick / 100) * 160} x2="40" y2={200 - (tick / 100) * 160} />
          <text x="24" y={205 - (tick / 100) * 160}>{tick}</text>
        {/each}
      </g>
      <path d={$pathStore} class="viz__curve line-trace" />
      <circle
        r="6"
        cx={((Math.log10($active.ic50) + 1) / 4) * 240 + 40}
        cy="{220 - 50 * 1.6}"
        class="viz__marker pulse-ring"
      />
    </svg>
  </figure>

  <dl class="viz__meta">
    <div>
      <dt>IC50</dt>
      <dd>{$active.ic50.toFixed(1)} μM</dd>
    </div>
    <div>
      <dt>Hill Slope</dt>
      <dd>{$active.hill.toFixed(2)}</dd>
    </div>
    <div>
      <dt>Mechanism</dt>
      <dd>{$active.mechanism}</dd>
    </div>
    <div class="viz__note">
      <dt>Operational Insight</dt>
      <dd>{$active.notes}</dd>
    </div>
  </dl>
</div>

<style>
  .viz {
    display: grid;
    gap: var(--space-lg);
    padding: var(--space-lg);
    background: color-mix(in oklab, var(--color-surface) 85%, transparent);
    border: 1px solid color-mix(in oklab, var(--color-border) 70%, transparent 30%);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
  }

  .viz__header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
  }

  .viz__header h3 {
    font-size: var(--heading-md);
  }

  .viz__pills {
    display: inline-flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .viz__pills button {
    border: 1px solid color-mix(in oklab, var(--color-border) 50%, transparent 50%);
    border-radius: var(--radius-sm);
    padding: 0.35rem 0.75rem;
    background: color-mix(in oklab, var(--color-surface-muted) 30%, var(--color-surface));
    color: var(--color-text-subtle);
    font-family: var(--font-sans);
    font-size: 0.8rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background var(--duration-base) var(--ease-smooth),
      color var(--duration-base) var(--ease-smooth);
  }

  .viz__pills button.active,
  .viz__pills button:hover,
  .viz__pills button:focus-visible {
    background: color-mix(in oklab, var(--color-primary) 22%, var(--color-surface));
    color: var(--color-text);
  }

  .viz__chart {
    position: relative;
  }

  svg {
    width: 100%;
    height: auto;
  }

  .viz__grid {
    fill: color-mix(in oklab, var(--color-surface-strong) 45%, transparent 55%);
    stroke: color-mix(in oklab, var(--color-border) 70%, transparent 30%);
  }

  .viz__axes line {
    stroke: color-mix(in oklab, var(--color-border) 90%, transparent 10%);
    stroke-width: 1.2;
  }

  .viz__axes text,
  .viz__ticks text {
    font-family: var(--font-sans);
    font-size: 0.7rem;
    fill: color-mix(in oklab, var(--color-text-muted) 90%, transparent 10%);
  }

  .viz__ticks line {
    stroke: color-mix(in oklab, var(--color-border) 70%, transparent 30%);
    stroke-width: 0.75;
  }

  .viz__curve {
    fill: none;
    stroke: url(#curveGradient);
    stroke-width: 3;
    filter: drop-shadow(0 8px 16px rgba(41, 123, 102, 0.25));
  }

  .viz__marker {
    fill: color-mix(in oklab, var(--color-science-purple) 70%, transparent 30%);
    stroke: var(--color-science-purple);
    stroke-width: 2;
  }

  .viz__meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: var(--space-md);
    margin: 0;
  }

  .viz__meta div {
    display: grid;
    gap: 0.25rem;
  }

  dt {
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-text-subtle);
  }

  dd {
    margin: 0;
    color: var(--color-text);
    font-size: var(--text-lg);
    font-family: var(--font-sans);
  }

  .viz__note dd {
    font-size: 0.95rem;
    color: var(--color-text-muted);
  }

  @media (max-width: 600px) {
    .viz {
      padding: var(--space-md);
    }
  }
</style>
