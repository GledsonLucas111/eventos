"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { EventData, EventFormData } from "@/types/event";
import { createEvent, updateEvent } from "@/actions/events";

const empty: EventFormData = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  image: "",
};

export default function EventForm({ event }: { event?: EventData }) {
  const router = useRouter();
  const [form, setForm] = useState<EventFormData>(
    event
      ? {
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          location: event.location,
          image: event.image,
        }
      : empty,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.set(key, value));
    setBusy(true);
    setError("");
    try {
      const result = event
        ? await updateEvent(event.id, data)
        : await createEvent(data);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Não foi possível salvar. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }
  
  return (
    <>
      {error && (
        <p role="alert" className="mb-4 text-sm text-[#f4a7a0]">
          {error}
        </p>
      )}
      <>
      <button
        className="mb-7 border-0 bg-transparent p-0 text-sm text-[#a6afa1]"
        onClick={() => router.push("/dashboard")}
      >
        ← Voltar para eventos
      </button>
      <div className="mb-8 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="mb-3 text-[10px] font-bold tracking-[0.15em] text-[#c6e998]">
            GERENCIAMENTO
          </p>
          <h1>{!!event ? "Editar evento" : "Novo evento"}</h1>
          <p className="leading-relaxed text-[#a6afa1]">
            Preencha os dados abaixo. Todos os campos são obrigatórios.
          </p>
        </div>
      </div>
      <form
        className="max-w-3xl rounded-xl border border-[#30382f] bg-[#141814] p-6 sm:p-8"
        onSubmit={handleSubmit}
      >
        <label>
          Título
          <input
            required
            minLength={3}
            maxLength={120}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Ex.: Encontro de tecnologia"
          />
        </label>
        <label>
          Descrição
          <textarea
            required
            minLength={5}
            maxLength={5000}
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Conte o que vai acontecer no evento"
          />
        </label>
        <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
          <label>
            Data
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </label>
          <label>
            Horário
            <input
              type="time"
              required
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
          </label>
        </div>
        <label>
          Local
          <input
            required
            minLength={3}
            maxLength={200}
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Nome do espaço e endereço"
          />
        </label>
        <label>
          URL da imagem
          <input
            type="url"
            required
            maxLength={2000}
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="https://exemplo.com/imagem.jpg"
          />
          <small>Use o endereço público de uma imagem (HTTP ou HTTPS).</small>
        </label>
        <div className="mt-6 flex justify-end gap-2.5 border-t border-[#2b3229] pt-5">
          <button type="button" onClick={() => router.push("/dashboard")} disabled={busy}>
            Cancelar
          </button>
          <button
            className="border-[#c6e998] bg-[#c6e998] whitespace-nowrap text-[#17200e] hover:bg-[#d8f4b4]"
            disabled={busy}
          >
            {busy ? "Salvando…" : "Salvar evento"}
          </button>
        </div>
      </form>
    </>
    </>
  );
}
