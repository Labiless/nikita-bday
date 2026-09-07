export const SPECIAL_NUMBERS: Record<string, string> = {
  "3352648871": "/audio/last-call.mp3",
};

export function normalizeNumber(raw: string): string {
  return raw.replace(/[\s-]/g, "");
}

export function getSpecialAudio(raw: string): string | null {
  return SPECIAL_NUMBERS[normalizeNumber(raw)] ?? null;
}
