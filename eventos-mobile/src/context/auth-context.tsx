import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { api, ApiError } from "@/services/api";
import {
  readSession,
  saveSession,
  removeSession,
} from "@/services/session-storage";
import type { Session, User } from "@/types/event";

type AuthContextProps = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  request: <T>(path: string, options?: RequestInit) => Promise<T>;
};

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const sessionRef = useRef<Session | null>(null);
  const applySession = useCallback((value: Session | null) => {
    sessionRef.current = value;
    setSession(value);
  }, []);

  useEffect(() => {
    let active = true;

    async function restore() {
      try {
        const saved = await readSession();
        if (!saved) return;
        try {
          const user = await api<User>("/auth/me", { token: saved.token });
          if (active) applySession({ token: saved.token, user });
        } catch (error) {
          if (error instanceof ApiError && error.status === 401)
            await removeSession();
          else if (active) applySession(saved);
        }
      } catch {

      } finally {
        if (active) setLoading(false);
      }
    }

    void restore();
    return () => {
      active = false;
    };
  }, [applySession]);

  const signOut = useCallback(async () => {
    await removeSession();
    applySession(null);
  }, [applySession]);

  async function signIn(email: string, password: string) {
    const result = await api<Session>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    await saveSession(result);
    applySession(result);
  }
  async function signUp(name: string, email: string, password: string) {
    await api("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      }),
    });
  }
  const request = useCallback(
    async <T,>(path: string, options?: RequestInit): Promise<T> => {
      const token = sessionRef.current?.token;

      if (!token) throw new Error("Faça login para continuar.");
      
      try {
        return await api<T>(path, { ...options, token });
      } catch (error) {
        if (
          error instanceof ApiError &&
          error.status === 401 &&
          sessionRef.current?.token === token
        ) {
          await signOut();
          throw new Error("Sessão expirada. Faça login novamente.");
        }
        throw error;
      }
    },
    [signOut],
  );

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        token: session?.token ?? null,
        loading,
        signIn,
        signUp,
        signOut,
        request,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
