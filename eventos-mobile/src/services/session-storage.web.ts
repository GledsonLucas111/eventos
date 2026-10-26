import type { Session } from "@/types/event";
const KEY = "eventos.session";

export async function readSession(): Promise<Session | null> {
  if (typeof window === "undefined") return null;

  const saved = window.sessionStorage.getItem(KEY);

  if (!saved) return null;
  
  try {
    const data = JSON.parse(saved);
    if (
      typeof data?.token !== "string" ||
      typeof data?.user?.id !== "string" ||
      typeof data?.user?.name !== "string"
    )
      return null;
    return data as Session;
  } catch {
    return null;
  }
}
export async function saveSession(session: Session) {
  window.sessionStorage.setItem(KEY, JSON.stringify(session));
}
export async function removeSession() {
  window.sessionStorage.removeItem(KEY);
}
