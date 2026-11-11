import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { formatDate } from "@/lib/format-date";
import DeleteEventButton from "../_components/delete-event-button";
import Image from "next/image";

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
        className="mb-6 inline-block text-sm text-[#a6afa1]"
      >
        ← Voltar
      </Link>
      <section className="max-w-4xl overflow-hidden rounded-xl border border-[#30382f] bg-[#141814]">
        <div className="h-64">
          <img
            className="h-full w-full object-cover"
            src={event.image}
            alt={event.title}
          />
        </div>
        <div className="p-6">
          <h1>{event.title}</h1>
          <p className="text-[#c6e998]">
            {formatDate(event.date)} às {event.time}
          </p>
          <p className="mt-2 break-words text-[#a6afa1]">{event.location}</p>
          <h2 className="mt-6">Sobre o evento</h2>
          <p className="mt-3 break-words whitespace-pre-wrap leading-relaxed">
            {event.description}
          </p>
          <div className="mt-6 flex items-center gap-4 border-t border-[#2b3229] pt-4">
            <Link href={`/dashboard/${id}/edit`} className="text-[#c6e998]">
              Editar evento
            </Link>
            <DeleteEventButton id={id} title={event.title} />
          </div>
        </div>
      </section>
    </>
  );
}
