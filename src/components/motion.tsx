/** Row entrance: quick horizontal settle, capped stagger */
export const rowEnterDelay = (index: number) => Math.min(index, 7) * 0.018;

export const rowEnterTransition = { duration: 0.04, ease: [0.22, 1, 0.36, 1] as const };

export const rowExitTransition = { duration: 0.1, ease: "easeIn" as const };
