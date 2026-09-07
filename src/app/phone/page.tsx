"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getSpecialAudio } from "@/lib/phone-config";

const RING_SRC = "/audio/phone-ring.wav";
const NORMAL_RING_MS = 5000;
const SPECIAL_RING_MS = 10000;
const RESET_DELAY_MS = 1800;

type CallStatus = "idle" | "ringing" | "playing" | "ended";

const KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["*", "0", "#"],
];

function HandsetIcon({ hangUp = false }: { hangUp?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path
        d="M6.6 10.8c1.2 2.4 3.2 4.4 5.6 5.6l1.9-1.9a1 1 0 0 1 1-.25c1.1.36 2.3.56 3.5.56a1 1 0 0 1 1 1V19.5a1 1 0 0 1-1 1C10.6 20.5 3.5 13.4 3.5 4.5a1 1 0 0 1 1-1H7.5a1 1 0 0 1 1 1c0 1.2.2 2.4.56 3.5a1 1 0 0 1-.25 1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        transform={hangUp ? "rotate(135 12 12)" : undefined}
      />
    </svg>
  );
}

function BackspaceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M9 6h9a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 18 18H9l-5.2-5.2a1 1 0 0 1 0-1.6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 10l5 4M15 10l-5 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function PhonePage() {
  const [number, setNumber] = useState("");
  const [status, setStatus] = useState<CallStatus>("idle");
  const ringRef = useRef<HTMLAudioElement | null>(null);
  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const stopAll = () => {
    clearTimer();
    if (ringRef.current) {
      ringRef.current.pause();
      ringRef.current.currentTime = 0;
    }
    if (voiceRef.current) {
      voiceRef.current.pause();
      voiceRef.current.currentTime = 0;
    }
  };

  useEffect(() => stopAll, []);

  function handleKey(key: string) {
    if (status !== "idle") return;
    setNumber((prev) => (prev.length < 20 ? prev + key : prev));
  }

  function handleBackspace() {
    if (status !== "idle") return;
    setNumber((prev) => prev.slice(0, -1));
  }

  function endCall() {
    stopAll();
    setStatus("idle");
    setNumber("");
  }

  function startCall() {
    if (!number || status !== "idle") return;

    const specialAudio = getSpecialAudio(number);
    setStatus("ringing");

    if (ringRef.current) {
      ringRef.current.currentTime = 0;
      ringRef.current.play().catch(() => {});
    }

    timeoutRef.current = setTimeout(
      () => {
        if (ringRef.current) {
          ringRef.current.pause();
          ringRef.current.currentTime = 0;
        }

        if (specialAudio && voiceRef.current) {
          setStatus("playing");
          voiceRef.current.src = specialAudio;
          voiceRef.current.currentTime = 0;
          voiceRef.current.play().catch(() => {});
        } else {
          setStatus("ended");
          timeoutRef.current = setTimeout(() => {
            setStatus("idle");
            setNumber("");
          }, RESET_DELAY_MS);
        }
      },
      specialAudio ? SPECIAL_RING_MS : NORMAL_RING_MS
    );
  }

  function handleVoiceEnded() {
    setStatus("ended");
    timeoutRef.current = setTimeout(() => {
      setStatus("idle");
      setNumber("");
    }, RESET_DELAY_MS);
  }

  const statusLabel =
    status === "ringing"
      ? "SQUILLO..."
      : status === "playing"
        ? "CONNESSO"
        : status === "ended"
          ? "CHIAMATA TERMINATA"
          : "PRONTO";

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-10 text-accent">
      <audio ref={ringRef} src={RING_SRC} loop />
      <audio ref={voiceRef} onEnded={handleVoiceEnded} />

      <p className="text-xs tracking-[0.4em] text-accent/60">[ MODULO ]</p>
      <h1 className="text-2xl font-bold tracking-[0.3em]">PHONE</h1>

      <div className="flex w-full max-w-xs flex-col items-center gap-1 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3">
        <span className="min-h-[1.75rem] break-all font-mono text-xl tracking-[0.15em]">
          {number || " "}
        </span>
        <span className="flex items-center gap-2 text-[10px] tracking-[0.3em] text-accent/50">
          {status !== "idle" && (
            <span className="h-1.5 w-1.5 rounded-full bg-accent blink" />
          )}
          {statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {KEYS.flat().map((key) => (
          <button
            key={key}
            onClick={() => handleKey(key)}
            disabled={status !== "idle"}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-accent/5 text-lg transition-colors hover:border-accent hover:bg-accent/10 disabled:opacity-30"
          >
            {key}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleBackspace}
          disabled={status !== "idle" || !number}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 text-accent/70 transition-colors hover:border-accent hover:text-accent disabled:opacity-30"
        >
          <BackspaceIcon />
        </button>

        {status === "idle" ? (
          <button
            onClick={startCall}
            disabled={!number}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-green-400/60 bg-green-400/10 text-green-400 transition-colors hover:bg-green-400/20 disabled:opacity-30"
          >
            <HandsetIcon />
          </button>
        ) : (
          <button
            onClick={endCall}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-red-400/60 bg-red-400/10 text-red-400 transition-colors hover:bg-red-400/20"
          >
            <HandsetIcon hangUp />
          </button>
        )}

        <div className="h-12 w-12" />
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
