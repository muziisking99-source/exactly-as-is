import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface Props {
  active: boolean;
  className?: string;
}

/** Pen-stroke underline for active nav — draws L→R, retracts on deactivate */
export function NavInkStroke({ active, className }: Props) {
  const reduced = useReducedMotion();
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);
  const prevActive = useRef(active);

  useEffect(() => {
    if (pathRef.current) setLength(pathRef.current.getTotalLength());
  }, []);

  useEffect(() => {
    prevActive.current = active;
  }, [active]);

  if (reduced) {
    return active ? (
      <span className={`absolute bottom-1 left-3 right-3 h-px bg-royal ${className ?? ""}`} />
    ) : null;
  }

  const offset = active ? 0 : length;
  const duration = active ? 150 : 120;

  return (
    <svg
      className={`absolute bottom-1 left-3 right-3 h-[3px] overflow-visible pointer-events-none ${className ?? ""}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        ref={pathRef}
        d="M0 2 Q12 0 24 2 T48 2"
        fill="none"
        stroke="var(--royal)"
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          strokeDasharray: length || 48,
          strokeDashoffset: offset,
          transition: `stroke-dashoffset ${duration}ms ease-out`,
        }}
      />
    </svg>
  );
}
