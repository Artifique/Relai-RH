import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: { id: string; name: string; role: string } | null;
  login: (id: string, name: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null);

  const login = (id: string, name: string, role: string) => {
    setUser({ id, name, role });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
