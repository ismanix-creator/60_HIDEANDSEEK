/**
 * @file        AuthContext.tsx
 * @description Auth Context für localStorage-basierte Session
 * @version     0.3.0
 * @created     2026-01-07 01:18:02 CET
 * @updated     2026-01-11 03:06:28 CET
 * @author      Akki Scholze
 *
 * @note        Auth ist implementiert aber standardmäßig deaktiviert (auth.enabled=false)
 *              Login/Logout über localStorage persistence
 *
 * @changelog
 *   0.3.0 - 2026-01-11 - Fixed: unsafe-argument error in setUser (type annotation added)
 *   0.2.0 - 2026-01-08 - localStorage-basierte Auth implementiert (TODOs entfernt)
 *   0.1.0 - 2026-01-07 - Dummy implementation (kein Login aktiv)
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface User {
  id: string;
  role: 'admin' | 'user';
  username: string;
  kundeId: number | null;
}

export interface AuthContextValue {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_STORAGE_KEY = 'auth_session';

/**
 * AuthProvider mit localStorage persistence
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = (await res.json()) as Record<string, unknown>;
    const role: 'admin' | 'user' = data.role === 'admin' || data.role === 'user' ? data.role : 'user';
    const sessionUser: User = {
      id: String(data.userId),
      username: String(data.username),
      role,
      kundeId: data.kundeId as number | null
    };

    setUser(sessionUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
  };

  const logout = (): Promise<void> => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return Promise.resolve();
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook für Auth-Zugriff
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
