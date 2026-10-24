"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { EventData, EventFormData } from "@/types/event";
import FormFields from "@/components/event-form-fields";
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
        <p role="alert" className="mb-4 text-sm text-red-700">
          {error}
        </p>
      )}
      <FormFields
        form={form}
        editing={!!event}
        busy={busy}
        onChange={setForm}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/dashboard")}
      />
    </>
  );
}
