import { useEffect, useState, type InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> & {
  value: number;
  onValueChange: (value: number) => void;
  /** Value committed when the field is left empty (default 0) */
  emptyAs?: number;
};

/**
 * Number input that doesn't force a leading 0 while typing.
 * Uses a string draft while focused so clearing the field works normally.
 */
export function NumberField({
  value,
  onValueChange,
  emptyAs = 0,
  onFocus,
  onBlur,
  ...props
}: Props) {
  const [draft, setDraft] = useState(() => formatDraft(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setDraft(formatDraft(value));
  }, [value, focused]);

  return (
    <input
      {...props}
      type="text"
      inputMode="decimal"
      value={focused ? draft : formatDraft(value)}
      onFocus={(e) => {
        setFocused(true);
        const next = value === 0 || value === emptyAs ? "" : formatDraft(value);
        setDraft(next);
        requestAnimationFrame(() => e.target.select());
        onFocus?.(e);
      }}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw !== "" && !/^-?\d*\.?\d*$/.test(raw)) return;
        setDraft(raw);
        if (raw === "" || raw === "-" || raw === ".") {
          onValueChange(emptyAs);
          return;
        }
        const n = parseFloat(raw);
        if (!Number.isNaN(n)) onValueChange(n);
      }}
      onBlur={(e) => {
        setFocused(false);
        const n = parseFloat(draft);
        const next = draft === "" || draft === "-" || draft === "." || Number.isNaN(n) ? emptyAs : n;
        onValueChange(next);
        setDraft(formatDraft(next));
        onBlur?.(e);
      }}
    />
  );
}

function formatDraft(value: number): string {
  if (!Number.isFinite(value)) return "";
  return String(value);
}
