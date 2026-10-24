import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { colors } from "@/styles/theme";
type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "outline" | "danger";
};
export function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
}: Props) {
  const outline = variant === "outline";
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      activeOpacity={0.75}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: outline
            ? colors.card
            : variant === "danger"
              ? colors.danger
              : colors.primary,
        },
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={outline ? colors.primary : "#fff"} />
      ) : (
        <Text style={[styles.text, outline && { color: colors.primary }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  text: { color: "#fff", fontSize: 15, fontWeight: "700", textAlign: "center" },
  disabled: { opacity: 0.55 },
});
