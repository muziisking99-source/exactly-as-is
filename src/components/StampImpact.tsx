import { type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { stampColor, stampRotation } from "@/lib/motion-status";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface Props {
  children: ReactNode;
  status: string;
  stampGen: number;
  seed: string;
  className?: string;
}

/** Irregular hand-stamped ring edge */
function StampRing({ color }: { color: "royal" | "eco" }) {
  const fill = color === "royal" ? "var(--royal)" : "var(--eco)";
  return (
    <svg
      viewBox="0 0 48 48"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    >
      <path
        d="M24 3 C35 2 44 11 45 22 C46 33 37 44 24 45 C11 44 2 33 3 22 C4 11 13 4 24 3 Z"
        fill="none"
        stroke={fill}
        strokeWidth="2.5"
        strokeLinejoin="round"
        opacity="0.55"
      />
    </svg>
  );
}

export function StampImpact({ children, status, stampGen, seed, className }: Props) {
  const reduced = useReducedMotion();
  const color = stampColor(status);

  if (!color || stampGen === 0 || reduced) {
    return <span className={cn("inline-flex", className)}>{children}</span>;
  }

  const rot = stampRotation(`${seed}-${stampGen}`);

  return (
    <span className={cn("relative inline-flex", className)}>
      {stampGen > 0 && (
        <motion.span
          key={stampGen}
          className="absolute -inset-1.5 pointer-events-none"
          initial={{ scale: 1.4, rotate: rot }}
          animate={{ scale: 1, rotate: rot * 0.35 }}
          transition={{ type: "spring", stiffness: 520, damping: 26, mass: 0.6 }}
        >
          <StampRing color={color} />
        </motion.span>
      )}
      <span className="relative z-[1]">{children}</span>
    </span>
  );
}
