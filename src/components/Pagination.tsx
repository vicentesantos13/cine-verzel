"use client";

interface Props {
  totalPages: number;
  currentPage: number;
  pending: boolean;
  onPage: (p: number) => void;
}

export default function Pagination({ totalPages, currentPage, pending, onPage }: Props) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <button
        type="button"
        className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
        disabled={currentPage <= 1 || pending}
        onClick={() => onPage(Math.max(1, currentPage - 1))}
      >
        ← Anterior
      </button>
      <span className="text-sm">Página {currentPage} de {totalPages}</span>
      <button
        type="button"
        className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
        disabled={currentPage >= totalPages || pending}
        onClick={() => onPage(Math.min(totalPages, currentPage + 1))}
      >
        Próxima →
      </button>
    </div>
  );
}
