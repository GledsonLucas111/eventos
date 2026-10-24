import { confirmAction } from "@/utils/confirm";
import { useCallback, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { useRegistrations } from "@/hooks/use-registrations";
import { EventCard } from "@/components/event-card";
import { Button } from "@/components/button";
import { Feedback, Loading } from "@/components/feedback";
import { common } from "@/styles/theme";
import type { Registration } from "@/types/event";

export default function Registrations() {
  const {
    registrations,
    loading,
    error,
    loadRegistrations,
    cancelRegistration,
  } = useRegistrations();
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [message, setMessage] = useState("");
  useFocusEffect(
    useCallback(() => {
      void loadRegistrations();
    }, [loadRegistrations]),
  );
  async function cancel(id: string) {
    setBusyId(id);
    setActionError("");
    setMessage("");
    try {
      await cancelRegistration(id);
      setMessage("Inscrição cancelada.");
    } catch (error) {
      setActionError((error as Error).message);
    } finally {
      setBusyId(null);
    }
  }
  async function confirmCancel(item: Registration) {
    if (await confirmAction("Cancelar inscrição?", item.event.title))
      await cancel(item.id);
  }

  if (loading && registrations.length === 0)
    return <Loading message="Carregando inscrições…" />;
  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={common.screen}>
      <FlatList
        data={registrations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={common.content}
        refreshing={loading}
        onRefresh={loadRegistrations}
        ItemSeparatorComponent={() => <View style={{ height: 22 }} />}
        ListHeaderComponent={
          <View style={{ gap: 14, marginBottom: 20 }}>
            <Text style={common.title}>Minhas inscrições</Text>
            <Text style={common.subtitle}>
              {registrations.length === 1 ? "1 inscrição" : `${registrations.length} inscrições`} na sua conta.
            </Text>
            <Feedback message={message} success />
            <Feedback
              message={error}
              onRetry={() => {
                void loadRegistrations();
              }}
            />
            <Feedback message={actionError} />
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ gap: 10 }}>
            <EventCard
              event={item.event}
              onPress={() =>
                router.push({
                  pathname: "/events/[id]",
                  params: { id: item.eventId },
                })
              }
            />
            <Button
              title="Cancelar inscrição"
              variant="danger"
              loading={busyId === item.id}
              disabled={!!busyId}
              onPress={() => confirmCancel(item)}
            />
          </View>
        )}
        ListEmptyComponent={
          !error ? (
            <View style={{ gap: 20, paddingVertical: 25 }}>
              <Text style={common.subtitle}>
                Você ainda não tem inscrições. Confira os eventos disponíveis
                para participar.
              </Text>
              <Button
                title="Ver eventos"
                onPress={() => router.replace("/events")}
              />
            </View>
          ) : undefined
        }
      />
    </SafeAreaView>
  );
}
