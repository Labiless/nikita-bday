"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { TELEGRAM_BOT_LINK } from "@/lib/telegram-bot";

export default function Texel() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-accent">
      <p className="text-xs tracking-[0.4em] text-accent/60">
        [ CANALE SICURO ]
      </p>

      <div className="rounded-lg border border-accent/30 bg-accent/5 p-6">
        <div className="rounded-md bg-accent/10 p-3">
          <QRCodeSVG
            value={TELEGRAM_BOT_LINK}
            size={200}
            bgColor="transparent"
            fgColor="currentColor"
            className="text-accent"
          />
        </div>
      </div>

      <p className="max-w-xs text-center text-xs tracking-widest text-accent/60">
        INQUADRA IL CODICE PER STABILIRE IL CONTATTO
      </p>

      <Link
        href="/"
        className="rounded-lg border border-accent/30 px-4 py-2 text-xs tracking-widest text-accent/70 transition-colors hover:border-accent hover:text-accent"
      >
        ← TERMINALE
      </Link>
    </div>
  );
}
