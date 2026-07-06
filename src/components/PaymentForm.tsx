import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { money } from "@/lib/format";
import type { PaymentRow } from "@/lib/queries";

export interface PaymentFormValues {
  amount: number;
  payment_date: string;
  reference: string;
  notes: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  balance: number;
  editing?: PaymentRow | null;
  loading?: boolean;
  onSubmit: (values: PaymentFormValues) => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export function PaymentFormDialog({
  open,
  onOpenChange,
  balance,
  editing,
  loading,
  onSubmit,
}: Props) {
  const maxAmount = editing ? balance + Number(editing.amount) : balance;
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(today());
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setAmount(String(editing.amount));
      setPaymentDate(editing.payment_date);
      setReference(editing.reference ?? "");
      setNotes(editing.notes ?? "");
    } else {
      setAmount(balance > 0 ? String(balance.toFixed(2)) : "");
      setPaymentDate(today());
      setReference("");
      setNotes("");
    }
  }, [open, editing, balance]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) return;
    if (parsed > maxAmount + 0.001) return;
    onSubmit({
      amount: parsed,
      payment_date: paymentDate,
      reference: reference.trim(),
      notes: notes.trim(),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">
            {editing ? "Edit Payment" : "Record Payment"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-muted-navy">
            Balance due: <span className="font-mono font-medium text-ink">{money(balance)}</span>
          </p>
          <div>
            <label className="text-xs text-muted-navy">Amount *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={maxAmount}
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 input-field font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-muted-navy">Payment date *</label>
            <input
              type="date"
              required
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="mt-1 input-field"
            />
          </div>
          <div>
            <label className="text-xs text-muted-navy">Reference</label>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="EFT ref, cheque #…"
              className="mt-1 input-field"
            />
          </div>
          <div>
            <label className="text-xs text-muted-navy">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1 input-field"
            />
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="btn-uppercase px-4 py-2 border border-border bg-card text-ink hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-uppercase px-4 py-2 bg-eco text-white hover:brightness-90 disabled:opacity-60"
            >
              {loading ? "Saving…" : editing ? "Update" : "Record"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
