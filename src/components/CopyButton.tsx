"use client";

import { useState } from "react";

const BASE_URL = "http://localhost:3000"

export default function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(BASE_URL+url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("Copie o link:", BASE_URL+url);
    }
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={copy}
        className="rounded-lg border px-2 py-0.5 text-xs hover:bg-slate-400 cursor-pointer"
        aria-label="Copiar link público"
      >
        copiar link público
      </button>
      <span
        className={`text-xs ${copied ? "opacity-80" : "opacity-0"}`}
        aria-live="polite"
      >
        copiado!
      </span>
    </div>
  );
}
