import { NextRequest, NextResponse } from "next/server";
import { prisma as db } from "@/lib/prisma";
import { auth, eventSchema, handle } from "@/lib/api";
export const dynamic = "force-dynamic";

export async function GET() {
  return handle(async () =>
    NextResponse.json(
      await db.event.findMany({ orderBy: [{ date: "asc" }, { time: "asc" }] }),
    ),
  );
}

export async function POST(req: NextRequest) {
  return handle(async () => {
    await auth(req, true);

    const data = eventSchema.parse(await req.json());
    
    return NextResponse.json(await db.event.create({ data }), { status: 201 });
  });
}
