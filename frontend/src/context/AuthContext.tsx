"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

import { authApi, type UserInfo, type TokenPair } from "@/lib/api";

/* ──────────────────────────────────────────────────────────────────────────
   Types
   ────────────────────────────────────────────────────────────────────────── */

interface AuthState {
  user: UserInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

/* ──────────────────────────────────────────────────────────────────────────
   Token helpers
   ────────────────────────────────────────────────────────────────────────── */

const TOKEN_KEY = "ow_access_token";
const REFRESH_KEY = "ow_refresh_token";

function saveTokens(tokens: TokenPair): void {
  localStorage.setItem(TOKEN_KEY, tokens.access_token);
  localStorage.setItem(REFRESH_KEY, tokens.refresh_token);
}

function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/* ──────────────────────────────────────────────────────────────────────────
   Context
   ────────────────────────────────────────────────────────────────────────── */

const AuthContext = createContext<AuthContextValue | null>(null);

/* ──────────────────────────────────────────────────────────────────────────
   Provider
   ────────────────────────────────────────────────────────────────────────── */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Restore session on mount
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setState({ user: null, isLoading: false, isAuthenticated: false });
      return;
    }
    authApi
      .me()
      .then((user) => {
        setState({ user, isLoading: false, isAuthenticated: true });
      })
      .catch(() => {
        // Token expired — try refresh
        const refreshToken = localStorage.getItem(REFRESH_KEY);
        if (refreshToken) {
          return authApi.refresh(refreshToken).then((tokens) => {
            saveTokens(tokens);
            return authApi.me();
          });
        }
        return null;
      })
      .then((user) => {
        if (user) {
          setState({ user, isLoading: false, isAuthenticated: true });
        } else {
          clearTokens();
          setState({ user: null, isLoading: false, isAuthenticated: false });
        }
      })
      .catch(() => {
        clearTokens();
        setState({ user: null, isLoading: false, isAuthenticated: false });
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await authApi.login(email, password);
    saveTokens(tokens);
    const user = await authApi.me();
    setState({ user, isLoading: false, isAuthenticated: true });
  }, []);

  const signup = useCallback(
    async (email: string, password: string, fullName?: string) => {
      const tokens = await authApi.signup(email, password, fullName);
      saveTokens(tokens);
      const user = await authApi.me();
      setState({ user, isLoading: false, isAuthenticated: true });
    },
    []
  );

  const logout = useCallback(() => {
    clearTokens();
    setState({ user: null, isLoading: false, isAuthenticated: false });
  }, []);

  const refresh = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (!refreshToken) {
      logout();
      return;
    }
    try {
      const tokens = await authApi.refresh(refreshToken);
      saveTokens(tokens);
      const user = await authApi.me();
      setState({ user, isLoading: false, isAuthenticated: true });
    } catch {
      logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ ...state, login, signup, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Hook
   ────────────────────────────────────────────────────────────────────────── */

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}