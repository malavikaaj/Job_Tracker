import { Plus, Search, Briefcase, TrendingUp, CheckCircle, Clock, XCircle, BarChart3, Download, LogOut, User as UserIcon, Upload } from 'lucide-react';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { JobApplication, ApplicationStatus } from './types';
import { ApplicationCard } from './components/ApplicationCard';
import { AddApplicationModal } from './components/AddApplicationModal';
import { useAuth } from './AuthContext';
import { AuthScreen } from './components/AuthScreen';

function App() {
  const { user, logout } = useAuth();
  
  // Local state for applications, initialized based on current user
  const [applications, setApplications] = useState<JobApplication[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user-specific applications from localStorage
  useEffect(() => {
    if (user) {
      const storageKey = `job-applications-${user.id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setApplications(JSON.parse(saved));
      } else {
        // Default dummy data for new users
        const defaultData: JobApplication[] = [
          {
            id: '1',
            userId: user.id,
            company: 'Google',
            position: 'Frontend Engineer',
            status: 'interviewing',
            appliedDate: new Date().toISOString().split('T')[0],
            location: 'Mountain View, CA',
            salary: '$150k - $200k',
            notes: 'Round 2 scheduled for next Tuesday.',
            jobLink: 'https://google.com/jobs'
          }
        ];
        setApplications(defaultData);
      }
    } else {
      setApplications([]);
    }
  }, [user]);

  // Save applications whenever they change
  useEffect(() => {
    if (user && applications.length > 0) {
      localStorage.setItem(`job-applications-${user.id}`, JSON.stringify(applications));
    }
  }, [applications, user]);

  const handleAddApplication = (newApp: Omit<JobApplication, 'id' | 'userId'>) => {
    if (!user) return;
    const application: JobApplication = {
      ...newApp,
      id: crypto.randomUUID(),
      userId: user.id,
    };
    setApplications(prev => [application, ...prev]);
  };

  const handleUpdateApplication = (updatedApp: JobApplication) => {
    setApplications(prev => prev.map(app => app.id === updatedApp.id ? updatedApp : app));
  };

  const handleDeleteApplication = (id: string) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      setApplications(prev => prev.filter(app => app.id !== id));
    }
  };

  const exportToCSV = () => {
    const headers = ['Company', 'Position', 'Status', 'Applied Date', 'Job Link', 'Location', 'Salary', 'Notes'];
    const rows = applications.map(app => [
      app.company,
      app.position,
      app.status,
      app.appliedDate,
      app.jobLink || '',
      app.location || '',
      app.salary || '',
      app.notes || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `JobTracker_Export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].toLowerCase().split(',');
      
      const newApplications: JobApplication[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        // Handle CSV parsing with quotes
        const values: string[] = [];
        let currentValue = '';
        let inQuotes = false;
        
        for (let j = 0; j < lines[i].length; j++) {
          const char = lines[i][j];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(currentValue.trim());
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        values.push(currentValue.trim());

        const app: any = {
          id: crypto.randomUUID(),
          userId: user.id,
          appliedDate: new Date().toISOString().split('T')[0],
          status: 'applied' as ApplicationStatus,
        };

        headers.forEach((header, index) => {
          const value = values[index]?.replace(/^"|"$/g, '').replace(/""/g, '"');
          if (!value) return;

          if (header.includes('company')) app.company = value;
          else if (header.includes('position')) app.position = value;
          else if (header.includes('status')) {
            const status = value.toLowerCase() as ApplicationStatus;
            if (['applied', 'interviewing', 'offer', 'rejected', 'archived'].includes(status)) {
              app.status = status;
            }
          }
          else if (header.includes('date')) app.appliedDate = value;
          else if (header.includes('link')) app.jobLink = value;
          else if (header.includes('location')) app.location = value;
          else if (header.includes('salary')) app.salary = value;
          else if (header.includes('notes')) app.notes = value;
        });

        if (app.company && app.position) {
          newApplications.push(app as JobApplication);
        }
      }

      if (newApplications.length > 0) {
        if (window.confirm(`Found ${newApplications.length} applications. Do you want to import them?`)) {
          setApplications(prev => [...newApplications, ...prev]);
        }
      } else {
        alert('No valid applications found in the CSV. Please ensure it has "Company" and "Position" columns.');
      }
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = 
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      applied: applications.filter(a => a.status === 'applied').length,
      interviewing: applications.filter(a => a.status === 'interviewing').length,
      offers: applications.filter(a => a.status === 'offer').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
    };
  }, [applications]);

  const statCards = [
    { label: 'Total Apps', value: stats.total, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Applied', value: stats.applied, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Interviews', value: stats.interviewing, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Offers', value: stats.offers, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl">
              <BarChart3 className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">JobTracker</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Profile Section */}
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <UserIcon size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 leading-none">{user.name}</span>
                <span className="text-[10px] text-slate-500">{user.email}</span>
              </div>
              <button 
                onClick={logout}
                className="ml-2 p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportCSV}
                accept=".csv"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Import from CSV"
                className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-semibold transition-all active:scale-95 shadow-sm"
              >
                <Upload size={18} />
                <span className="hidden sm:inline">Import</span>
              </button>
              <button
                onClick={exportToCSV}
                title="Export to Excel/Numbers"
                className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-semibold transition-all active:scale-95 shadow-sm"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={() => {
                  setEditingApplication(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Add New</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Profile (only shown on small screens) */}
        <div className="md:hidden flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
          <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500">
            <LogOut size={20} />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                  <stat.icon size={18} />
                </div>
                <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
              </div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search companies or positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {['all', 'applied', 'interviewing', 'offer', 'rejected', 'archived'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as any)}
                className={`px-5 py-3 rounded-2xl font-medium whitespace-nowrap transition-all ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Application Grid */}
        {filteredApplications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApplications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onDelete={handleDeleteApplication}
                onEdit={(app) => {
                  setEditingApplication(app);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
            <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-slate-300" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No applications found</h3>
            <p className="text-slate-500 max-w-xs mx-auto mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? "Try adjusting your filters or search terms." 
                : "Get started by adding your first job application!"}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-all active:scale-95"
              >
                <Plus size={18} />
                Add First Application
              </button>
            )}
          </div>
        )}
      </main>

      <AddApplicationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingApplication(null);
        }}
        onSave={handleAddApplication}
        onUpdate={handleUpdateApplication}
        editingApplication={editingApplication}
      />
    </div>
  );
}

export default App;
