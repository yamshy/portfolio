<script lang="ts">
  import { onMount, tick } from 'svelte';

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
        'Hybrid infrastructure spanning Azure Container Apps, on-premises Proxmox virtualization, and Terraform-provisioned cloud resources keeps sequencing pipelines resilient while GitOps automation sustains compliance and eliminates manual toil.',
      highlights: [
        'Provisioned infrastructure as code with Terraform across Azure (Container Apps, databases, networking) and on-premises Proxmox virtualization, maintaining GitOps workflows for reproducible deployments',
        'Built CI/CD pipelines with GitHub Actions for automated testing, containerized builds, and multi-environment deployments across development, staging, and production',
        'Deployed production Kubernetes clusters and Azure Container Apps for scientific workloads, implementing automated scaling, container orchestration, and microservices architecture for genomic analysis pipelines',
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
          detail:
            'Terraform, Kubernetes, Linux administration, Proxmox hypervisor, Azure networking (VNets, NSGs), GitOps workflows, infrastructure as code',
        },
      ],
    },
    {
      id: 'data-engineering',
      title: 'Data Engineering',
      narrative:
        'Transforming raw instrumentation output into production data pipelines that power analytical dashboards and automated decision support for research teams.',
      highlights: [
        'Built ETL pipelines integrating SciNote LIMS data with automated processing workflows via REST APIs, eliminating manual data entry for 100+ weekly experiments',
        'Implemented automated data ingestion from Illumina sequencers (iSeq100, NextSeq500) to Azure cloud storage with real-time processing triggers and quality validation',
        'Developed Python frameworks processing 384-well plate assays into validated PostgreSQL databases with automated reporting, reducing analysis time from hours to minutes',
      ],
      stack: [
        {
          label: 'Pipelines',
          detail: 'Python ETL, Nextflow workflows, REST API integration, automated validation, event-driven processing',
        },
        { label: 'Data Stores', detail: 'PostgreSQL, Azure databases, Excel automation, structured experimental data' },
        { label: 'Analytics', detail: 'Power BI dashboards, Plotly visualizations, automated PDF/Excel reports' },
      ],
    },
    {
      id: 'collaboration',
      title: 'Translational Collaboration',
      narrative:
        'Bridging wet-lab scientists and computational teams. Every pipeline, tool, and workflow co-developed with end users to ensure practical adoption and reliable results.',
      highlights: [
        'Led molecular biology operations and trained 4+ graduate scientists in NGS workflows, laboratory automation, and computational analysis—building cross-functional expertise across the team',
        'Translated scientist research requirements into production analysis pipelines, achieving 50% reduction in turnaround time while maintaining scientific rigor and reproducibility',
        'Built interactive dashboards and automated reports that transformed complex genomic data into actionable insights for non-computational scientists, accelerating research decisions',
      ],
      stack: [
        {
          label: 'Practices',
          detail:
            'Requirements gathering, user training, technical documentation, cross-functional coordination, iterative feedback loops',
        },
        { label: 'Quality Standards', detail: 'GLP practices, CLIA/CAP familiarity, validated workflows, reproducible analysis' },
        { label: 'Enablement', detail: 'Technical mentoring, workflow automation, data visualization, client-focused tool development' },
      ],
    },
  ];

  let activeCategoryId = categories[0].id;
  let displayCategory: SkillCategory = categories[0];
  let detailElement: HTMLElement | null = null;
  let panelHeight: number | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let observedElement: HTMLElement | null = null;

  async function updatePanelHeight() {
    await tick();

    if (detailElement) {
      panelHeight = detailElement.offsetHeight;
    }
  }

  onMount(async () => {
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        if (detailElement) {
          panelHeight = detailElement.offsetHeight;
        }
      });
    }

    await updatePanelHeight();

    if (detailElement && resizeObserver) {
      resizeObserver.observe(detailElement);
      observedElement = detailElement;
    }

    return () => {
      resizeObserver?.disconnect();
    };
  });

  $: if (detailElement && resizeObserver && detailElement !== observedElement) {
    if (observedElement) {
      resizeObserver.unobserve(observedElement);
    }
    resizeObserver.observe(detailElement);
    observedElement = detailElement;
    panelHeight = detailElement.offsetHeight;
  }

  async function selectCategory(category: SkillCategory) {
    if (category.id === activeCategoryId) {
      return;
    }

    activeCategoryId = category.id;
    displayCategory = category;
    await updatePanelHeight();
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

    <div
      class="skills__panel"
      aria-live="polite"
      style={panelHeight !== null ? `height: ${panelHeight}px` : ''}
    >
      <article class="skills__detail" bind:this={detailElement}>
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
    align-items: start;
    overflow: hidden;
    transition: height var(--duration-slow) var(--ease-smooth);
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

</style>
