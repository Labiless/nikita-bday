"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FILES_ACCESS_CODE } from "@/lib/files-config";

const CODE_LENGTH = 5;

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0">
      <path
        d="M6.5 3h7l4 4v13a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 3v4h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
      <path
        d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FilesPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!unlocked) return;
    setLoading(true);
    fetch("/api/files")
      .then((res) => res.json())
      .then((data) => setFiles(data.files ?? []))
      .finally(() => setLoading(false));
  }, [unlocked]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/[^A-Za-z0-9]/g, "");
    setCode(value.slice(0, CODE_LENGTH));
    setError(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.toUpperCase() === FILES_ACCESS_CODE.toUpperCase()) {
      setUnlocked(true);
    } else {
      setError(true);
      setCode("");
    }
  }

  if (!unlocked) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-accent">
        <p className="text-xs tracking-[0.4em] text-accent/60">
          [ ACCESSO RISTRETTO ]
        </p>
        <h1 className="text-2xl font-bold tracking-[0.3em]">FILES</h1>
        <p className="max-w-xs text-center text-xs text-accent/50">
          Inserisci il codice di accesso a 5 caratteri per continuare
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4"
        >
          <input
            autoFocus
            value={code}
            onChange={handleChange}
            maxLength={CODE_LENGTH}
            className={`w-48 rounded-lg border bg-accent/5 px-4 py-3 text-center text-2xl tracking-[0.5em] outline-none transition-colors ${
              error
                ? "border-red-400 text-red-400"
                : "border-accent/30 text-accent focus:border-accent"
            }`}
            placeholder="_____"
          />

          {error && (
            <p className="text-xs tracking-widest text-red-400">
              CODICE NON VALIDO
            </p>
          )}

          <button
            type="submit"
            disabled={code.length !== CODE_LENGTH}
            className="rounded-full border border-accent/30 px-6 py-2 text-xs tracking-[0.2em] transition-colors hover:border-accent hover:text-accent disabled:opacity-30"
          >
            SBLOCCA
          </button>
        </form>

        <Link
          href="/"
          className="mt-2 rounded-lg border border-accent/30 px-4 py-2 text-xs tracking-widest text-accent/70 transition-colors hover:border-accent hover:text-accent"
        >
          ← TERMINALE
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-6 py-16 text-accent">
      <p className="text-xs tracking-[0.4em] text-accent/60">[ MODULO ]</p>
      <h1 className="text-2xl font-bold tracking-[0.3em]">FILES</h1>

      <div className="flex w-full max-w-sm flex-col gap-2 rounded-lg border border-accent/30 bg-accent/5 p-3">
        {loading && (
          <p className="py-6 text-center text-xs tracking-widest text-accent/50">
            CARICAMENTO...
          </p>
        )}

        {!loading && files.length === 0 && (
          <p className="py-6 text-center text-xs tracking-widest text-accent/50">
            NESSUN FILE DISPONIBILE
          </p>
        )}

        {files.map((name) => (
          <a
            key={name}
            href={`/pdf/${encodeURIComponent(name)}`}
            download
            className="group flex items-center gap-3 rounded-md border border-accent/20 px-3 py-2 transition-colors hover:border-accent hover:bg-accent/10"
          >
            <FileIcon />
            <span className="flex-1 truncate text-sm">{name}</span>
            <span className="text-accent/50 transition-colors group-hover:text-accent">
              <DownloadIcon />
            </span>
          </a>
        ))}
      </div>

      <Link
        href="/"
        className="mt-2 rounded-lg border border-accent/30 px-4 py-2 text-xs tracking-widest text-accent/70 transition-colors hover:border-accent hover:text-accent"
      >
        ← TERMINALE
      </Link>
    </div>
  );
}
