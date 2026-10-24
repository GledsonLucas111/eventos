import Link from "next/link";
export default function NotFound() {
  return (
    <>
      <h1>Evento não encontrado</h1>
      <Link href="/dashboard" className="text-blue-600">
        Voltar para eventos
      </Link>
    </>
  );
}
