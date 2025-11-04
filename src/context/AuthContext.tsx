import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  login: (id: string, name: string, email: string, role: string) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (id: string, name: string, email: string, role: string) => {
    setUser({ id, name, email, role, phone: '+223 12 34 56 78', address: 'Bamako, Mali' }); // Dummy data
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedUser });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
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
