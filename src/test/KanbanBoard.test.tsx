import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { KanbanBoard } from '@/components/KanbanBoard';
import { Job } from '@/types/job';

const sampleJobs: Job[] = [
  {
    _id: '1',
    company: 'Stripe',
    position: 'Frontend Engineer',
    status: 'pending',
    createdBy: 'u1',
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
  },
  {
    _id: '2',
    company: 'Vercel',
    position: 'Full Stack Engineer',
    status: 'interview',
    createdBy: 'u1',
    createdAt: '2026-05-02T00:00:00.000Z',
    updatedAt: '2026-05-02T00:00:00.000Z',
  },
  {
    _id: '3',
    company: 'Linear',
    position: 'Product Engineer',
    status: 'offer',
    createdBy: 'u1',
    createdAt: '2026-05-03T00:00:00.000Z',
    updatedAt: '2026-05-03T00:00:00.000Z',
  },
];

describe('KanbanBoard', () => {
  it('renders all 5 stage columns and places jobs in matching columns', () => {
    render(
      <MemoryRouter>
        <KanbanBoard
          jobs={sampleJobs}
          onStatusChange={vi.fn()}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      </MemoryRouter>
    );

    const pendingCol = screen.getByTestId('kanban-column-pending');
    const interviewCol = screen.getByTestId('kanban-column-interview');
    const offerCol = screen.getByTestId('kanban-column-offer');
    const acceptedCol = screen.getByTestId('kanban-column-accepted');
    const declinedCol = screen.getByTestId('kanban-column-declined');

    expect(within(pendingCol).getByText('Frontend Engineer')).toBeInTheDocument();
    expect(within(interviewCol).getByText('Full Stack Engineer')).toBeInTheDocument();
    expect(within(offerCol).getByText('Product Engineer')).toBeInTheDocument();
    expect(within(acceptedCol).getByText('0')).toBeInTheDocument();
    expect(within(declinedCol).getByText('0')).toBeInTheDocument();
  });
});
