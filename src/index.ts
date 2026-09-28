import { LRUCache } from "./LRUCache";

const cache = new LRUCache<string, number>(2);

const state = () => `state (MRU -> LRU): [${cache.keys().join(", ")}]`;

function put(key: string, value: number): void {
  const evicted = cache.put(key, value);
  const note = evicted !== null ? `  --> evicted "${evicted}"` : "";
  console.log(`put("${key}", ${value})${note}`);
  console.log(`  ${state()}`);
}

function get(key: string): void {
  const result = cache.get(key);
  console.log(`get("${key}") -> ${result}`);
  console.log(`  ${state()}`);
}

console.log("=== LRU Cache demo (capacity = 2) ===\n");

put("A", 10);
put("B", 20);
get("A"); // 10, A becomes most recently used
put("C", 30); // capacity exceeded, evicts B (least recently used)
get("B"); // -1
get("C"); // 30
get("A"); // 10

console.log("\n=== Extra: update existing key ===\n");
put("A", 99); // updates value, refreshes recency, no eviction
get("A"); // 99
