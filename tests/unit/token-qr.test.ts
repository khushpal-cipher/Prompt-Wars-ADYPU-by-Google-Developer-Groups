import { describe, it, expect } from "vitest";
import qrcode from "qrcode-generator";
import { matrixToPath } from "@/components/enumeration/TokenQR";

/**
 * The reference token printed on the census pass must be a genuine,
 * scannable QR code — not a decorative pattern. These tests assert the
 * structural properties a phone camera relies on.
 */
describe("TokenQR — reference token encoding", () => {
  const CRN = "CRN-2027-XXABCD-IND";

  function build(value: string) {
    const qr = qrcode(0, "M");
    qr.addData(value);
    qr.make();
    return qr;
  }

  it("encodes a CRN into a valid QR version", () => {
    const qr = build(CRN);
    const count = qr.getModuleCount();
    // Module count is always 4 * version + 17.
    expect((count - 17) % 4).toBe(0);
    expect(count).toBeGreaterThanOrEqual(21);
  });

  it("places a correct finder pattern in all three corners", () => {
    const qr = build(CRN);
    const n = qr.getModuleCount();
    const FINDER = [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ];
    const corners: ReadonlyArray<readonly [number, number]> = [
      [0, 0],
      [0, n - 7],
      [n - 7, 0],
    ];

    for (const [rowOffset, colOffset] of corners) {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          expect(qr.isDark(rowOffset + r, colOffset + c)).toBe(FINDER[r][c] === 1);
        }
      }
    }
  });

  it("produces a balanced mix of dark and light modules", () => {
    const qr = build(CRN);
    const n = qr.getModuleCount();
    let dark = 0;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (qr.isDark(r, c)) dark++;
      }
    }
    const ratio = dark / (n * n);
    // A well-masked QR sits near half dark; a decorative pattern does not.
    expect(ratio).toBeGreaterThan(0.35);
    expect(ratio).toBeLessThan(0.65);
  });

  it("is deterministic for the same token", () => {
    const a = build(CRN);
    const b = build(CRN);
    const n = a.getModuleCount();
    expect(b.getModuleCount()).toBe(n);
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        expect(b.isDark(r, c)).toBe(a.isDark(r, c));
      }
    }
  });

  it("produces different matrices for different tokens", () => {
    const a = build("CRN-2027-AAAAAA-IND");
    const b = build("CRN-2027-ZZZZZZ-IND");
    const n = Math.min(a.getModuleCount(), b.getModuleCount());
    let differences = 0;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (a.isDark(r, c) !== b.isDark(r, c)) differences++;
      }
    }
    expect(differences).toBeGreaterThan(0);
  });
});

describe("matrixToPath", () => {
  it("emits one unit square per dark module", () => {
    const isDark = (r: number, c: number) => r === c; // 4x4 diagonal
    const path = matrixToPath(isDark, 4);
    expect(path.match(/M/g)?.length).toBe(4);
    expect(path).toContain("M0 0h1v1h-1z");
    expect(path).toContain("M3 3h1v1h-1z");
  });

  it("returns an empty string when no module is dark", () => {
    expect(matrixToPath(() => false, 5)).toBe("");
  });

  it("covers every module when all are dark", () => {
    const path = matrixToPath(() => true, 3);
    expect(path.match(/M/g)?.length).toBe(9);
  });
});
