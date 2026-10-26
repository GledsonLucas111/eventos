import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { Loading } from "@/components/feedback";

export default function AuthLayout() {
  const { token, loading } = useAuth();

  if (loading) return <Loading />;
  if (token) return <Redirect href="/events" />;
  
  return <Stack screenOptions={{ headerShown: false }} />;
}
