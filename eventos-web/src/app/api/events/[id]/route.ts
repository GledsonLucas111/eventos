import { NextRequest, NextResponse } from "next/server";
import { prisma as db } from "@/lib/prisma";
import { auth, eventSchema, handle, HttpError } from "@/lib/api";
type Context = { params: Promise<{ id: string }> };
export async function GET(req: NextRequest, ctx: Context) {
  return handle(async () => {
    const event = await db.event.findUnique({
      where: { id: (await ctx.params).id },
    });
    if (!event) throw new HttpError(404, "Evento não encontrado.");
    return NextResponse.json(event);
  });
}
export async function PUT(req: NextRequest, ctx: Context) {
  return handle(async () => {
    await auth(req, true);
    const data = eventSchema.parse(await req.json());
    return NextResponse.json(
      await db.event.update({ where: { id: (await ctx.params).id }, data }),
    );
  });
}
export async function DELETE(req: NextRequest, ctx: Context) {
  return handle(async () => {
    await auth(req, true);
    await db.event.delete({ where: { id: (await ctx.params).id } });
    return new NextResponse(null, { status: 204 });
  });
}
