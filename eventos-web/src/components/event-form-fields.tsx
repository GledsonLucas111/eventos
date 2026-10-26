"use client";
import type { FormEvent } from "react";
import type { EventFormData } from "@/types/event";

type Props = {
  form: EventFormData;
  editing: boolean;
  busy: boolean;
  onChange: (data: EventFormData) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export default function EventForm({
  form,
  editing,
  busy,
  onChange,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <>
      <button
        className="mb-7 border-0 bg-transparent p-0 text-sm text-slate-500"
        onClick={onCancel}
      >
        ← Voltar para eventos
      </button>
      <div className="mb-8 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="mb-3 text-[10px] font-bold tracking-[0.15em] text-blue-600">
            GERENCIAMENTO
          </p>
          <h1>{editing ? "Editar evento" : "Novo evento"}</h1>
          <p className="leading-relaxed text-slate-500">
            Preencha os dados abaixo. Todos os campos são obrigatórios.
          </p>
        </div>
      </div>
      <form
        className="max-w-3xl rounded-xl border border-slate-200 bg-white p-6 sm:p-8"
        onSubmit={onSubmit}
      >
        <label>
          Título
          <input
            required
            minLength={3}
            maxLength={120}
            value={form.title}
            onChange={(e) => onChange({ ...form, title: e.target.value })}
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
            onChange={(e) => onChange({ ...form, description: e.target.value })}
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
              onChange={(e) => onChange({ ...form, date: e.target.value })}
            />
          </label>
          <label>
            Horário
            <input
              type="time"
              required
              value={form.time}
              onChange={(e) => onChange({ ...form, time: e.target.value })}
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
            onChange={(e) => onChange({ ...form, location: e.target.value })}
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
            onChange={(e) => onChange({ ...form, image: e.target.value })}
            placeholder="https://exemplo.com/imagem.jpg"
          />
          <small>Use o endereço público de uma imagem (HTTP ou HTTPS).</small>
        </label>
        <div className="mt-6 flex justify-end gap-2.5 border-t border-slate-100 pt-5">
          <button type="button" onClick={onCancel} disabled={busy}>
            Cancelar
          </button>
          <button
            className="border-blue-600 bg-blue-600 whitespace-nowrap text-white hover:bg-blue-700"
            disabled={busy}
          >
            {busy ? "Salvando…" : "Salvar evento"}
          </button>
        </div>
      </form>
    </>
  );
}
