"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8">
      <path
        d="M6.6 10.8c1.2 2.4 3.2 4.4 5.6 5.6l1.9-1.9a1 1 0 0 1 1-.25c1.1.36 2.3.56 3.5.56a1 1 0 0 1 1 1V19.5a1 1 0 0 1-1 1C10.6 20.5 3.5 13.4 3.5 4.5a1 1 0 0 1 1-1H7.5a1 1 0 0 1 1 1c0 1.2.2 2.4.56 3.5a1 1 0 0 1-.25 1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RadioIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8">
      <rect
        x="3"
        y="9"
        width="18"
        height="11"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="8" cy="14.5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M14 13.5h4M14 16h3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 9 16 4M17 9l1-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FilesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8">
      <path
        d="M4 6.5A1.5 1.5 0 0 1 5.5 5h4l1.6 2H18.5A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 15.5l2-2.5 1.8 2 2.2-3 2 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

const apps = [
  { href: "/phone", label: "PHONE", icon: PhoneIcon },
  { href: "/radio", label: "RADIO", icon: RadioIcon },
  { href: "/files", label: "FILES", icon: FilesIcon },
];

function useClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function Home() {
  const time = useClock();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-12 px-6 py-16 text-accent">
      <header className="flex w-full max-w-md flex-col items-center gap-2 border-b border-accent/20 pb-6 text-center">
        <p className="text-xs tracking-[0.4em] text-accent/60">
          [ CONNESSIONE SICURA STABILITA ]
        </p>
        <h1 className="text-2xl font-bold tracking-[0.3em]">DEPARTMENT 7</h1>
        <div className="flex items-center gap-2 text-xs text-accent/70">
          <span className="h-1.5 w-1.5 rounded-full bg-accent blink" />
          <span>SISTEMA ONLINE</span>
          <span className="text-accent/40">•</span>
          <span>{time || "--:--:--"}</span>
        </div>
      </header>

      <nav className="grid w-full max-w-md grid-cols-3 gap-4">
        {apps.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col items-center gap-3 rounded-lg border border-accent/30 bg-accent/5 py-6 transition-colors hover:border-accent hover:bg-accent/10"
          >
            <span className="text-accent/80 transition-colors group-hover:text-accent">
              <Icon />
            </span>
            <span className="text-xs tracking-[0.2em] text-accent/70 group-hover:text-accent">
              {label}
            </span>
          </Link>
        ))}
      </nav>

      <p className="max-w-xs text-center text-[10px] tracking-widest text-accent/30">
        ACCESSO LIVELLO 5 RICHIESTO PER MODULI AGGIUNTIVI
      </p>
    </div>
  );
}
