import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/auth-context";
import { RegistrationProvider } from "@/context/registration-context";
import { useAuth } from "@/hooks/use-auth";

function AppContent() {
  const { user } = useAuth();
  return (
    <RegistrationProvider key={user?.id ?? "guest"}>
      <StatusBar style="dark" />
      <Slot />
    </RegistrationProvider>
  );
}
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
