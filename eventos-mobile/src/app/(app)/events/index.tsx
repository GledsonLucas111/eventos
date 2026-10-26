import { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { useRegistrations } from "@/hooks/use-registrations";
import { EventCard } from "@/components/event-card";
import { Button } from "@/components/button";
import { Feedback, Loading } from "@/components/feedback";
import { colors, common } from "@/styles/theme";
import type { Event } from "@/types/event";

export default function Events() {
  const { user, request, signOut } = useAuth();
  const { registrations } = useRegistrations();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leaving, setLeaving] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setEvents(await request<Event[]>("/events"));
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [request]);

  useFocusEffect(
    useCallback(() => {
      void loadEvents();
    }, [loadEvents]),
  );

  async function handleLogout() {
    setLeaving(true);
    try {
      await signOut();
    } catch {
      setError("Não foi possível encerrar a sessão. Tente novamente.");
    } finally {
      setLeaving(false);
    }
  }

  if (loading && events.length === 0)
    return <Loading message="Carregando eventos…" />;

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={common.screen}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={common.content}
        refreshing={loading}
        onRefresh={loadEvents}
        ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={common.row}>
              <Text style={styles.greeting}>Olá, {user?.name}!</Text>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={handleLogout}
                disabled={leaving}
              >
                <Text style={styles.logout}>
                  {leaving ? "Saindo…" : "Sair"}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={common.title}>Encontre seu próximo evento</Text>
            <Text style={common.subtitle}>
              Confira os detalhes e garanta sua inscrição.
            </Text>
            <Button
              title={`Minhas inscrições (${registrations.length})`}
              variant="outline"
              onPress={() => router.push("/registrations")}
            />
            <Feedback
              message={error}
              onRetry={() => {
                void loadEvents();
              }}
            />
          </View>
        }
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() =>
              router.push({ pathname: "/events/[id]", params: { id: item.id } })
            }
          />
        )}
        ListEmptyComponent={
          !error ? (
            <Text style={styles.empty}>
              Nenhum evento disponível no momento. Cadastre um evento pelo
              painel web para vê-lo aqui.
            </Text>
          ) : undefined
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { gap: 16, marginBottom: 22 },
  greeting: { color: colors.muted, fontSize: 15, flex: 1 },
  logout: { color: colors.primary, fontWeight: "600", padding: 10 },
  empty: {
    color: colors.muted,
    lineHeight: 24,
    textAlign: "center",
    paddingVertical: 35,
  },
});
