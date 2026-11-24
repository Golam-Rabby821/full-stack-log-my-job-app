import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JobModal } from '@/components/JobModal';
import { Job } from '@/types/job';

describe('JobModal', () => {
  it('validates required fields via Zod before submitting', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(<JobModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Add Job' }));

    expect(await screen.findByText('Company is required')).toBeInTheDocument();
    expect(screen.getByText('Position is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits explicit empty string when clearing optional salary on edit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    const existingJob: Job = {
      _id: 'job-1',
      company: 'Stripe',
      position: 'Frontend Engineer',
      status: 'interview',
      priority: 'high',
      salary: '$180k',
      tags: ['react'],
      createdBy: 'user-1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };

    render(<JobModal isOpen={true} onClose={onClose} onSubmit={onSubmit} job={existingJob} />);

    await user.click(screen.getByRole('tab', { name: /Details/i }));
    const salaryInput = screen.getByLabelText('Salary');
    await user.clear(salaryInput);

    await user.click(screen.getByRole('button', { name: 'Update Job' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
    expect(onSubmit.mock.calls[0][0].salary).toBe('');
  });
});
