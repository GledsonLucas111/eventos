import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import EventCard from "./_components/event-card";


export default async function DashboardPage() {
  await requireAdmin();

  const events = await prisma.event.findMany({
    orderBy: [{ date: "asc" }, { time: "asc" }],
  });

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1>Seus eventos</h1>
        <Link
          href="/dashboard/new"
          className="rounded-lg bg-[#c6e998] px-4 py-3 text-[#17200e]"
        >
          + Novo evento
        </Link>
      </div>
      {events.length === 0 ? (
        <p className="py-12 text-center text-[#a6afa1]">
        Nenhum evento cadastrado. Clique em Novo evento para começar.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </>
  );
}
