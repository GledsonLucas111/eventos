import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { formatDate } from "@/lib/format-date";
import EventImage from "@/components/event-image";
import DeleteEventButton from "../_components/delete-event-button";

type Props = { params: Promise<{ id: string }> };

export default async function EventDetailsPage({ params }: Props) {
  await requireAdmin();

  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) notFound();
  
  return (
    <>
      <Link
        href="/dashboard"
        className="mb-6 inline-block text-sm text-slate-500"
      >
        ← Voltar
      </Link>
      <section className="max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="h-64">
          <EventImage src={event.image} />
        </div>
        <div className="p-6">
          <h1>{event.title}</h1>
          <p className="text-blue-600">
            {formatDate(event.date)} às {event.time}
          </p>
          <p className="mt-2 break-words text-slate-500">{event.location}</p>
          <h2 className="mt-6">Sobre o evento</h2>
          <p className="mt-3 break-words whitespace-pre-wrap leading-relaxed">
            {event.description}
          </p>
          <div className="mt-6 flex items-center gap-4 border-t border-slate-100 pt-4">
            <Link href={`/dashboard/${id}/edit`} className="text-blue-600">
              Editar evento
            </Link>
            <DeleteEventButton id={id} title={event.title} />
          </div>
        </div>
      </section>
    </>
  );
}
