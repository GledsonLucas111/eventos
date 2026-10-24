import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { prisma as db } from "@/lib/prisma";
import { handle } from "@/lib/api";

export async function POST(req: NextRequest) {
  return handle(async () => {
    const data = z
      .object({
        name: z.string().trim().min(2).max(100),
        email: z
          .string()
          .trim()
          .email()
          .max(254)
          .transform((s) => s.toLowerCase()),
        password: z
          .string()
          .min(8, "Senha deve ter ao menos 8 caracteres.")
          .max(72),
      })
      .parse(await req.json());
    const user = await db.user.create({
      data: { ...data, password: await hash(data.password, 10) },
      select: { id: true, name: true, email: true },
    });
    return NextResponse.json(user, { status: 201 });
  });
}
