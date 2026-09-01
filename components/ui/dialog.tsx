import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in-up">
      <div
        className={cn(
          "relative w-full max-w-lg rounded-2xl bg-card border border-border shadow-2xl p-6 text-card-foreground",
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted transition"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>
        {title && <h2 className="text-xl font-bold tracking-tight mb-1">{title}</h2>}
        {description && (
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}

export function Sheet({
  isOpen,
  onClose,
  title,
  description,
  children,
  side = "right",
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  side?: "right" | "left" | "bottom";
}) {
  if (!isOpen) return null;

  const sideClasses = {
    right: "inset-y-0 right-0 max-w-md w-full",
    left: "inset-y-0 left-0 max-w-md w-full",
    bottom: "inset-x-0 bottom-0 max-h-[85vh] w-full rounded-t-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "fixed bg-card border-l border-border p-6 shadow-2xl overflow-y-auto flex flex-col z-50",
          sideClasses[side]
        )}
      >
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
          <div>
            {title && <h2 className="text-lg font-bold">{title}</h2>}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted transition"
            aria-label="Close sheet"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
