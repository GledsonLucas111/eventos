export default function Loading() {
  return (
    <div
      role="status"
      className="rounded-xl border border-[#30382f] bg-[#141814] p-6"
    >
      <p className="text-sm text-[#c6e998]">
        Carregando eventos…
      </p>
      <p className="mt-2 text-sm text-[#a6afa1]">
        Aguarde enquanto verificamos sua sessão.
      </p>
    </div>
  );
}