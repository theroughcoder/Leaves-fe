import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthData } from '../utils/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: AuthData) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const authData = localStorage.getItem('leaves_auth_data');
        if (authData) {
          const parsed = JSON.parse(authData);
          setUser(parsed.user);
          setToken(parsed.token);
        }
      } catch (error) {
        console.error('Failed to initialize auth state:', error);
        // Clear corrupted data
        localStorage.removeItem('leaves_auth_data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (authData: AuthData) => {
    setUser(authData.user);
    setToken(authData.token);
    localStorage.setItem('leaves_auth_data', JSON.stringify(authData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('leaves_auth_data');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    const authData = localStorage.getItem('leaves_auth_data');
    if (authData) {
      const parsed = JSON.parse(authData);
      parsed.user = updatedUser;
      localStorage.setItem('leaves_auth_data', JSON.stringify(parsed));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
