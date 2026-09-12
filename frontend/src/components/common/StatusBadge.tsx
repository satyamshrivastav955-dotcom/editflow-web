// src/components/common/StatusBadge.tsx
import type { ProjectStatus } from '../../types';

interface Props {
  status: ProjectStatus;
}

const labels: Record<ProjectStatus, string> = {
  pending:     'Pending',
  in_progress: 'In Progress',
  completed:   'Completed',
};

export default function StatusBadge({ status }: Props) {
  return (
    <span className={`badge badge-${status}`}>
      {labels[status] ?? status}
    </span>
  );
}
