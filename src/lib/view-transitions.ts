function section(path: string): string {
  return path.split("/").filter(Boolean)[0] ?? "";
}

function depth(path: string): number {
  return path.split("/").filter(Boolean).length;
}

export type VtDirection = "forward" | "back" | "fade";

export function getVtDirection(from: string, to: string): VtDirection {
  if (section(from) !== section(to)) return "fade";
  const fd = depth(from);
  const td = depth(to);
  if (td > fd) return "forward";
  if (td < fd) return "back";
  return "fade";
}

export function applyVtDirection(dir: VtDirection) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.vt = dir;
}
