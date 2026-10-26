import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const value = (await cookies()).get("session")?.value;

  if (!value) return null;

  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32)
    throw new Error("Configure JWT_SECRET com ao menos 32 caracteres.");

  let id: string | undefined;

  try {
    id = (
      await jwtVerify(value, new TextEncoder().encode(secret), {
        algorithms: ["HS256"],
      })
    ).payload.sub;

  } catch {
    return null;
  }

  if (!id) return null;

  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true },
  });
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== "ADMIN") redirect("/login");
  return user;
}
