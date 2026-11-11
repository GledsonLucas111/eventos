import type { ReactNode } from "react";
import { logout } from "@/actions/auth";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/session";

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <Suspense
      fallback={
        <div className="dashboard-shell">
          <p className="text-sm text-[#c6e998]">
            Verificando sessão…
          </p>
        </div>
      }
    >
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </Suspense>
  );
}

async function AuthenticatedLayout({ children }: Props) {
  const user = await requireAdmin();

  return (
        <>
      <header className="bg-[#090b0a]">
        <div className="mx-auto flex max-w-6xl gap-4 p-5 justify-end">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">{user.name}</span>
            <form action={logout}>
              <button>Sair</button>
            </form>
          </div>
        </div>
      </header>
      <main className="dashboard-shell">{children}</main>
    </>
  );
}