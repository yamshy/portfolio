<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  type Metric = {
    label: string;
    unit: string;
    baseline: number;
    variance: number;
  };

  const metrics: Metric[] = [
    { label: 'Reads/hour', unit: 'M', baseline: 312, variance: 24 },
    { label: 'Latency', unit: 'min', baseline: 18, variance: 6 },
    { label: 'Cost / 10k samples', unit: '$', baseline: 42, variance: 3 },
  ];

  type NodeState = {
    id: string;
    label: string;
    value: number;
    target: number;
    unit: string;
  };

  const nodes: NodeState[] = [
    { id: 'ingest', label: 'Ingest', value: 92, target: 96, unit: '%' },
    { id: 'qc', label: 'QC', value: 84, target: 92, unit: '%' },
    { id: 'align', label: 'Alignment', value: 71, target: 80, unit: '%' },
    { id: 'variant', label: 'Variant Calls', value: 67, target: 74, unit: '%' },
  ];

  let sparkline = Array.from({ length: 24 }, (_, index) => 260 + Math.sin(index / 2) * 18);
  let metricValues = metrics.map((metric) => metric.baseline);
  let nodeValues = nodes.map((node) => node.value);

  let timer: number | undefined;

  const jitter = (baseline: number, variance: number) => {
    const offset = (Math.random() - 0.5) * variance * 2;
    return Math.max(0, baseline + offset);
  };

  const updateData = () => {
    metricValues = metrics.map((metric) => Number(jitter(metric.baseline, metric.variance).toFixed(1)));
    nodeValues = nodes.map((node) => Number(jitter(node.target, 6).toFixed(0)));
    sparkline = [...sparkline.slice(1), jitter(260, 16)];
  };

  onMount(() => {
    timer = window.setInterval(updateData, 3200);
    return () => window.clearInterval(timer);
  });

  onDestroy(() => {
    if (timer) {
      clearInterval(timer);
    }
  });
</script>

