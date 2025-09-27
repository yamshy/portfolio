<script lang="ts">
  import { onDestroy, tick } from 'svelte';

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
        'High-performance compute pipelines translating raw sequencer output into audit-ready biology. Automations keep terabyte-scale studies reproducible while matching the tempo of translational teams.',
      highlights: [
        'Orchestrated RNA/DNA-seq and variant calling through Nextflow Tower on AWS Batch from Illumina ingest to biological readouts',
        'Automated IC50, dose-response, and kinase inhibition analyses with Python/R pipelines enforcing statistical validation gates',
        'Trained scikit-learn models across experimental datasets to classify responder phenotypes and predict compound efficacy',
      ],
      stack: [
        { label: 'Core', detail: 'Python, R, SQL, Nextflow, Bash, statistical modeling' },
        {
          label: 'HPC & Pipelines',
          detail: 'AWS Batch, Nextflow Tower, nf-core, Galaxy, Conda environments, Docker',
        },
        {
          label: 'Analysis & Viz',
          detail: 'GraphPad Prism, JMP, Plotly, Power BI, automated report generation, fragment analysis',
        },
      ],
    },
    {
      id: 'infrastructure',
      title: 'Infrastructure Engineering',
      narrative:
        'Hybrid infrastructure spanning Azure Container Apps, on-prem Proxmox virtualization, and privately managed Kubernetes automation keeps sequencing pipelines resilient while GitOps automation sustains compliance and slashes manual effort.',
      highlights: [
        'Managed hybrid infrastructure spanning Azure Container Apps and on-premises Proxmox virtualization',
        'Built CI/CD pipelines with GitHub Actions for containerized deployments across dev/staging/prod',
        'Currently running production Kubernetes homelab with Flux GitOps, Infisical secrets, and MetalLB load balancing',
        'Reduced manual operations by 50% through Python automation and systematic workflow optimization',
      ],
      stack: [
        {
          label: 'CLOUD',
          detail: 'Azure Container Apps, AWS Batch (via Nextflow Tower), PostgreSQL databases',
        },
        {
          label: 'ORCHESTRATION',
          detail: 'Docker, GitHub Actions, Python automation, Bash scripting',
        },
        {
          label: 'INFRASTRUCTURE',
          detail: 'Linux administration, Proxmox hypervisor, Omada networking, backup systems',
        },
      ],
    },
    {
      id: 'data-engineering',
      title: 'Data Engineering',
      narrative:
        'Turning laboratory instrumentation output into automated, queryable data pipelines that feed analytical dashboards and decision support tools for research teams.',
      highlights: [
        'Built ETL pipelines integrating SciNote LIMS data with automated processing workflows via REST APIs',
        'Implemented automated data ingestion from Illumina sequencers (iSeq100, NextSeq500) to cloud storage and analysis',
        'Developed Python frameworks processing 384-well plate assays into validated PostgreSQL databases with automated reporting',
      ],
      stack: [
        { label: 'Pipelines', detail: 'Python ETL, Nextflow, REST API integration, automated validation' },
        { label: 'Data Stores', detail: 'PostgreSQL, Azure databases, Excel automation, structured experimental data' },
        { label: 'Analytics', detail: 'Power BI dashboards, Plotly visualizations, automated PDF/Excel reports' },
      ],
    },
    {
      id: 'collaboration',
      title: 'Translational Collaboration',
      narrative:
        'Bridging laboratory scientists and computational teams. Every pipeline, analysis tool, and automated workflow validated with end users to ensure practical adoption and reliable results.',
      highlights: [
        'Led molecular biology technical operations, mentoring 4+ graduate scientists in NGS and laboratory automation',
        'Translated client research requirements into automated analysis pipelines → 50% reduction in turnaround time',
        'Built interactive dashboards and reports that made complex genomic data accessible to non-computational scientists',
      ],
      stack: [
        { label: 'Practices', detail: 'Requirements gathering, user training, technical documentation, cross-functional coordination' },
        { label: 'Quality Standards', detail: 'GLP practices, CLIA/CAP familiarity, validated workflows, reproducible analysis' },
        { label: 'Enablement', detail: 'Technical mentoring, workflow automation, data visualization, client-focused tool development' },
      ],
    },
  ];

  const EXIT_DURATION = 260;

  let activeCategoryId = categories[0].id;
  let displayCategory: SkillCategory = categories[0];
  let exitingCategory: SkillCategory | null = null;
  let isAnimating = false;

  const timeouts = new Set<ReturnType<typeof setTimeout>>();

  const wait = (ms: number) =>
    new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        timeouts.delete(timeout);
        resolve();
      }, ms);

      timeouts.add(timeout);
    });

  onDestroy(() => {
    for (const timeout of timeouts) {
      clearTimeout(timeout);
    }
    timeouts.clear();
  });

  async function selectCategory(category: SkillCategory) {
    if (category.id === activeCategoryId || isAnimating) {
      return;
    }

    activeCategoryId = category.id;
    isAnimating = true;
    exitingCategory = displayCategory;
    await tick();
    await wait(EXIT_DURATION);

    displayCategory = category;
    exitingCategory = null;
    isAnimating = false;
  }
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
              class:selected={category.id === activeCategoryId}
              aria-pressed={category.id === activeCategoryId}
              on:click={() => selectCategory(category)}
            >
              <span>{category.title}</span>
              <span aria-hidden="true">→</span>
            </button>
          </li>
        {/each}
      </ul>
    </nav>

    <div class="skills__panel" aria-live="polite">
      {#if exitingCategory}
        <article class="skills__detail tab-content-exit" aria-hidden="true">
          <h4>{exitingCategory.title}</h4>
          <p>{exitingCategory.narrative}</p>
          <ul class="skills__highlights">
            {#each exitingCategory.highlights as highlight}
              <li>{highlight}</li>
            {/each}
          </ul>
          <dl>
            {#each exitingCategory.stack as item}
              <div>
                <dt>{item.label}</dt>
                <dd>{item.detail}</dd>
              </div>
            {/each}
          </dl>
        </article>
      {/if}

      {#if !exitingCategory}
        <article class="skills__detail">
          <h4>{displayCategory.title}</h4>
          <p class="skills__narrative">{displayCategory.narrative}</p>
          <ul class="skills__highlights">
            {#each displayCategory.highlights as highlight}
              <li>{highlight}</li>
            {/each}
          </ul>
          <dl>
            {#each displayCategory.stack as item}
              <div>
                <dt>{item.label}</dt>
                <dd>{item.detail}</dd>
              </div>
            {/each}
          </dl>
        </article>
      {/if}
    </div>
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
    gap: 0.75rem;
    text-align: left;
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

  nav button span:first-child {
    flex: 1;
  }

  nav button span[aria-hidden='true'] {
    flex-shrink: 0;
    margin-left: auto;
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

  .skills__panel {
    position: relative;
    display: grid;
  }

  .skills__panel > * {
    grid-area: 1 / 1 / -1 / -1;
  }

  .skills__detail {
    padding: var(--space-md);
    background: color-mix(in oklab, var(--color-surface-strong) 50%, var(--color-surface) 50%);
    border-radius: var(--radius-md);
    border: 1px solid color-mix(in oklab, var(--color-border) 60%, transparent 40%);
    display: grid;
    gap: var(--space-md);
  }

  .tab-content-exit {
    animation: slideOutLeft 260ms var(--ease-smooth) forwards;
  }

  @keyframes slideOutLeft {
    to {
      opacity: 0;
      transform: translateX(-20px);
    }
  }

  .skills__detail:not(.tab-content-exit) {
    animation: fadeSlideIn 320ms var(--ease-smooth);
    animation-fill-mode: backwards;
  }

  @keyframes fadeSlideIn {
    from {
      opacity: 0;
      transform: translateX(20px);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }


  .skills__narrative {
    position: relative;
    white-space: pre-wrap;
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

  @media (prefers-reduced-motion: reduce) {
    .tab-content-exit {
      animation: none;
      opacity: 1;
    }

    .skills__detail:not(.tab-content-exit) {
      animation: none;
    }
  }
</style>
