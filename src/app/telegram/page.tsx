"use client";

import { useState } from "react";

export default function TelegramPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleClick() {
    setStatus("sending");
    try {
      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Hello World" }),
      });
      const data = await res.json();
      setStatus(data.success ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 font-sans dark:bg-black">
      <button
        onClick={handleClick}
        disabled={status === "sending"}
        className="rounded-full bg-foreground px-6 py-3 text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
      >
        {status === "sending" ? "Invio..." : "Invia messaggio"}
      </button>
      {status === "sent" && (
        <p className="text-green-600 dark:text-green-400">Messaggio inviato!</p>
      )}
      {status === "error" && (
        <p className="text-red-600 dark:text-red-400">
          Errore nell&apos;invio del messaggio.
        </p>
      )}
    </div>
  );
}
