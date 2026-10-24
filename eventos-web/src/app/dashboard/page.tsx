import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import EventCard from "./_components/event-card";

type Props = { searchParams: Promise<{ q?: string }> };
export default async function DashboardPage({ searchParams }: Props) {
  await requireAdmin();
  const { q = "" } = await searchParams;

  const events = await prisma.event.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: [{ date: "asc" }, { time: "asc" }],
  });

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1>Seus eventos</h1>
        <Link
          href="/dashboard/new"
          className="rounded-lg bg-blue-600 px-4 py-3 text-white"
        >
          + Novo evento
        </Link>
      </div>
      <form action="/dashboard" method="get" className="mb-6 flex gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por título ou local"
          aria-label="Buscar eventos"
          className="max-w-md"
        />
        <button>Buscar</button>
      </form>
      {events.length === 0 ? (
        <p className="py-12 text-center text-slate-500">
          {q
            ? "Nenhum evento encontrado."
            : "Nenhum evento cadastrado. Clique em Novo evento para começar."}
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
