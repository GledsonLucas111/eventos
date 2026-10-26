import "dotenv/config";
import { hash } from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@eventos.com").toLowerCase();

  const password = process.env.ADMIN_PASSWORD;

  if (!password || password.length < 8)
    throw new Error("Configure ADMIN_PASSWORD com ao menos 8 caracteres.");

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Administrador",
      email,
      password: await hash(password, 10),
      role: "ADMIN",
    },
  });

  console.log("Administrador pronto: " + email);
  
}
main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
