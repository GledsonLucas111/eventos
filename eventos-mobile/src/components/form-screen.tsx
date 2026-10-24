import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ReactNode } from "react";
import { colors, common } from "@/styles/theme";
export function FormScreen({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <SafeAreaView style={common.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
          <View style={styles.form}>
            <Text style={styles.brand}>eventos.</Text>
            <Text style={common.title}>{title}</Text>
            <Text style={common.subtitle}>{subtitle}</Text>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 24 },
  form: { width: "100%", maxWidth: 440, alignSelf: "center", gap: 20 },
  brand: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 10,
  },
});
