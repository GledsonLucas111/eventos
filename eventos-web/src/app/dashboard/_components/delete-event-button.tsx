"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteEvent } from "@/actions/events";

export default function DeleteEventButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function handleDelete() {
    if (
      !window.confirm(
        `Excluir "${title}" e suas inscrições? Essa ação não pode ser desfeita.`,
      )
    )
      return;
    setBusy(true);
    setError("");
    try {
      const result = await deleteEvent(id);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Não foi possível excluir. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <button
        type="button"
        disabled={busy}
        onClick={handleDelete}
        className="border-0 px-0 py-1 text-sm text-red-700"
      >
        {busy ? "Excluindo…" : "Excluir"}
      </button>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
