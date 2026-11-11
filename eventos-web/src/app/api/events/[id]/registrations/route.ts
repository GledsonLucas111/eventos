import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, handle, HttpError } from "@/lib/api";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  return handle(async () => {
    const user = await auth(req);

    const eventId = (await ctx.params).id;

    if (!(await prisma.event.findUnique({ where: { id: eventId } })))
      throw new HttpError(404, "Evento não encontrado.");

    return NextResponse.json(
      await prisma.registration.create({ data: { userId: user.id, eventId } }),
      { status: 201 },
    );
  });
}
