import { requireAdmin } from "@/lib/session";
import EventForm from "../_components/event-form";

export default async function NewEventPage() {
  await requireAdmin();
  return <EventForm />;
}
