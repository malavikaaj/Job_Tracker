import React from 'react';
import { Calendar, Link as LinkIcon, MapPin, Trash2, Edit2, DollarSign } from 'lucide-react';
import type { JobApplication } from '../types';
import { StatusBadge } from './StatusBadge';
import { format } from 'date-fns';

interface ApplicationCardProps {
  application: JobApplication;
  onDelete: (id: string) => void;
  onEdit: (application: JobApplication) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ 
  application, 
  onDelete, 
  onEdit 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{application.position}</h3>
          <p className="text-gray-600 font-medium">{application.company}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(application)}
            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => onDelete(application.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500 gap-2">
          <Calendar size={14} />
          <span>Applied: {format(new Date(application.appliedDate), 'MMM dd, yyyy')}</span>
        </div>
        
        {application.location && (
          <div className="flex items-center text-sm text-gray-500 gap-2">
            <MapPin size={14} />
            <span>{application.location}</span>
          </div>
        )}

        {application.salary && (
          <div className="flex items-center text-sm text-gray-500 gap-2">
            <DollarSign size={14} />
            <span>{application.salary}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto">
        <StatusBadge status={application.status} />
        
        {application.jobLink && (
          <a 
            href={application.jobLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            <LinkIcon size={14} />
            View Listing
          </a>
        )}
      </div>

      {application.notes && (
        <div className="mt-4 pt-4 border-t border-gray-50">
          <p className="text-xs text-gray-500 italic line-clamp-2">{application.notes}</p>
        </div>
      )}
    </div>
  );
};
