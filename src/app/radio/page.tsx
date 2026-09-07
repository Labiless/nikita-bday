"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { findStation, type RadioStation } from "@/lib/radio-config";

const FREQ_MIN = 875; // 87.5 MHz, tenths
const FREQ_MAX = 1080; // 108.0 MHz, tenths
const DEFAULT_FREQ = 950;

function freqLabel(value: number) {
  return (value / 10).toFixed(1);
}

function buildTicks() {
  const ticks: { value: number; major: boolean }[] = [];
  const start = Math.ceil(FREQ_MIN / 10) * 10;
  const end = Math.floor(FREQ_MAX / 10) * 10;
  for (let v = start; v <= end; v += 10) {
    ticks.push({ value: v, major: v % 40 === 0 });
  }
  return ticks;
}

const TICKS = buildTicks();

export default function RadioPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stationRef = useRef<HTMLAudioElement | null>(null);
  const activeStationRef = useRef<RadioStation | null>(null);
  const [frequency, setFrequency] = useState(DEFAULT_FREQ);
  const [duration, setDuration] = useState<number | null>(null);
  const [power, setPower] = useState(false);
  const [tuning, setTuning] = useState(false);
  const [onStation, setOnStation] = useState(false);

  const seekTo = (value: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const fraction = (value - FREQ_MIN) / (FREQ_MAX - FREQ_MIN);
    audio.currentTime = fraction * Math.max(duration - 0.2, 0);
  };

  const playStation = (station: RadioStation) => {
    const stationAudio = stationRef.current;
    if (!stationAudio) return;
    activeStationRef.current = station;
    audioRef.current?.pause();
    if (stationAudio.getAttribute("src") !== station.audio) {
      stationAudio.src = station.audio;
    }
    stationAudio.currentTime = 0;
    stationAudio.play().catch(() => {});
  };

  const tuneTo = (value: number) => {
    const station = findStation(value);
    setOnStation(!!station);

    if (station) {
      if (activeStationRef.current?.audio !== station.audio) {
        if (power) {
          playStation(station);
        } else {
          activeStationRef.current = station;
        }
      }
      return;
    }

    if (activeStationRef.current) {
      activeStationRef.current = null;
      stationRef.current?.pause();
    }
    seekTo(value);
    if (power) audioRef.current?.play().catch(() => {});
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      stationRef.current?.pause();
    };
  }, []);

  function handleLoadedMetadata() {
    const audio = audioRef.current;
    if (audio) setDuration(audio.duration);
  }

  function handleFrequencyChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);
    setFrequency(value);
    tuneTo(value);
  }

  function togglePower() {
    const audio = audioRef.current;
    const stationAudio = stationRef.current;
    if (!audio || !stationAudio) return;

    if (power) {
      audio.pause();
      stationAudio.pause();
      setPower(false);
    } else {
      setPower(true);
      const station = findStation(frequency);
      if (station) {
        playStation(station);
      } else {
        seekTo(frequency);
        audio.play().catch(() => {});
      }
    }
  }

  const dialPercent = ((frequency - FREQ_MIN) / (FREQ_MAX - FREQ_MIN)) * 100;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-10 text-accent">
      <audio
        ref={audioRef}
        src="/audio/radio-wave.mp3"
        loop
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
      />
      <audio ref={stationRef} loop preload="auto" />

      <p className="text-xs tracking-[0.4em] text-accent/60">[ MODULO ]</p>
      <h1 className="text-2xl font-bold tracking-[0.3em]">RADIO</h1>

      <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-lg border border-accent/30 bg-accent/5 px-6 py-8">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold tabular-nums tracking-widest">
            {freqLabel(frequency)}
          </span>
          <span className="text-sm tracking-[0.2em] text-accent/60">MHz</span>
        </div>

        <span className="flex items-center gap-2 text-[10px] tracking-[0.3em] text-accent/50">
          {power && (
            <span className="h-1.5 w-1.5 rounded-full bg-accent blink" />
          )}
          {!power
            ? "SPENTA"
            : tuning
              ? "SINTONIZZAZIONE..."
              : onStation
                ? "SEGNALE TROVATO"
                : "IN ASCOLTO"}
        </span>

        <div className="relative w-full">
          <div className="relative h-6 w-full">
            {TICKS.map(({ value, major }) => (
              <div
                key={value}
                className="absolute bottom-0 w-px bg-accent/30"
                style={{
                  left: `${((value - FREQ_MIN) / (FREQ_MAX - FREQ_MIN)) * 100}%`,
                  height: major ? "100%" : "55%",
                }}
              />
            ))}
            <div
              className="absolute bottom-0 h-full w-0.5 bg-accent shadow-[0_0_6px_var(--color-accent)] transition-[left] duration-100"
              style={{ left: `${dialPercent}%` }}
            />
          </div>

          <div className="relative mt-1 h-3 w-full">
            {TICKS.filter((t) => t.major).map(({ value }) => (
              <span
                key={value}
                className="absolute -translate-x-1/2 text-[10px] text-accent/70"
                style={{
                  left: `${((value - FREQ_MIN) / (FREQ_MAX - FREQ_MIN)) * 100}%`,
                }}
              >
                {value / 10}
              </span>
            ))}
          </div>

          <input
            type="range"
            min={FREQ_MIN}
            max={FREQ_MAX}
            step={1}
            value={frequency}
            onChange={handleFrequencyChange}
            onPointerDown={() => setTuning(true)}
            onPointerUp={() => setTuning(false)}
            className="mt-2 w-full accent-accent"
          />
        </div>

        <button
          onClick={togglePower}
          className={`rounded-full border px-6 py-2 text-xs tracking-[0.2em] transition-colors ${
            power
              ? "border-accent bg-accent/20 text-accent"
              : "border-accent/30 text-accent/60 hover:border-accent hover:text-accent"
          }`}
        >
          {power ? "SPEGNI" : "ACCENDI"}
        </button>
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
