import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

import ApplicationSkills from '../../../../src/components/skills/ApplicationSkills.svelte';

describe('ApplicationSkills', () => {
  it('shows the default category details and updates when selecting another category', async () => {
    render(ApplicationSkills);

    const scientificButton = screen.getByRole('button', {
      name: /scientific computing/i,
    });

    expect(scientificButton).toHaveClass('selected');
    expect(
      screen.getByText(
        /High-performance compute pipelines translating raw sequencer output into audit-ready biology/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Orchestrated RNA\/DNA-seq and variant calling through Nextflow Tower on AWS Batch/i,
      ),
    ).toBeInTheDocument();

    const infrastructureButton = screen.getByRole('button', {
      name: /infrastructure engineering/i,
    });

    await fireEvent.click(infrastructureButton);

    expect(infrastructureButton).toHaveClass('selected');
    expect(scientificButton).not.toHaveClass('selected');
    expect(
      await screen.findByText(
        /Hybrid infrastructure spanning Azure Container Apps, on-prem Proxmox virtualization, and privately managed Kubernetes automation keeps sequencing pipelines resilient/i,
        undefined,
        { timeout: 5000 },
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        /Managed hybrid infrastructure spanning Azure Container Apps and on-premises Proxmox virtualization/i,
      ),
    ).toBeInTheDocument();
  });
});
