"use client";

import { fetchRequest } from "@/lib/api";
import { AuthContextType } from "@/types/auth";
import { User } from "@/types/user";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

const TOKEN_KEY = "jwt_token";
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return true;

    return !!localStorage.getItem(TOKEN_KEY);
  });

  const refreshUser = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    try {
      const res = await fetchRequest("/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error("Failed to refresh user profile:", err);
    }
  };

  // Restore session
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setLoading(false);
      return;
    }

    refreshUser().finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetchRequest("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!res.ok) {
      let message = "Login failed";
      try {
        const errorData = await res.json();
        message = errorData.message || message;
      } catch {}
      throw new Error(message);
    }

    const data = await res.json();

    localStorage.setItem(TOKEN_KEY, data.token);

    setUser(data.user);
  };

  const signup = async (name: string, email: string, password: string) => {
    const res = await fetchRequest("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    if (!res.ok) {
      let message = "Signup failed";
      try {
        const errorData = await res.json();
        message = errorData.message || message;
      } catch {}
      throw new Error(message);
    }

    const data = await res.json();

    localStorage.setItem(TOKEN_KEY, data.token);

    setUser(data.user);
  };

  const logout = async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    await fetchRequest("/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.removeItem(TOKEN_KEY);

    setUser(null);
  };

  const forgot = async (email: string) => {
    const res = await fetchRequest("/forgot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    if (!res.ok) {
      let message = "Failed to send reset email";
      try {
        const errorData = await res.json();
        message = errorData.message || message;
      } catch {}
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        forgot,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
