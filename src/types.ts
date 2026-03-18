export type ApplicationStatus = 'applied' | 'interviewing' | 'offer' | 'rejected' | 'archived';

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  appliedDate: string;
  jobLink?: string;
  notes?: string;
  location?: string;
  salary?: string;
}
