import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authService } from "../api";
import { secureStorage } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/contants";
import type { User, LoginForm, RegisterForm } from "../interfaces";
import { AuthContext, type AuthContextType } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    authService.getCurrentUser()
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = await authService.getMe();
          setUser(userData);
        }
      } catch (err) {
        console.error("Auth initialization failed:", err);
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (credentials: LoginForm) => {
    const { user: userData } = await authService.login(credentials);
    setUser(userData);
  };

  const register = async (data: RegisterForm) => {
    const { user: userData } = await authService.register(data);
    setUser(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    secureStorage.setItem(STORAGE_KEYS.USER, userData);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
