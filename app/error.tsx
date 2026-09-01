"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Client render error caught by boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        System Notice · Jan Ganana 2027
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        A temporary client-side interface issue occurred. Your local drafts remain completely safe in your device storage.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={() => reset()} variant="default" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          <span>Reload Interface</span>
        </Button>
        <Button
          onClick={() => (window.location.href = "/")}
          variant="outline"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
}
