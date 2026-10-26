"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteEvent } from "@/actions/events";

type Props = {
  id: string;
  title: string;
};

export default function DeleteEventButton({ id, title }: Props) {
  const router = useRouter();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogId = useId();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function openDialog() {
    setError("");
    dialogRef.current?.showModal();
  }

  async function handleDelete() {
    if (busy) return;

    setBusy(true);
    setError("");

    try {
      const result = await deleteEvent(id);

      if (result.error) {
        setError(result.error);
        return;
      }

      dialogRef.current?.close();

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Não foi possível excluir. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        disabled={busy}
        onClick={openDialog}
        className="border-0 px-0 py-1 text-sm text-red-700"
      >
        Excluir
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${dialogId}-title`}
        aria-describedby={`${dialogId}-description`}
        aria-busy={busy}
        onCancel={(event) => {
          if (busy) event.preventDefault();
        }}
        className="fixed inset-0 m-auto w-[90vw] max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-slate-800 shadow-xl backdrop:bg-slate-900/50"
      >
        <h2
          id={`${dialogId}-title`}
          className="text-xl font-bold"
        >
          Excluir evento?
        </h2>

        <p
          id={`${dialogId}-description`}
          className="mt-3 break-words text-sm leading-relaxed text-slate-500"
        >
          O evento <strong>{title}</strong> e suas inscrições
          serão excluídos. Essa ação não pode ser desfeita.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
          <button
            type="button"
            autoFocus
            disabled={busy}
            onClick={() => dialogRef.current?.close()}
            className="border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={handleDelete}
            className="border-red-700 bg-red-700 text-white hover:bg-red-800"
          >
            {busy ? "Excluindo…" : "Sim, excluir"}
          </button>
        </div>
      </dialog>
    </>
  );
}