import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "@/styles/theme";
import { Button } from "./button";

export function Loading({ message = "Carregando…" }: { message?: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.muted}>{message}</Text>
    </View>
  );
}

export function Feedback({
  message,
  success = false,
  onRetry,
}: {
  message: string;
  success?: boolean;
  onRetry?: () => void;
}) {
  if (!message) return null;
  return (
    <View
      accessibilityRole="alert"
      style={[styles.feedback, success && { backgroundColor: "#edf8f0" }]}
    >
      <Text
        style={{
          color: success ? colors.success : colors.danger,
          lineHeight: 21,
        }}
      >
        {message}
      </Text>
      {onRetry && (
        <Button title="Tentar novamente" variant="outline" onPress={onRetry} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 14,
    backgroundColor: colors.background,
  },
  muted: { color: colors.muted },
  feedback: {
    padding: 14,
    backgroundColor: "#fff0f0",
    borderRadius: 9,
    gap: 12,
  },
});
