import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function InkCheck({ checked, onChange, className }: Props) {
  const reduced = useReducedMotion();
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLen, setPathLen] = useState(14);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength());
  }, []);

  useEffect(() => {
    if (checked && !reduced) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 80);
      return () => clearTimeout(t);
    }
  }, [checked, reduced]);

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-4 h-4 shrink-0 rounded border border-border bg-card flex items-center justify-center",
        "transition-colors duration-150 hover:border-royal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal/30",
        checked && "border-eco/50 bg-eco/5",
        pulse && "scale-110",
        className,
      )}
      style={{ transition: "border-color 150ms, background-color 150ms, transform 80ms ease-out" }}
    >
      {checked && (
        <svg viewBox="0 0 14 14" className="w-3 h-3" aria-hidden>
          <path
            ref={pathRef}
            d="M2.5 7 L5.5 10 L11.5 3.5"
            fill="none"
            stroke="var(--eco)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={
              reduced
                ? undefined
                : {
                    strokeDasharray: pathLen,
                    strokeDashoffset: pathLen,
                    animation: "ink-check-draw 150ms ease-out forwards",
                  }
            }
          />
        </svg>
      )}
    </button>
  );
}
