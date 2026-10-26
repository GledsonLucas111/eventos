import { useState } from "react";
import { Link, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { FormScreen } from "@/components/form-screen";
import { Feedback } from "@/components/feedback";
import { colors } from "@/styles/theme";

export default function Login() {
  const { signIn } = useAuth();
  const { registered } = useLocalSearchParams<{ registered?: string }>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError("Informe e-mail e senha.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await signIn(email, password);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  
  return (
    <FormScreen
      title="Bem-vindo de volta"
      subtitle="Entre para descobrir eventos e acompanhar suas inscrições."
    >
      {registered === "1" && (
        <Feedback success message="Conta criada! Faça login para continuar." />
      )}
      <Input
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        editable={!busy}
        placeholder="seu@email.com"
      />
      <Input
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="current-password"
        editable={!busy}
        onSubmitEditing={handleLogin}
      />
      <Feedback message={error} />
      <Button title="Entrar" loading={busy} onPress={handleLogin} />
      <Link
        href="/register"
        style={{ color: colors.primary, textAlign: "center", padding: 10 }}
      >
        Não tem conta? Cadastre-se
      </Link>
    </FormScreen>
  );
}
