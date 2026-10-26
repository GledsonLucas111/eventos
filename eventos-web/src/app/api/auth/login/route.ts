import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { compare } from "bcryptjs";
import { prisma as db } from "@/lib/prisma";
import { handle, HttpError, token } from "@/lib/api";

export async function POST(req: NextRequest) {
  return handle(async () => {
    const data = z
      .object({
        email: z
          .string()
          .trim()
          .email()
          .transform((s) => s.toLowerCase()),
        password: z.string().min(1).max(72),
      })
      .parse(await req.json());

    const user = await db.user.findUnique({ where: { email: data.email } });

    if (!user || !(await compare(data.password, user.password)))
      throw new HttpError(401, "E-mail ou senha incorretos.");

    const accessToken = await token(user.id);

    const response = NextResponse.json({
      token: accessToken,
      user: { id: user.id, name: user.name, role: user.role },
    });

    response.cookies.set("session", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 86400,
    });
    
    return response;
  });
}
