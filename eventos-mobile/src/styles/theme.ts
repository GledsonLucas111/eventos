import { StyleSheet } from "react-native";
export const colors = {
  background: "#f5f7fb",
  card: "#ffffff",
  primary: "#2563eb",
  text: "#1e293b",
  muted: "#64748b",
  border: "#dce3ec",
  danger: "#b91c1c",
  success: "#166534",
};
export const common = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 36, gap: 16 },
  title: { fontSize: 26, fontWeight: "700", color: colors.text },
  subtitle: { fontSize: 15, lineHeight: 23, color: colors.muted },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    gap: 12,
  },
  label: { fontSize: 13, fontWeight: "700", color: colors.muted },
});
