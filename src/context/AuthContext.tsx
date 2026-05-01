import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "@/lib/api";

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
  login: (email: string, motDePasse: string) => Promise<User>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (!token || !storedUser) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoading(false);
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      // Normalization intelligente du rôle
      if (userData && userData.role) {
        let role = userData.role.replace('ROLE_', '').toLowerCase();
        if (role.includes('prof') || role.includes('teach') || role.includes('enseig')) role = 'teacher';
        else if (role.includes('etud') || role.includes('stud')) role = 'student';
        else if (role.includes('admin')) role = 'admin';
        else if (role.includes('moder')) role = 'moderator';
        userData.role = role;
      }
      setUser(userData);
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email: string, motDePasse: string) => {
    try {
      const response = await api.post("auth/login", { email, motDePasse });
      
      const token = response.data.token || response.data.jwt || response.data.accessToken;
      
      let userData = response.data.user;
      if (!userData && response.data.email) {
        userData = {
          id: response.data.id,
          name: response.data.name || response.data.username || response.data.nom || "Utilisateur",
          email: response.data.email,
          role: response.data.role || response.data.roleName,
          avatar: response.data.avatar
        };
      }

      if (!token) throw new Error("Token non reçu du serveur");

      if (!userData || !userData.role) {
        if (!userData) userData = { email } as any;
        if (!userData.role) userData.role = "student"; 
      }

      let role = userData.role.replace('ROLE_', '').toLowerCase();
      if (role.includes('prof') || role.includes('teach') || role.includes('enseig')) role = 'teacher';
      else if (role.includes('etud') || role.includes('stud')) role = 'student';
      else if (role.includes('admin')) role = 'admin';
      else if (role.includes('moder')) role = 'moderator';
      userData.role = role;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      
      console.log("✅ Connexion réussie :", userData.role);
      return userData;
    } catch (error: any) {
      console.error("❌ Erreur Login :", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Identifiants invalides");
    }
  }, []);

  const register = useCallback(async (data: any) => {
    try {
      const response = await api.post("auth/register", data);
      
      const token = response.data.token || response.data.jwt || response.data.accessToken;
      
      let userData = response.data.user;
      if (!userData && response.data.email) {
        userData = {
          id: response.data.id,
          name: response.data.name || response.data.username || response.data.nom || "Utilisateur",
          email: response.data.email,
          role: response.data.role || response.data.roleName,
          avatar: response.data.avatar
        };
      }

      if (!token) throw new Error("Token non reçu après inscription");

      if (!userData || !userData.role) {
        if (!userData) userData = { email: data.email } as any;
        if (!userData.role) userData.role = "student"; 
      }

      let role = userData.role.replace('ROLE_', '').toLowerCase();
      if (role.includes('prof') || role.includes('teach') || role.includes('enseig')) role = 'teacher';
      else if (role.includes('etud') || role.includes('stud')) role = 'student';
      else if (role.includes('admin')) role = 'admin';
      else if (role.includes('moder')) role = 'moderator';
      userData.role = role;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      console.error("❌ Erreur Inscription :", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Erreur lors de l'inscription");
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
