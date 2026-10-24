import { NextRequest, NextResponse } from "next/server";
import { prisma as db } from "@/lib/prisma";
import { auth, handle, HttpError } from "@/lib/api";
export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  return handle(async () => {
    const user = await auth(req);
    const result = await db.registration.deleteMany({
      where: { id: (await ctx.params).id, userId: user.id },
    });
    if (!result.count) throw new HttpError(404, "Inscrição não encontrada.");
    return new NextResponse(null, { status: 204 });
  });
}
