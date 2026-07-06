/** Statuses that get the stamp-impact treatment */
export const STAMP_STATUSES = new Set(["sent", "approved", "paid", "delivered", "completed"]);

export function isStampStatus(status: string): boolean {
  return STAMP_STATUSES.has(status);
}

export function stampColor(status: string): "royal" | "eco" | null {
  if (status === "sent" || status === "approved") return "royal";
  if (status === "paid" || status === "delivered" || status === "completed") return "eco";
  return null;
}

/** Stable per-instance rotation so repeated stamps don't look robotic */
export function stampRotation(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const sign = h % 2 === 0 ? 1 : -1;
  return sign * (2 + (Math.abs(h) % 3)); // ±2–4deg
}
