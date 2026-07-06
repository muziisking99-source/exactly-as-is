import { useEffect } from "react";
import { applyVtDirection, getVtDirection } from "@/lib/view-transitions";

/** Sets html[data-vt] before internal navigations for direction-aware view transitions */
export function VtDirectionSync() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("a[href]");
      if (!el || !(el instanceof HTMLAnchorElement)) return;
      if (el.target === "_blank" || el.hasAttribute("download")) return;
      try {
        const url = new URL(el.href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        applyVtDirection(getVtDirection(window.location.pathname, url.pathname));
      } catch {
        /* ignore */
      }
    };

    const onPopState = () => applyVtDirection("back");

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  return null;
}
