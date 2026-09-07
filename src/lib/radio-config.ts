export interface RadioStation {
  min: number; // tenths of MHz, inclusive (e.g. 931 = 93.1 MHz)
  max: number; // tenths of MHz, inclusive
  audio: string;
}

export const RADIO_STATIONS: RadioStation[] = [
  { min: 909, max: 912, audio: "/audio/morse/z.wav" },
  { min: 943, max: 946, audio: "/audio/morse/e.wav" },
  { min: 977, max: 980, audio: "/audio/morse/g.wav" },
  { min: 1011, max: 1014, audio: "/audio/morse/e.wav" },
  { min: 1045, max: 1048, audio: "/audio/morse/l.wav" },
];

export function findStation(frequency: number): RadioStation | null {
  return (
    RADIO_STATIONS.find((s) => frequency >= s.min && frequency <= s.max) ??
    null
  );
}
