<script lang="ts">
  import { derived, writable } from 'svelte/store';

  type SkillCategory = {
    id: string;
    title: string;
    narrative: string;
    highlights: string[];
    stack: { label: string; detail: string }[];
  };

  const categories: SkillCategory[] = [
    {
      id: 'scientific-computing',
      title: 'Scientific Computing',
      narrative:
        'GPU-accelerated analytics tuned for wet-lab cadence. Built to validate hypotheses on terabyte-scale omics data without blocking discovery timelines.',
      highlights: [
        'Scaled distributed Snakemake → Argo Workflows handling 38k samples/week',
        'Implemented columnar genomics store (Apache Arrow + DuckDB) with 11x faster cohort queries',
        'Automated QC heuristics using probabilistic programming (PyMC) for variant confidence bands',
      ],
      stack: [
        { label: 'Core', detail: 'Python, Rust, CUDA, Nextflow, Snakemake' },
        { label: 'Data', detail: 'Apache Arrow, DuckDB, Parquet, Zarr' },
        { label: 'ML', detail: 'JAX, PyTorch, scVI, Optuna' },
      ],
    },
    {
      id: 'infrastructure',
      title: 'Infrastructure Engineering',
      narrative:
        'Designing resilient, auditable compute fabrics spanning on-prem sequencers and regulated clouds. Reliability work measured in reduced reruns and faster approvals.',
      highlights: [
        'Cut pipeline SLO breaches by 74% through GitOps-driven ArgoCD and policy-as-code',
        'Reduced cluster spend 28% by orchestrating GPU pooling with Karpenter and Spot parity models',
        'Containerised wet-lab analysis stack for FDA submissions with reproducible build provenance',
      ],
      stack: [
        { label: 'Cloud', detail: 'AWS Batch, GKE Autopilot, Nomad' },
        { label: 'Orchestration', detail: 'Kubernetes, ArgoCD, Terraform, Pulumi' },
        { label: 'Observability', detail: 'Grafana, Loki, Tempo, OpenTelemetry' },
      ],
    },
    {
      id: 'data-engineering',
      title: 'Data Engineering',
      narrative:
        'Turning lab instrumentation exhaust into governed, queryable knowledge graphs that feed decision support tools for clinicians and bench scientists alike.',
      highlights: [
        'Unified LIMS, ELN, and sequencing metadata into Delta Lake for FDA-ready traceability',
        'Implemented streaming ingestion from Illumina X instruments with schema evolution under 30s',
        'Materialised FHIR-compatible APIs enabling near real-time cohort stratification dashboards',
      ],
      stack: [
        { label: 'Pipelines', detail: 'dbt, Dagster, Apache Beam' },
        { label: 'Messaging', detail: 'Kafka, Redpanda, EventBridge' },
        { label: 'Governance', detail: 'Great Expectations, data contracts, Evidently AI' },
      ],
    },
    {
      id: 'collaboration',
      title: 'Translational Collaboration',
      narrative:
        'Translating between lab scientists, clinical ops, and platform teams. Every dashboard, pipeline, and interface is validated with downstream decision-makers.',
      highlights: [
        'Led IRB-compliant data rooms for oncology partners with reproducible compute manifests',
        'Ran blameless retros with computational biologists → 32% reduction in escalation time',
        'Co-authored peer-reviewed publications on scalable single-cell RNAseq infrastructure',
      ],
      stack: [
        { label: 'Practices', detail: 'Remote tabletop drills, runbooks, RFC rituals' },
        { label: 'Compliance', detail: '21 CFR Part 11, HIPAA, SOC2' },
        { label: 'Enablement', detail: 'Design research, technical storytelling, facilitation' },
      ],
    },
  ];

  const selected = writable<SkillCategory>(categories[0]);
  const selectedId = derived(selected, ($selected) => $selected.id);
</script>

<section class="skills" aria-label="Skills by application area">
  <header>
    <p class="u-title-overline">Capabilities</p>
    <h3>Application-aligned Expertise</h3>
    <p>
      Each capability bundle maps to a measurable outcome: faster approvals, cheaper pipelines,
      tighter scientific feedback loops. Explore the focus areas driving measurable impact.
    </p>
  </header>

  <div class="skills__layout">
    <nav aria-label="Skill categories">
      <ul>
        {#each categories as category}
          <li>
            <button
              type="button"
              class:selected={category.id === $selectedId}
              on:click={() => selected.set(category)}
            >
              <span>{category.title}</span>
              <span aria-hidden="true">→</span>
            </button>
          </li>
        {/each}
      </ul>
    </nav>

    <article class="skills__detail" aria-live="polite">
      <h4>{$selected.title}</h4>
      <p>{$selected.narrative}</p>
      <ul class="skills__highlights">
        {#each $selected.highlights as highlight}
          <li>{highlight}</li>
        {/each}
      </ul>
      <dl>
        {#each $selected.stack as item}
          <div>
            <dt>{item.label}</dt>
            <dd>{item.detail}</dd>
          </div>
        {/each}
      </dl>
    </article>
  </div>
</section>

<style>
  .skills {
    display: grid;
    gap: var(--space-lg);
    padding: var(--space-lg);
    background: color-mix(in oklab, var(--color-surface) 95%, transparent 5%);
    border-radius: var(--radius-lg);
    border: 1px solid color-mix(in oklab, var(--color-border) 60%, transparent 40%);
    box-shadow: var(--shadow-sm);
  }

  header h3 {
    font-size: var(--heading-md);
  }

  header p {
    max-width: 70ch;
  }

  .skills__layout {
    display: grid;
    gap: var(--space-lg);
  }

  nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.75rem;
  }

  nav button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.9rem 1rem;
    border-radius: var(--radius-md);
    border: 1px solid color-mix(in oklab, var(--color-border) 55%, transparent 45%);
    background: color-mix(in oklab, var(--color-surface-muted) 40%, var(--color-surface) 60%);
    color: var(--color-text-subtle);
    font-size: 0.9rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: transform var(--duration-base) var(--ease-smooth),
      border-color var(--duration-base) var(--ease-smooth);
  }

  nav button:hover,
  nav button:focus-visible {
    transform: translateX(6px);
    border-color: var(--color-primary);
  }

  nav button.selected {
    border-color: var(--color-primary);
    color: var(--color-text);
    background: color-mix(in oklab, var(--color-primary) 20%, var(--color-surface));
  }

  .skills__detail {
    padding: var(--space-md);
    background: color-mix(in oklab, var(--color-surface-strong) 50%, var(--color-surface) 50%);
    border-radius: var(--radius-md);
    border: 1px solid color-mix(in oklab, var(--color-border) 60%, transparent 40%);
    display: grid;
    gap: var(--space-md);
  }

  .skills__detail h4 {
    font-size: var(--heading-md);
  }

  .skills__highlights {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.75rem;
  }

  .skills__highlights li {
    position: relative;
    padding-left: 1.5rem;
    color: var(--color-text);
  }

  .skills__highlights li::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: var(--color-science-purple);
  }

  dl {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    margin: 0;
  }

  dt {
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-subtle);
  }

  dd {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 0.95rem;
  }

  @media (min-width: 960px) {
    .skills__layout {
      grid-template-columns: 280px 1fr;
    }
  }

  @media (max-width: 600px) {
    .skills {
      padding: var(--space-md);
    }
  }
</style>
