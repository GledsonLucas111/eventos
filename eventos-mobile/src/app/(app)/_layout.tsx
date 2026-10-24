import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { Loading } from "@/components/feedback";
import { colors } from "@/styles/theme";
export default function AppLayout() {
  const { token, loading } = useAuth();
  if (loading) return <Loading />;
  if (!token) return <Redirect href="/login" />;
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="events/index" options={{ title: "Eventos" }} />
      <Stack.Screen
        name="events/[id]"
        options={{ title: "Detalhes do evento" }}
      />
      <Stack.Screen
        name="registrations"
        options={{ title: "Minhas inscrições" }}
      />
    </Stack>
  );
}
