"use client";
import type { FormEvent } from "react";
type Props = {
  busy: boolean;
  error: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};
export default function LoginForm({ busy, error, onSubmit }: Props) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 p-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 sm:p-10 [&_.brand]:mb-11 [&_form]:mt-8 [&_form_button]:w-full">
        <div className="brand flex items-center text-2xl font-extrabold tracking-tight">
          <span className="mr-2.5 grid h-9 w-8 place-items-center rounded-lg bg-blue-600 text-xl font-bold text-white">
            E
          </span>{" "}
          eventos<span className="text-blue-600">.</span>
        </div>
        <p className="mb-3 text-[10px] font-bold tracking-[0.15em] text-blue-600">
          ÁREA DO ADMINISTRADOR
        </p>
        <h1>Bem-vindo de volta</h1>
        <p className="leading-relaxed text-slate-500">
          Entre para organizar seus próximos eventos.
        </p>
        <form onSubmit={onSubmit}>
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
              className="mb-6 rounded-lg border px-4 py-3 text-sm leading-relaxed border-red-200 bg-red-50 text-red-800"
              role="alert"
            >
              {error}
            </p>
          )}
          <button
            className="border-blue-600 bg-blue-600 whitespace-nowrap text-white hover:bg-blue-700"
            disabled={busy}
          >
            {busy ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
