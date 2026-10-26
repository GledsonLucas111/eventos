"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/actions/auth";
import LoginFields from "@/components/login-form-fields";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    setBusy(true);
    setError("");

    try {
      const result = await login(data);

      if (result.error) {
        setError(result.error);
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Não foi possível conectar. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }
  
  return <LoginFields busy={busy} error={error} onSubmit={handleSubmit} />;
}
