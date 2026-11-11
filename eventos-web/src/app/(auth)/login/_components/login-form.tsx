"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/actions/auth";

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

  return (
    <main className="login-screen grid min-h-screen place-items-center bg-[#090b0a] p-6">
      <section className="login-panel w-full max-w-md rounded-2xl border border-[#30382f] bg-[#141814] p-7 sm:p-10 [&_.brand]:mb-11 [&_form]:mt-8 [&_form_button]:w-full">
        <p className="mb-3 text-[10px] font-bold tracking-[0.15em] text-[#c6e998]">
          ÁREA DO ADMINISTRADOR
        </p>
        <h1>Bem-vindo de volta</h1>
        <p className="leading-relaxed text-[#a6afa1]">
          Entre para organizar seus próximos eventos.
        </p>
        <form onSubmit={handleSubmit}>
          <label>
            E-mail
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              placeholder="seu@email.com"
            />
          </label>
          <label>
            Senha
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Sua senha"
            />
          </label>
          {error && (
            <p
              className="mb-6 rounded-lg border px-4 py-3 text-sm leading-relaxed border-[#643a35] bg-[#2b1917] text-[#ffc0b9]"
              role="alert"
            >
              {error}
            </p>
          )}
          <button
            className="border-[#c6e998] bg-[#c6e998] whitespace-nowrap text-[#17200e] hover:bg-[#d8f4b4]"
            disabled={busy}
          >
            {busy ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
