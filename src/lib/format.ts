export function formatINR(num: number): string {
  return `₹${Number(num).toLocaleString("en-IN")}`;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function rideIdToHash(id: string): string {
  return `#ride/${id}`;
}

export function hashToRideId(hash: string): string | null {
  const m = hash.match(/^#ride\/([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}
