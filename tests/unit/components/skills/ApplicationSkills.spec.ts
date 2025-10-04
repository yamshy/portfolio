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
        /Production-grade compute pipelines transforming raw sequencer output into analysis-ready biology/i,
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        /Orchestrated RNA\/DNA-seq and variant calling workflows through Nextflow Tower on AWS Batch/i,
        undefined,
        { timeout: 5000 },
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
        /Hybrid infrastructure spanning Azure Container Apps, on-premises Proxmox virtualization, and Terraform-provisioned cloud resources keeps sequencing pipelines resilient while GitOps automation sustains compliance and eliminates manual toil/i,
        undefined,
        { timeout: 5000 },
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        /Provisioned infrastructure as code with Terraform across Azure \(Container Apps, databases, networking\) and on-premises Proxmox virtualization, maintaining GitOps workflows for reproducible deployments/i,
        undefined,
        { timeout: 5000 },
      ),
    ).toBeInTheDocument();
  });
});
