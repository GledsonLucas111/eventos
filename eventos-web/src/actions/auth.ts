"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { token } from "@/lib/api";

export async function login(data: FormData) {
  const parsed = z
    .object({
      email: z
        .string()
        .trim()
        .email()
        .transform((s) => s.toLowerCase()),
      password: z.string().min(1).max(72),
    })
    .safeParse(Object.fromEntries(data));
  if (!parsed.success)
    return { error: "Informe um e-mail e uma senha válidos." };
  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });
    if (!user || !(await compare(parsed.data.password, user.password)))
      return { error: "E-mail ou senha incorretos." };
    if (user.role !== "ADMIN")
      return { error: "Esta área é exclusiva do administrador." };
    (await cookies()).set("session", await token(user.id), {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 86400,
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      error: "Não foi possível entrar. Verifique a conexão com o banco.",
    };
  }
}

export async function logout() {
  (await cookies()).delete("session");
  redirect("/login");
}
