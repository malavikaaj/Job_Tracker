import React from 'react';
import type { ApplicationStatus } from '../types';

interface StatusBadgeProps {
  status: ApplicationStatus;
}

const statusConfig = {
  applied: { label: 'Applied', className: 'bg-blue-100 text-blue-800' },
  interviewing: { label: 'Interviewing', className: 'bg-purple-100 text-purple-800' },
  offer: { label: 'Offer', className: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
  archived: { label: 'Archived', className: 'bg-gray-100 text-gray-800' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};
