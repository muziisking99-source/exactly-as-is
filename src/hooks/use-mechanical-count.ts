import { useEffect, useState } from "react";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * Mechanical tally counter — discrete steps, quick settle on final value.
 * Total duration capped at 600ms.
 */
export function useMechanicalCount(target: number, enabled = true): number {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const goal = Math.max(0, Math.round(target));
    if (reduced) {
      setDisplay(goal);
      return;
    }

    if (goal === 0) {
      setDisplay(0);
      return;
    }

    const tail = Math.min(4, goal);
    const bulkTarget = goal - tail;
    const bulkSteps = bulkTarget > 0 ? Math.min(14, Math.max(4, Math.ceil(bulkTarget / 8))) : 0;
    const totalSteps = bulkSteps + tail;
    const totalMs = Math.min(580, Math.max(240, totalSteps * 26));
    const stepMs = Math.floor(totalMs / totalSteps);

    let step = 0;
    let timer: number;

    const tick = () => {
      step++;
      if (step <= bulkSteps && bulkTarget > 0) {
        setDisplay(Math.round((bulkTarget * step) / bulkSteps));
      } else if (step <= bulkSteps + tail) {
        const tailStep = step - bulkSteps;
        setDisplay(Math.min(bulkTarget + tailStep, goal));
      } else {
        setDisplay(goal);
        return;
      }
      timer = window.setTimeout(tick, stepMs);
    };

    setDisplay(0);
    timer = window.setTimeout(tick, stepMs);
    return () => clearTimeout(timer);
  }, [target, enabled, reduced]);

  return display;
}
