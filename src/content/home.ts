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
    value: '1M+ samples',
    context:
      'Sequencing and analysis workloads orchestrated end-to-end without sacrificing reproducibility or compliance',
  },
  {
    label: 'Efficiency unlocked',
    value: '3k+ hours saved',
    context:
      'Systematic workflow automation reclaimed the equivalent of two FTEs across data processing and deployment',
  },
];

export const projects: Project[] = [
  {
    title: 'GitOps Kubernetes Platform',
    summary:
      'Self-hosted production Kubernetes built as a GitOps control plane for every service I run.',
    problem:
      'Needed production-grade infrastructure at home capable of sustaining public workloads without managed cloud safety nets.',
    solution:
      'Provisioned bare-metal cluster nodes, wired Flux CD pipelines, centralised secrets with Infisical, and automated lifecycle work via Renovate.',
    stack: [
      'Kubernetes',
      'Flux CD',
      'Infisical',
      'MetalLB',
      'Renovate',
      'Cloudflare Tunnels',
    ],
    results: [
      '24/7 uptime across self-hosted services',
      'GitOps-driven deployments with policy-controlled rollouts',
      'Production workloads reachable globally through Cloudflare Tunnels',
    ],
    challenges: [
      'Hardening consumer hardware to behave like a production cluster',
      'Designing sealed-secret rotation and update automation entirely in Git',
    ],
    link: 'https://github.com/yamshy/homelab',
    layout: 'wide',
  },
  {
    title: 'This Website',
    summary:
      'Astro + TypeScript portfolio deployed through the same GitOps platform it documents.',
    problem:
      'Required a modern portfolio that demonstrates platform engineering craft while running on my own infrastructure.',
    solution:
      'Built the site with Astro and TypeScript, containerised it with Docker, and ship updates through GitHub Actions into the Kubernetes cluster.',
    stack: [
      'Astro',
      'TypeScript',
      'Docker',
      'GitHub Actions',
      'Kubernetes',
      'Cloudflare Tunnels',
    ],
    results: [
      'Self-hosted delivery on the GitOps Kubernetes platform',
      'CI/CD automated from commit to production via GitHub Actions',
      'Edge routing and TLS handled by Cloudflare Tunnels',
    ],
    challenges: [
      'Keeping container images lightweight for rapid GitOps rollouts',
      'Orchestrating zero-downtime releases on a homelab control plane',
    ],
    link: 'https://github.com/yamshy/portfolio',
    layout: 'standard',
  },
  {
    title: 'YamshyOS',
    summary:
      'Fedora Atomic image engineered with immutable infrastructure patterns for my daily workstation.',
    problem:
      'Wanted a reproducible desktop environment that keeps my personal workstation consistent with the same GitOps and supply-chain guarantees I trust elsewhere.',
    solution:
      'Used BlueBuild to compose a custom Fedora Atomic variant tailored to my desktop, layered rpm-ostree updates, and signed releases through Sigstore.',
    stack: ['Fedora Atomic', 'BlueBuild', 'rpm-ostree', 'Podman', 'Sigstore'],
    results: [
      'Cryptographically signed system images for trustworthy personal installs',
      'Atomic updates with instant rollback via rpm-ostree',
      'GitOps configuration keeps my desktop converged with declarative state',
    ],
    challenges: [
      'Integrating Sigstore signing into an immutable image build pipeline',
      'Balancing containerised workloads with read-only host constraints',
    ],
    link: 'https://github.com/yamshy/yamshy-os',
    layout: 'tall',
  },
];

export const experiences: Experience[] = [
  {
    role: 'Technical Operations Lead',
    org: 'Advanced Cellular Dynamics',
    years: '2019 — 2024',
    focus:
      'Led molecular biology operations while building computational infrastructure and web-based scientific workflow tools for high-throughput research.',
    impact: [
      'Built automated pipelines processing 1,000,000+ genomic sequences with 50% reduction in turnaround time, orchestrating workflows across cloud infrastructure',
      'Deployed production NGS workflows on Kubernetes and AWS Batch via Nextflow Tower, managing TB-scale genomic data with Terraform-provisioned infrastructure',
      'Developed web-based scientific applications using SvelteKit and FastAPI with containerized deployments, creating custom analysis tools and interactive dashboards that streamlined biological data workflows',
      'Operated and maintained Illumina NGS platforms (iSeq100, NextSeq500), managing complete workflows from library preparation through data analysis',
      'Mentored 4+ scientists in laboratory automation and computational workflows',
      'Implemented LIMS integrations and ETL pipelines syncing instrumentation data with cloud analytics environments',
    ],
  },
  {
    role: 'IT Systems Support (Part-Time)',
    org: 'Allcare Medical Clinic',
    years: '2025',
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

export const contactChannels: ContactChannel[] = [
  {
    label: 'Email',
    value: 'sajudia@proton.me',
    href: 'mailto:sajudia@proton.me',
  },
  {
    label: 'GitHub',
    value: 'github.com/yamshy',
    href: 'https://github.com/yamshy',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/shyamajudia',
    href: 'https://www.linkedin.com/in/shyamajudia/',
  },
];
