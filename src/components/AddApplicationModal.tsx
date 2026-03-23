import React, { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';
import type { JobApplication, ApplicationStatus } from '../types';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (application: Omit<JobApplication, 'id' | 'userId'>) => void;
  onUpdate: (application: JobApplication) => void;
  editingApplication: JobApplication | null;
}

const initialFormState: Omit<JobApplication, 'id' | 'userId'> = {
  company: '',
  position: '',
  status: 'applied',
  appliedDate: new Date().toISOString().split('T')[0],
  jobLink: '',
  notes: '',
  location: '',
  salary: '',
  category: '',
};

export const AddApplicationModal: React.FC<AddApplicationModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  onUpdate,
  editingApplication 
}) => {
  const [formData, setFormData] = useState<Omit<JobApplication, 'id' | 'userId'>>(initialFormState);

  useEffect(() => {
    if (editingApplication) {
      const { id, userId, ...rest } = editingApplication;
      setFormData(rest);
    } else {
      setFormData(initialFormState);
    }
  }, [editingApplication, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingApplication) {
      onUpdate({ ...formData, id: editingApplication.id, userId: editingApplication.userId });
    } else {
      onSave(formData);
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const statusOptions: ApplicationStatus[] = ['applied', 'interviewing', 'offer', 'rejected', 'archived'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {editingApplication ? 'Edit Application' : 'New Application'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                required
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                placeholder="Google"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input
                required
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                placeholder="Frontend Developer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
              >
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Applied Date</label>
              <input
                required
                type="date"
                name="appliedDate"
                value={formData.appliedDate}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Link</label>
            <input
              name="jobLink"
              value={formData.jobLink}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              placeholder="https://jobs.google.com/..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                placeholder="Remote / New York"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
              <input
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                placeholder="$100k - $120k"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category / Tag</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              placeholder="e.g. Frontend, Fullstack, Remote"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
              placeholder="Referral from John Doe..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              {editingApplication ? (
                <>
                  <Save size={18} />
                  Update
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Save
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
