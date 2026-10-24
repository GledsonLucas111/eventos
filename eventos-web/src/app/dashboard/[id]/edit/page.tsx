import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import EventForm from "../../_components/event-form";

type Props = { params: Promise<{ id: string }> };
export default async function EditEventPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();
  return <EventForm event={event} />;
}
