"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div role="alert">
      <h2>Não foi possível carregar os eventos.</h2>
      <p className="my-4 text-slate-500">
        Verifique a conexão com o banco e tente novamente.
      </p>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  );
}
