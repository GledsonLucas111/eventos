import Link from "next/link";
import type { EventData } from "@/types/event";
import { formatDate } from "@/lib/format-date";
import EventImage from "@/components/event-image";
import DeleteEventButton from "./delete-event-button";

export default function EventCard({ event }: { event: EventData }) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="h-44">
        <EventImage src={event.image} />
      </div>
      <div className="p-5">
        <p className="text-xs text-blue-600">
          {formatDate(event.date)} às {event.time}
        </p>
        <h3>{event.title}</h3>
        <p className="break-words text-slate-500">{event.location}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-sm">
          <Link href={`/dashboard/${event.id}`} className="text-blue-600">
            Detalhes
          </Link>
          <Link href={`/dashboard/${event.id}/edit`}>Editar</Link>
          <DeleteEventButton id={event.id} title={event.title} />
        </div>
      </div>
    </article>
  );
}
