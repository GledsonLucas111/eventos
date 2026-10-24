import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import { Prisma } from "@/generated/prisma/client";
import { z } from "zod";
import { prisma as db } from "./prisma";
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
function key() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)
    throw new Error("Configure JWT_SECRET com ao menos 32 caracteres.");
  return new TextEncoder().encode(process.env.JWT_SECRET);
}
export async function token(id: string) {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(id)
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(key());
}
export async function auth(req: NextRequest, admin = false) {
  const value =
    req.headers.get("authorization")?.replace(/^Bearer /, "") ||
    req.cookies.get("session")?.value;
  if (!value) throw new HttpError(401, "Faça login para continuar.");
  let id: string | undefined;
  try {
    id = (await jwtVerify(value, key(), { algorithms: ["HS256"] })).payload.sub;
  } catch {
    throw new HttpError(401, "Sessão expirada. Faça login novamente.");
  }
  const user = id ? await db.user.findUnique({ where: { id } }) : null;
  if (!user) throw new HttpError(401, "Usuário não encontrado.");
  if (admin && user.role !== "ADMIN")
    throw new HttpError(403, "Apenas o administrador pode gerenciar eventos.");
  return user;
}
export async function handle(fn: () => Promise<Response>) {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof HttpError)
      return NextResponse.json({ error: e.message }, { status: e.status });
    if (e instanceof z.ZodError)
      return NextResponse.json(
        { error: e.issues.map((i) => i.message).join(" ") },
        { status: 400 },
      );
    if (e instanceof SyntaxError)
      return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002")
        return NextResponse.json(
          { error: "E-mail ou inscrição já cadastrado." },
          { status: 409 },
        );
      if (e.code === "P2025" || e.code === "P2003")
        return NextResponse.json(
          { error: "Registro não encontrado." },
          { status: 404 },
        );
    }
    console.error(e);
    return NextResponse.json(
      { error: "Não foi possível concluir. Verifique a conexão com o banco." },
      { status: 500 },
    );
  }
}
export { eventSchema } from "./validations";
