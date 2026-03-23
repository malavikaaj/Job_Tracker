import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from './types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
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

  const login = async (email: string, password: string) => {
    // In a real app, this would be a backend call
    const normalizedEmail = email.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem('job-tracker-registered-users') || '[]');
    const existingUser = users.find((u: any) => u.email.trim().toLowerCase() === normalizedEmail);

    if (!existingUser) {
      throw new Error('No account found with this email. Please sign up first.');
    }

    if (existingUser.password !== password) {
      throw new Error('Incorrect password. Please try again.');
    }

    const loggedInUser: User = {
      id: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
    };
    setUser(loggedInUser);
  };

  const register = async (email: string, name: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem('job-tracker-registered-users') || '[]');
    
    if (users.find((u: any) => u.email.trim().toLowerCase() === normalizedEmail)) {
      throw new Error('An account already exists with this email.');
    }

    const newUser = {
      id: btoa(normalizedEmail),
      email: normalizedEmail,
      name: name.trim(),
      password: password, // In a real app, never store passwords in plain text!
    };

    localStorage.setItem('job-tracker-registered-users', JSON.stringify([...users, newUser]));

    const loggedInUser: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };
    setUser(loggedInUser);
  };

  const logout = () => {
    localStorage.removeItem('job-tracker-user');
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
