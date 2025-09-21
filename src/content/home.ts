export type HeroStat = {
  label: string;
  value: string;
  context: string;
};

export type Project = {
  title: string;
  summary: string;
  problem: string;
  solution: string;
  stack: string[];
  results: string[];
  challenges: string[];
  link?: string;
  layout: 'wide' | 'standard' | 'tall';
};

export type Experience = {
  role: string;
  org: string;
  years: string;
  focus: string;
  impact: string[];
};

export type Insight = {
  title: string;
  summary: string;
};

export type ContactChannel = {
  label: string;
  value: string;
  href: string;
};

export const heroStats: HeroStat[] = [
  {
    label: 'Reliability engineered',
    value: '24/7 uptime',
    context:
      'Self-healing hybrid clusters with automated failover keeping research platforms continuously available',
  },
  {
    label: 'Scale proven in production',
    value: '10,000+ samples',
    context:
      'Sequencing and analysis workloads orchestrated end-to-end without sacrificing reproducibility or compliance',
  },
  {
    label: 'Efficiency unlocked',
    value: '3,500+ hours saved',
    context:
      'Systematic workflow automation reclaimed the equivalent of two FTEs across data processing and deployment',
  },
];

export const projects: Project[] = [
  {
    title: 'Adaptive NGS Orchestrator',
    summary:
      'Transformed a brittle sequencing pipeline into a self-healing platform spanning benchtop sequencers and GPU clouds.',
    problem:
      'Legacy Bash pipelines stalled nightly; manual restarts delayed oncology trial enrollment by 48 hours on average.',
    solution:
      'Recomposed workflows into event-driven Nextflow + Argo, added automatic reagent QC triggers, and codified approvals in GitOps.',
    stack: ['Nextflow', 'Argo Workflows', 'Terraform', 'Grafana', 'Karpenter'],
    results: [
      '97.6% reduction in rerun hours after implementing health-probing sidecars',
      'Mean turnaround dropped from 36h → 9.4h with adaptive GPU autoscaling',
      'Audit-ready provenance bundles generated for every cohort in 2.1 seconds',
    ],
    challenges: [
      'Designing deterministic container images for FDA submissions without sacrificing GPU throughput',
      'Aligning wet-lab SOP changes with automated gating to avoid reagent wastage',
    ],
    link: '/case-studies/adaptive-ngs',
    layout: 'wide',
  },
  {
    title: 'Lab Telemetry Mesh',
    summary:
      'Synchronized 42 lab instruments with streaming analytics for reagent consumption and maintenance forecasting.',
    problem:
      'Manual CSV exports obscured reagent shortages; chromatography columns failed unpredictably.',
    solution:
      'Edge collectors stream to Redpanda → Flink windowing; predictive maintenance models trigger Slack + PagerDuty runbooks.',
    stack: ['Rust', 'Apache Flink', 'Redpanda', 'dbt', 'PagerDuty'],
    results: [
      'Cut emergency instrument downtime 61%',
      'Forecast accuracy ±4.2% for reagent depletion at 24h horizon',
      'Automatically scheduled calibrations saved $420k/year in consumables',
    ],
    challenges: [
      'Reconciling vendor-specific OPC-UA schemas into a governed contract catalog',
      'Guaranteeing <10s latency for alerts inside air-gapped cleanrooms',
    ],
    layout: 'standard',
  },
  {
    title: 'Regulatory Data Fabric',
    summary:
      'Unified lab notebooks, LIMS, and EMR data into a governed knowledge graph feeding translational dashboards.',
    problem:
      'Trial teams waited 14 days for curated cohorts; audit requests required multi-week detective work.',
    solution:
      'Delta Lake backed data contracts orchestrated by Dagster with automated CFR 21 Part 11 validations.',
    stack: [
      'Dagster',
      'Delta Lake',
      'Great Expectations',
      'AWS Lake Formation',
    ],
    results: [
      'Cohort assembly SLA shrank to 2 hours with reproducible SQL snapshots',
      'Audit trails generated in <5 minutes across seven regulatory frameworks',
      'Downstream dashboards saw 18x query acceleration using Arrow flight servers',
    ],
    challenges: [
      'Designing role-aware lineage views acceptable to both QA and research leadership',
      'Coordinating schema evolution without breaking legacy analytics notebooks',
    ],
    layout: 'tall',
  },
  {
    title: 'Clinician-Ready Insights Portal',
    summary:
      'Delivered a decision support UI synthesising genomic variants, imaging markers, and trial eligibility in real time.',
    problem:
      'Oncologists toggled between six systems for molecular tumour boards; insights arrived days after pathology sign-off.',
    solution:
      'Built Astro+Svelte portal with WebGL cohort visualisations, FHIR APIs, and embedded reproducible notebooks.',
    stack: ['Astro', 'Svelte', 'WebGL', 'FHIR', 'Auth0'],
    results: [
      'Meeting prep time fell from 5h to 55m per tumour board',
      'Integrated feedback loops driving weekly ML model recalibration',
      'WCAG AAA compliant UI approved for bedside deployment',
    ],
    challenges: [
      'Balancing GPU-heavy visualisations with sub-3s load on hospital Wi-Fi',
      'Designing redaction workflows for multi-institutional collaboration',
    ],
    layout: 'standard',
  },
];

