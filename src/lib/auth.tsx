"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from './types';
import { userStore, seedInitialData } from './store';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  logout: () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    seedInitialData();
    const saved = localStorage.getItem('arbani_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const found = userStore.getById(parsed.id);
        if (found) setUser(found);
      } catch {
        localStorage.removeItem('arbani_session');
      }
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const found = userStore.getByEmail(email);
    if (found && found.password === password && found.aktif) {
      setUser(found);
      localStorage.setItem('arbani_session', JSON.stringify({ id: found.id }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('arbani_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
