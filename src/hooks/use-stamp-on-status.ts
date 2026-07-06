import { useEffect, useRef, useState } from "react";
import { isStampStatus } from "@/lib/motion-status";

const stampedTransitions = new Set<string>();

/**
 * Fires once when `status` transitions into a stamp-worthy value.
 * Never fires on initial mount or page refresh.
 */
export function useStampOnStatus(docId: string | undefined, status: string): number {
  const [gen, setGen] = useState(0);
  const prev = useRef<string | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      prev.current = status;
      return;
    }

    if (!docId || !isStampStatus(status)) {
      prev.current = status;
      return;
    }

    const key = `${docId}:${status}`;
    if (prev.current !== status && !stampedTransitions.has(key)) {
      stampedTransitions.add(key);
      setGen((g) => g + 1);
    }
    prev.current = status;
  }, [docId, status]);

  return gen;
}
