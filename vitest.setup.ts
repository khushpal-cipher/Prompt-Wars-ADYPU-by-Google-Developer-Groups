import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";

// Polyfill/stub localStorage if absent or incomplete in environment
if (typeof window !== "undefined") {
  if (!window.localStorage || typeof window.localStorage.getItem !== "function") {
    let store: Record<string, string> = {};
    const localStorageMock = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = String(value);
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      key: (i: number) => Object.keys(store)[i] || null,
      get length() {
        return Object.keys(store).length;
      },
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
  }
}

afterEach(() => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.clear();
    } catch {
      // ignore
    }
  }
  vi.restoreAllMocks();
});
