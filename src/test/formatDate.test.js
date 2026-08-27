import { describe, it, expect } from "vitest";
import { formatDate } from "./src/js/utils/formatdate.js";

describe("formatDate", () => {
  it("restituisce una stringa", () => {
    const result = formatDate(1756116000);

    expect(typeof result).toBe("string");
  });

  it("restituisce una data non vuota", () => {
    const result = formatDate(1756116000);

    expect(result.length).toBeGreaterThan(0);
  });

  it("contiene l'anno corretto", () => {
    const result = formatDate(1756116000);

    expect(result).toContain("2025");
  });
});