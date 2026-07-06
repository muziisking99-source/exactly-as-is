import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="text-center py-16 px-6">
      {icon && <div className="mx-auto mb-4 text-muted-navy/60">{icon}</div>}
      <h3 className="font-serif text-xl text-ink">{title}</h3>
      {description && <p className="mt-2 text-sm text-muted-navy max-w-md mx-auto">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
