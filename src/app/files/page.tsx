import Link from "next/link";

export default function FilesPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-accent">
      <p className="text-xs tracking-[0.4em] text-accent/60">[ MODULO ]</p>
      <h1 className="text-2xl font-bold tracking-[0.3em]">FILES</h1>
      <p className="text-sm text-accent/50">Modulo in costruzione...</p>
      <Link
        href="/"
        className="mt-4 rounded-lg border border-accent/30 px-4 py-2 text-xs tracking-widest text-accent/70 transition-colors hover:border-accent hover:text-accent"
      >
        ← TERMINALE
      </Link>
    </div>
  );
}
