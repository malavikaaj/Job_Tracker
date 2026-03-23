import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from './types';

interface AuthContextType {
  user: User | null;
  login: (email: string, name: string) => void;
  register: (email: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('job-tracker-user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('job-tracker-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('job-tracker-user');
    }
  }, [user]);

  const login = (email: string, name: string) => {
    // In a real app, this would verify credentials with a backend
    const loggedInUser: User = {
      id: btoa(email), // Simple way to generate unique ID for demo
      email,
      name,
    };
    setUser(loggedInUser);
  };

  const register = (email: string, name: string) => {
    const newUser: User = {
      id: btoa(email),
      email,
      name,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
