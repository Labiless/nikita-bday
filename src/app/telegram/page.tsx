"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PRESET_MESSAGES } from "@/lib/telegram-messages";

const DELAY_SECONDS = 60;

interface ChatSummary {
  id: number;
  type: string;
  name: string;
  lastMessage: string;
  date: number;
}

export default function TelegramPage() {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [chatsError, setChatsError] = useState<string | null>(null);

  const [chatId, setChatId] = useState("");
  const [message, setMessage] = useState("");
  const [delayed, setDelayed] = useState(false);
  const [sendStatus, setSendStatus] = useState<
    "idle" | "scheduled" | "sending" | "sent" | "error"
  >("idle");
  const [sendError, setSendError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  async function fetchChats() {
    setLoadingChats(true);
    setChatsError(null);
    try {
      const res = await fetch("/api/telegram/updates");
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? "Errore sconosciuto");
      setChats(data.chats ?? []);
    } catch (error) {
      setChatsError((error as Error).message);
    } finally {
      setLoadingChats(false);
    }
  }

  async function doSend() {
    setSendStatus("sending");
    setSendError(null);
    try {
      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          chatId: chatId.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? "Errore sconosciuto");
      setSendStatus("sent");
    } catch (error) {
      setSendError((error as Error).message);
      setSendStatus("error");
    }
  }

  function handleSendClick() {
    if (!delayed) {
      doSend();
      return;
    }

    setSendStatus("scheduled");
    setCountdown(DELAY_SECONDS);

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      doSend();
    }, DELAY_SECONDS * 1000);
  }

  function handleCancelScheduled() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSendStatus("idle");
    setCountdown(0);
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-8 px-6 py-16 text-accent">
      <p className="text-xs tracking-[0.4em] text-accent/60">[ MODULO ]</p>
      <h1 className="text-2xl font-bold tracking-[0.3em]">TELEGRAM</h1>

      <div className="flex w-full max-w-md flex-col gap-3 rounded-lg border border-accent/30 bg-accent/5 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs tracking-[0.2em] text-accent/70">
            CHAT CONNESSE
          </span>
          <button
            onClick={fetchChats}
            disabled={loadingChats}
            className="rounded-full border border-accent/30 px-4 py-1.5 text-xs tracking-widest transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {loadingChats ? "..." : "RECUPERA CHAT ID"}
          </button>
        </div>

        {chatsError && (
          <p className="text-xs text-red-400">{chatsError}</p>
        )}

        {!chatsError && chats.length === 0 && !loadingChats && (
          <p className="py-2 text-center text-xs text-accent/40">
            Nessuna chat trovata. Premi il bottone per interrogare Telegram.
          </p>
        )}

        <div className="flex max-h-52 flex-col gap-1.5 overflow-y-auto">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setChatId(String(chat.id))}
              className={`flex flex-col rounded-md border px-3 py-2 text-left text-xs transition-colors ${
                chatId === String(chat.id)
                  ? "border-accent bg-accent/15"
                  : "border-accent/20 hover:border-accent/50 hover:bg-accent/10"
              }`}
            >
              <span className="flex items-center justify-between">
                <span className="font-semibold">{chat.name}</span>
                <span className="text-accent/50">{chat.id}</span>
              </span>
              {chat.lastMessage && (
                <span className="truncate text-accent/40">
                  {chat.lastMessage}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex w-full max-w-md flex-col gap-3 rounded-lg border border-accent/30 bg-accent/5 p-4">
        <span className="text-xs tracking-[0.2em] text-accent/70">
          INVIA MESSAGGIO
        </span>

        <input
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
          placeholder="Chat ID destinatario"
          className="w-full rounded-md border border-accent/30 bg-accent/5 px-3 py-2 text-sm outline-none transition-colors focus:border-accent"
        />

        {PRESET_MESSAGES.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {PRESET_MESSAGES.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setMessage(preset.text)}
                className={`rounded-full border px-3 py-1 text-[11px] tracking-wide transition-colors ${
                  message === preset.text
                    ? "border-accent bg-accent/15"
                    : "border-accent/20 text-accent/70 hover:border-accent/50 hover:bg-accent/10"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Scrivi un messaggio o scegline uno preimpostato sopra"
          rows={3}
          className="w-full resize-none rounded-md border border-accent/30 bg-accent/5 px-3 py-2 text-sm outline-none transition-colors focus:border-accent"
        />

        <div className="flex gap-1.5">
          <button
            onClick={() => setDelayed(false)}
            disabled={sendStatus === "scheduled"}
            className={`flex-1 rounded-full border px-3 py-1.5 text-[11px] tracking-wide transition-colors disabled:opacity-40 ${
              !delayed
                ? "border-accent bg-accent/15"
                : "border-accent/20 text-accent/70 hover:border-accent/50 hover:bg-accent/10"
            }`}
          >
            ISTANTANEO
          </button>
          <button
            onClick={() => setDelayed(true)}
            disabled={sendStatus === "scheduled"}
            className={`flex-1 rounded-full border px-3 py-1.5 text-[11px] tracking-wide transition-colors disabled:opacity-40 ${
              delayed
                ? "border-accent bg-accent/15"
                : "border-accent/20 text-accent/70 hover:border-accent/50 hover:bg-accent/10"
            }`}
          >
            RITARDO 1 MIN
          </button>
        </div>

        {sendStatus === "scheduled" ? (
          <button
            onClick={handleCancelScheduled}
            className="rounded-full border border-red-400/60 bg-red-400/10 px-6 py-2 text-xs tracking-[0.2em] text-red-400 transition-colors hover:bg-red-400/20"
          >
            ANNULLA (INVIO TRA {countdown}s)
          </button>
        ) : (
          <button
            onClick={handleSendClick}
            disabled={
              sendStatus === "sending" || !chatId.trim() || !message.trim()
            }
            className="rounded-full border border-accent/30 px-6 py-2 text-xs tracking-[0.2em] transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
          >
            {sendStatus === "sending" ? "INVIO..." : "INVIA MESSAGGIO"}
          </button>
        )}

        {sendStatus === "sent" && (
          <p className="text-xs text-accent">Messaggio inviato!</p>
        )}
        {sendStatus === "error" && (
          <p className="text-xs text-red-400">{sendError}</p>
        )}
      </div>

      <Link
        href="/"
        className="rounded-lg border border-accent/30 px-4 py-2 text-xs tracking-widest text-accent/70 transition-colors hover:border-accent hover:text-accent"
      >
        ← TERMINALE
      </Link>
    </div>
  );
}
