import { confirmAction } from "@/utils/confirm";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { useRegistrations } from "@/hooks/use-registrations";
import { EventImage } from "@/components/event-image";
import { Button } from "@/components/button";
import { Feedback, Loading } from "@/components/feedback";
import { common } from "@/styles/theme";
import { formatDate } from "@/utils/format-date";
import type { Event } from "@/types/event";

export default function EventDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { request } = useAuth();
  const {
    registrations,
    loading: loadingRegistrations,
    error: registrationError,
    loadRegistrations,
    registerForEvent,
    cancelRegistration,
  } = useRegistrations();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const registration = registrations.find((item) => item.eventId === id);
  const loadEvent = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setEvent(await request<Event>(`/events/${encodeURIComponent(id)}`));
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [id, request]);
  useEffect(() => {
    void loadEvent();
  }, [loadEvent]);
  async function subscribe() {
    if (!event) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await registerForEvent(event);
      setMessage("Inscrição realizada com sucesso!");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function cancel() {
    if (!registration) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await cancelRegistration(registration.id);
      setMessage("Inscrição cancelada.");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function confirmCancel() {
    if (
      await confirmAction(
        "Cancelar inscrição?",
        "Você poderá se inscrever novamente se desejar.",
      )
    )
      await cancel();
  }

  if (loading) return <Loading message="Carregando evento…" />;
  if (!event)
    return (
      <View style={common.content}>
        <Feedback
          message={error || "Evento não encontrado."}
          onRetry={() => {
            void loadEvent();
          }}
        />
      </View>
    );
  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={common.screen}>
      <ScrollView contentContainerStyle={common.content}>
        <View style={{ borderRadius: 14, overflow: "hidden" }}>
          <EventImage uri={event.image} large />
        </View>
        <Text style={common.title}>{event.title}</Text>
        <View style={common.card}>
          <Text style={common.label}>DATA E HORÁRIO</Text>
          <Text style={common.subtitle}>
            {formatDate(event.date)} às {event.time}
          </Text>
          <Text style={common.label}>LOCAL</Text>
          <Text style={common.subtitle}>{event.location}</Text>
        </View>
        <Text style={{ ...common.title, fontSize: 20 }}>Sobre o evento</Text>
        <Text style={common.subtitle}>{event.description}</Text>
        <Feedback message={message} success />
        <Feedback message={error} />
        <Feedback
          message={registrationError}
          onRetry={() => {
            void loadRegistrations();
          }}
        />
        {registration && (
          <Text style={common.label}>Você está inscrito neste evento.</Text>
        )}
        <Button
          title={
            loadingRegistrations
              ? "Carregando inscrições…"
              : registration
                ? "Cancelar inscrição"
                : "Inscrever-me"
          }
          variant={registration ? "danger" : "primary"}
          loading={busy}
          disabled={loadingRegistrations || !!registrationError}
          onPress={
            registration
              ? confirmCancel
              : () => {
                  void subscribe();
                }
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}
