export function nextTape(index: number, direction: number, count: number): number {
  if (count < 1) return 0;
  return ((index + direction) % count + count) % count;
}
export function wheelPixels(delta: number, mode: number, pageHeight: number): number {
  return delta * (mode === 1 ? 16 : mode === 2 ? pageHeight : 1);
}
