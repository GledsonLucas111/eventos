import { NextRequest, NextResponse } from "next/server";
import { auth, handle } from "@/lib/api";

export async function GET(req: NextRequest) {
  return handle(async () => {
    const u = await auth(req);
    return NextResponse.json({ id: u.id, name: u.name, role: u.role });
  });
}
