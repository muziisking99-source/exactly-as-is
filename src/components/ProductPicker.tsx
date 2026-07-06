import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useProducts, type ProductRow } from "@/lib/queries";
import { money } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface Props {
  productId: string | null | undefined;
  onSelect: (product: ProductRow | null) => void;
}

export function ProductPicker({ productId, onSelect }: Props) {
  const { data: products = [] } = useProducts();
  const [open, setOpen] = useState(false);
  const selected = products.find((p) => p.id === productId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "w-full flex items-center justify-between gap-1 px-2 py-2 text-xs border border-border rounded-lg bg-card hover:bg-secondary/50 outline-none focus:border-royal",
            !selected && "text-muted-navy",
          )}
        >
          <span className="truncate">{selected ? selected.name : "Product…"}</span>
          <ChevronsUpDown className="w-3 h-3 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(16rem,calc(100vw-2rem))] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search products…" />
          <CommandList>
            <CommandEmpty>No products found.</CommandEmpty>
            <CommandGroup>
              {productId && (
                <CommandItem
                  value="__clear__"
                  onSelect={() => {
                    onSelect(null);
                    setOpen(false);
                  }}
                >
                  <span className="text-muted-navy">Clear selection</span>
                </CommandItem>
              )}
              {products.map((p) => (
                <CommandItem
                  key={p.id}
                  value={p.name}
                  onSelect={() => {
                    onSelect(p);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("w-3 h-3", productId === p.id ? "opacity-100" : "opacity-0")} />
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{p.name}</div>
                    <div className="text-[10px] text-muted-navy">{money(p.unit_price)}</div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
