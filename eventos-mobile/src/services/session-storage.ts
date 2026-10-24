import * as SecureStore from "expo-secure-store";
import type { Session } from "@/types/event";
const KEY = "eventos.session";

export async function readSession(): Promise<Session | null> {
  const saved = await SecureStore.getItemAsync(KEY);
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
export function saveSession(session: Session) {
  return SecureStore.setItemAsync(KEY, JSON.stringify(session));
}
export function removeSession() {
  return SecureStore.deleteItemAsync(KEY);
}
