import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Event } from "@/types/event";
import { colors } from "@/styles/theme";
import { formatDate } from "@/utils/format-date";
import { EventImage } from "./event-image";

export function EventCard({
  event,
  onPress,
}: {
  event: Event;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${event.title}`}
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.card}
    >
      <EventImage uri={event.image} />
      <View style={styles.body}>
        <Text style={styles.date}>
          {formatDate(event.date)} às {event.time}
        </Text>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.location}>{event.location}</Text>
        <Text numberOfLines={2} style={styles.description}>
          {event.description}
        </Text>
        <Text style={styles.link}>Ver detalhes →</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    overflow: "hidden",
  },
  body: { padding: 16, gap: 9 },
  date: { color: colors.primary, fontSize: 12, fontWeight: "600" },
  title: { color: colors.text, fontSize: 19, fontWeight: "700" },
  location: { color: colors.muted, fontSize: 14 },
  description: { color: colors.muted, lineHeight: 21 },
  link: { color: colors.primary, fontWeight: "600", marginTop: 4 },
});