<section class="dashboard" aria-label="Infrastructure health">
  <header class="dashboard__header">
    <div>
      <p class="u-title-overline">Infrastructure Pulse</p>
      <h3>Sequencing Platform Control Plane</h3>
    </div>
    <p>
      Orchestrated on hybrid GPU clusters. Automated elasticity ensures Kubernetes node pools scale
      before wet-lab batches arrive.
    </p>
  </header>

  <div class="dashboard__grid">
    <div class="dashboard__card dashboard__card--metrics">
      <h4>Throughput Envelope</h4>
      <ul>
        {#each metrics as metric, index}
          <li>
            <span>{metric.label}</span>
            <strong>
              {metricValues[index]}
              <small>{metric.unit}</small>
            </strong>
          </li>
        {/each}
      </ul>
    </div>

    <div class="dashboard__card dashboard__card--spark">
      <h4>Pipeline cadence</h4>
      <svg viewBox="0 0 320 120" preserveAspectRatio="none" role="img">
        <title>Pipeline throughput trend</title>
        <defs>
          <linearGradient id="spark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="var(--color-science-green)" stop-opacity="0.9" />
            <stop offset="100%" stop-color="var(--color-science-purple)" stop-opacity="0.15" />
          </linearGradient>
        </defs>
        <path
          d={`M 0 ${120 - sparkline[0]} ${sparkline
            .map((point, i) => `L ${(i / (sparkline.length - 1)) * 320} ${120 - point}`)
            .join(' ')}`}
          class="spark"
        />
        <polygon
          points={`0,120 ${sparkline
            .map((point, i) => `${(i / (sparkline.length - 1)) * 320},${120 - point}`)
            .join(' ')} 320,120`}
          class="spark-fill"
        />
      </svg>
      <p>
        95th percentile latency <strong>{Math.max(...sparkline).toFixed(0)}s</strong> across regional
        clusters. Canary analysis gates deployments with Linkerd golden metrics.
      </p>
    </div>

    <div class="dashboard__card dashboard__card--nodes">
      <h4>Workflow reliability</h4>
      <ul>
        {#each nodes as node, index}
          <li>
            <div class="node__title">
              <span>{node.label}</span>
              <small>target {node.target}{node.unit}</small>
            </div>
            <div class="node__meter">
              <div
                class="node__fill"
                style={`width: ${Math.min(100, nodeValues[index])}%`}
                role="presentation"
              ></div>
              <span>{nodeValues[index]}{node.unit}</span>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</section>

<style>
  .dashboard {
    display: grid;
    gap: var(--space-lg);
    padding: var(--space-lg);
    background: color-mix(in oklab, var(--color-surface) 90%, transparent 10%);
    border-radius: var(--radius-lg);
    border: 1px solid color-mix(in oklab, var(--color-border) 65%, transparent 35%);
    box-shadow: var(--shadow-sm);
  }

  .dashboard__header {
    display: grid;
    gap: var(--space-sm);
  }

  .dashboard__header h3 {
    font-size: var(--heading-md);
  }

  .dashboard__header p {
    max-width: 60ch;
  }

  .dashboard__grid {
    display: grid;
    gap: var(--space-lg);
  }

  .dashboard__card {
    padding: var(--space-md);
    border-radius: var(--radius-md);
    background: color-mix(in oklab, var(--color-surface-strong) 40%, var(--color-surface) 60%);
    border: 1px solid color-mix(in oklab, var(--color-border) 60%, transparent 40%);
    box-shadow: var(--shadow-sm);
  }

  .dashboard__card h4 {
    font-size: var(--heading-md);
    font-family: var(--font-serif);
    margin-bottom: var(--space-sm);
  }

  .dashboard__card ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.75rem;
  }

  .dashboard__card--metrics li {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  .dashboard__card--metrics span {
    color: var(--color-text-muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-size: 0.72rem;
  }

  .dashboard__card--metrics strong {
    font-size: 1.4rem;
    font-family: var(--font-sans);
    color: var(--color-text);
  }

  .dashboard__card--metrics strong small {
    font-size: 0.8rem;
    margin-left: 0.25rem;
    color: var(--color-text-subtle);
  }

  .dashboard__card--spark svg {
    width: 100%;
    height: auto;
  }

  .spark {
    fill: none;
    stroke: var(--color-science-green);
    stroke-width: 3;
    filter: drop-shadow(0 12px 18px rgba(41, 123, 102, 0.25));
  }

  .spark-fill {
    fill: url(#spark);
  }

  .dashboard__card--nodes li {
    display: grid;
    gap: 0.5rem;
  }

  .node__title {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-subtle);
  }

  .node__meter {
    position: relative;
    background: color-mix(in oklab, var(--color-surface) 40%, var(--color-surface-strong) 60%);
    border-radius: 999px;
    border: 1px solid color-mix(in oklab, var(--color-border) 60%, transparent 40%);
    padding: 0.45rem;
  }

  .node__fill {
    height: 8px;
    border-radius: 999px;
    background: linear-gradient(
      90deg,
      color-mix(in oklab, var(--color-science-green) 70%, transparent) 0%,
      color-mix(in oklab, var(--color-primary) 80%, transparent) 50%,
      color-mix(in oklab, var(--color-science-purple) 70%, transparent) 100%
    );
    transition: width var(--duration-slow) var(--ease-smooth);
  }

  .node__meter span {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.75rem;
    color: var(--color-text);
  }

  @media (min-width: 960px) {
    .dashboard__grid {
      grid-template-columns: repeat(12, 1fr);
    }

    .dashboard__card--metrics {
      grid-column: span 4;
    }

    .dashboard__card--spark {
      grid-column: span 4;
    }

    .dashboard__card--nodes {
      grid-column: span 4;
    }
  }

  @media (max-width: 600px) {
    .dashboard {
      padding: var(--space-md);
    }
  }
</style>
