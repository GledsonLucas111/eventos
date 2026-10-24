"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { eventSchema } from "@/lib/validations";

export async function createEvent(formData: FormData) {
  await requireAdmin();
  const parsed = eventSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await prisma.event.create({ data: parsed.data });
  } catch (error) {
    console.error(error);
    return { error: "Não foi possível cadastrar o evento." };
  }
  revalidatePath("/dashboard", "layout");
  return { success: true };
}

export async function updateEvent(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = eventSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await prisma.event.update({ where: { id }, data: parsed.data });
  } catch (error) {
    console.error(error);
    return { error: "Não foi possível atualizar o evento." };
  }
  revalidatePath("/dashboard", "layout");
  return { success: true };
}

export async function deleteEvent(id: string) {
  await requireAdmin();
  try {
    await prisma.event.delete({ where: { id } });
  } catch (error) {
    console.error(error);
    return { error: "Não foi possível excluir o evento." };
  }
  revalidatePath("/dashboard", "layout");
  return { success: true };
}
