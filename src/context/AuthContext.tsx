import React, { createContext, useContext, useState, useCallback } from "react";

export type UserRole = "student" | "teacher" | "moderator" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<string, User> = {
  "student@iga.ma": { id: "1", name: "Ahmed Benali", email: "student@iga.ma", role: "student" },
  "teacher@iga.ma": { id: "2", name: "Prof. Karim Idrissi", email: "teacher@iga.ma", role: "teacher" },
  "moderator@iga.ma": { id: "3", name: "Sara Alaoui", email: "moderator@iga.ma", role: "moderator" },
  "admin@iga.ma": { id: "4", name: "Admin System", email: "admin@iga.ma", role: "admin" },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, _password: string) => {
    const found = MOCK_USERS[email];
    if (!found) throw new Error("Invalid credentials");
    setUser(found);
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
