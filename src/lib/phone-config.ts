export const SPECIAL_NUMBERS: Record<string, string> = {
  "1234567890": "/audio/audio1.wav",
};

export function normalizeNumber(raw: string): string {
  return raw.replace(/[\s-]/g, "");
}

export function getSpecialAudio(raw: string): string | null {
  return SPECIAL_NUMBERS[normalizeNumber(raw)] ?? null;
}
