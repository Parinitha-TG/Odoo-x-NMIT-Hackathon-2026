import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AuthUser {
  id: string;
  employeeId: string;
  email: string;
  role: "EMPLOYEE" | "HR_ADMIN";
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STORAGE_TOKEN = "dayflow_token";
const STORAGE_USER = "dayflow_user";

// Backend URL — adjust if you deploy somewhere else
const API_URL = "http://localhost:5000";

/* ------------------------------------------------------------------ */
/*  Helpers (work outside React — used by route guards)                */
/* ------------------------------------------------------------------ */

export function getStoredAuth(): {
  token: string | null;
  user: AuthUser | null;
} {
  try {
    const token = localStorage.getItem(STORAGE_TOKEN);
    const raw = localStorage.getItem(STORAGE_USER);
    const user: AuthUser | null = raw ? JSON.parse(raw) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

export function clearStoredAuth() {
  localStorage.removeItem(STORAGE_TOKEN);
  localStorage.removeItem(STORAGE_USER);
}

/* ------------------------------------------------------------------ */
/*  React context + provider                                           */
/* ------------------------------------------------------------------ */

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_TOKEN);
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  /* ---- login ---------------------------------------------------- */
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        return {
          success: false,
          message: data.message || "Login failed",
        };
      }

      // Persist
      localStorage.setItem(STORAGE_TOKEN, data.token);
      localStorage.setItem(STORAGE_USER, JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      return { success: true, message: "Login successful" };
    } catch {
      return {
        success: false,
        message: "Could not connect to server. Is the backend running?",
      };
    }
  };

  /* ---- logout --------------------------------------------------- */
  const logout = () => {
    clearStoredAuth();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token && !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
