import { NextRequest, NextResponse } from "next/server";
import { prisma as db } from "@/lib/prisma";
import { auth, handle } from "@/lib/api";

export async function GET(req: NextRequest) {

  return handle(async () => {
    const user = await auth(req);
    
    return NextResponse.json(
      await db.registration.findMany({
        where: { userId: user.id },
        include: { event: true },
        orderBy: { createdAt: "desc" },
      }),
    );
  });
  
}
