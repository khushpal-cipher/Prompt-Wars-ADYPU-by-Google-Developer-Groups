"use client";

import React, { useEffect, useState } from "react";

/**
 * Builds an SVG path covering every dark module of a QR matrix.
 * One path is emitted instead of hundreds of <rect> nodes so the
 * printed pass stays light in the DOM.
 */
export function matrixToPath(isDark: (row: number, col: number) => boolean, count: number): string {
  const segments: string[] = [];
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (isDark(row, col)) {
        segments.push(`M${col} ${row}h1v1h-1z`);
      }
    }
  }
  return segments.join("");
}

interface TokenQRProps {
  /** Payload encoded into the QR. Kept on-device; never transmitted. */
  value: string;
  /** Accessible description of what the code contains. */
  label: string;
}

/**
 * Renders a real, scannable QR code for the citizen's reference token.
 *
 * The encoder is imported lazily so it is fetched only when a citizen
 * actually reaches the summary step, keeping it out of the route's
 * initial JavaScript. Encoding happens entirely in the browser — the
 * token never leaves the device, consistent with the zero-server
 * guarantee of the self-enumeration flow.
 */
export function TokenQR({ value, label }: TokenQRProps) {
  const [path, setPath] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    import("qrcode-generator")
      .then((mod) => {
        if (cancelled) return;
        // Type 0 = smallest version that fits; "M" tolerates ~15% damage,
        // which survives a phone camera pointed at a printed page.
        const qr = mod.default(0, "M");
        qr.addData(value);
        qr.make();
        const moduleCount = qr.getModuleCount();
        setCount(moduleCount);
        setPath(matrixToPath((r, c) => qr.isDark(r, c), moduleCount));
      })
      .catch(() => {
        // Encoder unavailable: the token stays readable as text above.
        if (!cancelled) setPath(null);
      });

    return () => {
      cancelled = true;
    };
  }, [value]);

  const quietZone = 4;
  const extent = count + quietZone * 2;

  return (
    <div className="relative h-28 w-28 rounded-xl border bg-white p-2">
      {path && count > 0 ? (
        <svg
          viewBox={`0 0 ${extent} ${extent}`}
          className="h-full w-full"
          shapeRendering="crispEdges"
          role="img"
          aria-label={label}
        >
          <rect width={extent} height={extent} fill="#ffffff" />
          <g transform={`translate(${quietZone} ${quietZone})`}>
            <path d={path} fill="#1B2A6B" />
          </g>
        </svg>
      ) : (
        <div
          className="h-full w-full animate-pulse rounded-md bg-muted"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
