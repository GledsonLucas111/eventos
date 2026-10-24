import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/hooks/use-auth";
import type { Event, Registration } from "@/types/event";
import { ApiError } from "@/services/api";

type RegistrationContextProps = {
  registrations: Registration[];
  loading: boolean;
  error: string;
  loadRegistrations: () => Promise<void>;
  registerForEvent: (event: Event) => Promise<void>;
  cancelRegistration: (id: string) => Promise<void>;
};
export const RegistrationContext = createContext<
  RegistrationContextProps | undefined
>(undefined);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const { token, request } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadRegistrations = useCallback(async () => {
    if (!token) {
      setRegistrations([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      setRegistrations(await request<Registration[]>("/registrations"));
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [token, request]);
  useEffect(() => {
    void loadRegistrations();
  }, [loadRegistrations]);

  async function registerForEvent(event: Event) {
    if (registrations.some((item) => item.eventId === event.id))
      throw new Error("Você já está inscrito neste evento.");
    try {
      const registration = await request<Omit<Registration, "event">>(
        `/events/${encodeURIComponent(event.id)}/registrations`,
        { method: "POST" },
      );
      setRegistrations((current) =>
        current.some((item) => item.id === registration.id)
          ? current
          : [{ ...registration, event }, ...current],
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 409)
        await loadRegistrations();
      throw error;
    }
  }
  async function cancelRegistration(id: string) {
    await request(`/registrations/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setRegistrations((current) => current.filter((item) => item.id !== id));
  }
  return (
    <RegistrationContext.Provider
      value={{
        registrations,
        loading,
        error,
        loadRegistrations,
        registerForEvent,
        cancelRegistration,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}
