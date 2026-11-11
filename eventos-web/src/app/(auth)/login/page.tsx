import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import LoginForm from "./_components/login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={<p>Verificando sessão...</p>}>
      <LoginContent />
    </Suspense>
  );
}

async function LoginContent() {
  const user = await getCurrentUser();

  if (user?.role === "ADMIN") {
    redirect("/dashboard");
  }

  return <LoginForm />;
}