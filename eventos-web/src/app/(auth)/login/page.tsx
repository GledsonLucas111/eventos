import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import LoginForm from "./_components/login-form";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user?.role === "ADMIN") redirect("/dashboard");
  return <LoginForm />;
}
