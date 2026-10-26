import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { logout } from "@/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {

  const user = await requireAdmin();
  
  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 p-5">
          <Link href="/dashboard" className="text-xl font-bold text-blue-600">
            eventos.
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">{user.name}</span>
            <form action={logout}>
              <button>Sair</button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </>
  );
}
