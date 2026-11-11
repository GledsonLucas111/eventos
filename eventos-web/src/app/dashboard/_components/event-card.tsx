import Link from "next/link";
import type { EventData } from "@/types/event";
import { formatDate } from "@/lib/format-date";
import DeleteEventButton from "./delete-event-button";
import Image from "next/image";

export default function EventCard({ event }: { event: EventData }) {
  return (
    <article className="event-card overflow-hidden rounded-xl border border-[#30382f] bg-[#141814]">
      <div className="h-44">
        <img
          className="h-full w-full object-cover"
          src={event.image}
          alt={event.title}
        />
      </div>
      <div className="p-5">
        <p className="text-xs text-[#c6e998]">
          {formatDate(event.date)} às {event.time}
        </p>
        <h3>{event.title}</h3>
        <p className="break-words text-[#a6afa1]">{event.location}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-[#2b3229] pt-4 text-sm">
          <Link href={`/dashboard/${event.id}`} className="text-[#c6e998]">
            Detalhes
          </Link>
          <Link href={`/dashboard/${event.id}/edit`}>Editar</Link>
          <DeleteEventButton id={event.id} title={event.title} />
        </div>
      </div>
    </article>
  );
}
