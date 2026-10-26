import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { FormScreen } from "@/components/form-screen";
import { Feedback } from "@/components/feedback";
import { colors } from "@/styles/theme";

export default function Register() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleRegister() {
    if (name.trim().length < 2) {
      setError("Informe um nome com pelo menos 2 caracteres.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Informe um e-mail válido.");
      return;
    }
    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmation) {
      setError("As senhas não conferem.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await signUp(name, email, password);
      router.replace({ pathname: "/login", params: { registered: "1" } });
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  
  return (
    <FormScreen
      title="Crie sua conta"
      subtitle="Cadastre-se para participar dos eventos."
    >
      <Input
        label="Nome"
        value={name}
        onChangeText={setName}
        maxLength={100}
        autoComplete="name"
        editable={!busy}
      />
      <Input
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={254}
        autoComplete="email"
        editable={!busy}
      />
      <Input
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        maxLength={72}
        autoComplete="new-password"
        editable={!busy}
        placeholder="Pelo menos 8 caracteres"
      />
      <Input
        label="Confirmar senha"
        value={confirmation}
        onChangeText={setConfirmation}
        secureTextEntry
        maxLength={72}
        editable={!busy}
      />
      <Feedback message={error} />
      <Button title="Cadastrar" loading={busy} onPress={handleRegister} />
      <Link
        href="/login"
        style={{ color: colors.primary, textAlign: "center", padding: 10 }}
      >
        Já tenho conta
      </Link>
    </FormScreen>
  );
}
