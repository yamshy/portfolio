import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

import ApplicationSkills from '../../../../src/components/skills/ApplicationSkills.svelte';

describe('ApplicationSkills', () => {
  it('shows the default category and switches details when selecting another', async () => {
    render(ApplicationSkills);

    const defaultButton = screen.getByRole('button', {
      name: 'Scientific Computing',
    });
    expect(defaultButton).toHaveClass('selected');
    expect(
      screen.getByRole('heading', { level: 4, name: 'Scientific Computing' }),
    ).toBeInTheDocument();

    const infrastructureButton = screen.getByRole('button', {
      name: 'Infrastructure Engineering',
    });
    expect(infrastructureButton).not.toHaveClass('selected');

    await fireEvent.click(infrastructureButton);

    expect(infrastructureButton).toHaveClass('selected');
    expect(defaultButton).not.toHaveClass('selected');
    expect(
      screen.getByRole('heading', {
        level: 4,
        name: 'Infrastructure Engineering',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Managed hybrid infrastructure spanning Azure Container Apps and on-premises Proxmox virtualization',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Docker, GitHub Actions, Python automation, Bash scripting',
      ),
    ).toBeInTheDocument();
  });
});