export const experiences: Experience[] = [
  {
    role: 'Technical Operations Lead',
    org: 'Advanced Cellular Dynamics',
    years: '2019 — 2024',
    focus:
      'Led molecular biology operations while building computational infrastructure for high-throughput research.',
    impact: [
      'Built automated pipelines processing 10,000+ samples with a 50% reduction in turnaround time',
      'Deployed NGS workflows on AWS Batch via Nextflow Tower, managing TB-scale genomic data',
      'Mentored 4+ scientists in laboratory automation and computational workflows',
    ],
  },
  {
    role: 'IT Systems Support (Part-Time)',
    org: 'Allcare Medical Clinic',
    years: '2018 — 2024',
    focus:
      'Maintained healthcare IT infrastructure and supported EMR system implementation.',
    impact: [
      'Managed network infrastructure and system reliability for clinical operations',
      'Supported technology adoption through training and technical documentation',
    ],
  },
  {
    role: 'Research Assistant',
    org: 'University of Washington',
    years: '2017 — 2018',
    focus:
      'Developed molecular biology techniques and data systems supporting neural development research in Drosophila genetics.',
    impact: [
      'Designed and constructed expression plasmids with targeted transcription activation systems',
      'Performed quantitative behavioral assays and data analysis for neuronal characterization',
      'Configured laboratory data collection systems and automated analysis workflows',
    ],
  },
];

export const insights: Insight[] = [
  {
    title: 'Why Docker Matters for Reproducible Science',
    summary:
      'Container digests outlast lab rotations. Provenance-aware builds keep regulators and collaborators aligned on exactly what ran.',
  },
  {
    title: 'Designing Observability for Wet-Lab Reality',
    summary:
      'Instrumentation fails physically before dashboards blink. Pair sensor fusion with service-level indicators to detect reagent anomalies first.',
  },
  {
    title: 'From Bench to GPU Cluster',
    summary:
      'Latency budgets begin at the pipette. Aligning robotics cycles with autoscalers keeps GPU utilisation high without starving experiments.',
  },
];

export const contactChannels: ContactChannel[] = [
  {
    label: 'Email',
    value: 'sajudia@proton.me',
    href: 'mailto:sajudia@proton.me',
  },
  {
    label: 'Schedule',
    value: 'cal.com/shyam-ajudia',
    href: 'https://cal.com/shyam-ajudia',
  },
  {
    label: 'ResearchGate',
    value: 'researchgate.net/profile/Shyam-Ajudia',
    href: 'https://researchgate.net/profile/Shyam-Ajudia',
  },
  {
    label: 'GitHub',
    value: 'github.com/yamshy',
    href: 'https://github.com/yamshy',
  },
];

export const codeSample = `
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  labels:
    runbook: ngs-ingest
spec:
  entrypoint: orchestrate
  templates:
    - name: orchestrate
      dag:
        tasks:
          - name: qc
            template: fastqc
          - name: align
            template: gpu-bwa
            depends: qc.Succeeded
            arguments:
              parameters:
                - name: lanes
                  value: {{inputs.parameters.lanes}}
`;
