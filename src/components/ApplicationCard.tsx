import React from 'react';
import { Calendar, Link as LinkIcon, MapPin, Trash2, Edit2, DollarSign, Tag, Clock } from 'lucide-react';
import type { JobApplication } from '../types';
import { StatusBadge } from './StatusBadge';
import { format, differenceInDays } from 'date-fns';

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
  const daysSinceApplied = differenceInDays(new Date(), new Date(application.appliedDate));
  const needsFollowUp = application.status === 'applied' && daysSinceApplied >= 7;

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${needsFollowUp ? 'border-orange-200 ring-1 ring-orange-50' : 'border-gray-100'} p-5 hover:shadow-md transition-shadow relative overflow-hidden`}>
      {needsFollowUp && (
        <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg flex items-center gap-1">
          <Clock size={10} />
          FOLLOW UP
        </div>
      )}
      
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

        {application.category && (
          <div className="flex items-center text-sm text-blue-600 gap-2 font-medium">
            <Tag size={14} />
            <span>{application.category}</span>
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
