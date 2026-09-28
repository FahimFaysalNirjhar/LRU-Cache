import { describe, it, expect } from "vitest";
import { LRUCache } from "../src/LRUCache";

describe("LRUCache", () => {
  it("matches the example from the task", () => {
    const cache = new LRUCache<string, number>(2);
    cache.put("A", 10);
    cache.put("B", 20);
    expect(cache.get("A")).toBe(10);
    cache.put("C", 30); // evicts B
    expect(cache.get("B")).toBe(-1);
    expect(cache.get("C")).toBe(30);
    expect(cache.get("A")).toBe(10);
  });

  it("returns -1 for a missing key", () => {
    const cache = new LRUCache<string, number>(2);
    expect(cache.get("nope")).toBe(-1);
  });

  it("updates the value when putting an existing key", () => {
    const cache = new LRUCache<string, number>(2);
    cache.put("A", 1);
    cache.put("A", 2);
    expect(cache.get("A")).toBe(2);
    expect(cache.size).toBe(1);
  });

  it("refreshes recency when updating an existing key", () => {
    const cache = new LRUCache<string, number>(2);
    cache.put("A", 1);
    cache.put("B", 2);
    cache.put("A", 3); // A is now most recent
    cache.put("C", 4); // evicts B, not A
    expect(cache.get("B")).toBe(-1);
    expect(cache.get("A")).toBe(3);
  });

  it("protects a key from eviction after a successful get", () => {
    const cache = new LRUCache<string, number>(2);
    cache.put("A", 1);
    cache.put("B", 2);
    cache.get("A"); // A is now most recent
    cache.put("C", 3); // evicts B
    expect(cache.get("A")).toBe(1);
    expect(cache.get("B")).toBe(-1);
    expect(cache.get("C")).toBe(3);
  });

  it("evicts the least recently used entry and reports it", () => {
    const cache = new LRUCache<string, number>(2);
    expect(cache.put("A", 1)).toBeNull();
    expect(cache.put("B", 2)).toBeNull();
    expect(cache.put("C", 3)).toBe("A");
    expect(cache.size).toBe(2);
  });

  it("never exceeds capacity", () => {
    const cache = new LRUCache<number, number>(3);
    for (let i = 0; i < 100; i++) cache.put(i, i);
    expect(cache.size).toBe(3);
    expect(cache.keys()).toEqual([99, 98, 97]);
  });

  it("works with capacity 1", () => {
    const cache = new LRUCache<string, number>(1);
    cache.put("A", 1);
    cache.put("B", 2);
    expect(cache.get("A")).toBe(-1);
    expect(cache.get("B")).toBe(2);
  });

  it("keeps keys ordered from most to least recently used", () => {
    const cache = new LRUCache<string, number>(3);
    cache.put("A", 1);
    cache.put("B", 2);
    cache.put("C", 3);
    expect(cache.keys()).toEqual(["C", "B", "A"]);
    cache.get("A");
    expect(cache.keys()).toEqual(["A", "C", "B"]);
  });

  it("does not change order on a failed get", () => {
    const cache = new LRUCache<string, number>(2);
    cache.put("A", 1);
    cache.put("B", 2);
    cache.get("missing");
    expect(cache.keys()).toEqual(["B", "A"]);
  });

  it("stores falsy values like 0 correctly", () => {
    const cache = new LRUCache<string, number>(2);
    cache.put("zero", 0);
    expect(cache.get("zero")).toBe(0);
  });

  it("throws on invalid capacity", () => {
    expect(() => new LRUCache(0)).toThrow();
    expect(() => new LRUCache(-1)).toThrow();
    expect(() => new LRUCache(1.5)).toThrow();
    expect(() => new LRUCache(NaN)).toThrow();
  });
});
