export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export type ApplicationStatus = 'applied' | 'interviewing' | 'offer' | 'rejected' | 'archived';

export interface JobApplication {
  id: string;
  userId: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  appliedDate: string;
  jobLink?: string;
  notes?: string;
  location?: string;
  salary?: string;
  category?: string; // New: Category tag
}
