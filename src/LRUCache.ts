class Node<K, V> {
  key: K | null;
  value: V | null;
  prev: Node<K, V> | null = null;
  next: Node<K, V> | null = null;

  constructor(key: K | null, value: V | null) {
    this.key = key;
    this.value = value;
  }
}

/**
 * Least Recently Used cache.
 * - Map<key, Node> gives O(1) lookup.
 * - Doubly linked list keeps recency order:
 *   head.next = most recently used, tail.prev = least recently used.
 */
export class LRUCache<K = string, V = number> {
  private readonly capacity: number;
  private readonly map = new Map<K, Node<K, V>>();
  private readonly head: Node<K, V>; // dummy sentinel
  private readonly tail: Node<K, V>; // dummy sentinel

  constructor(capacity: number) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error("Capacity must be a positive integer");
    }
    this.capacity = capacity;
    this.head = new Node<K, V>(null, null);
    this.tail = new Node<K, V>(null, null);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /** Returns the value if present (and marks it most recently used), else -1. */
  get(key: K): V | -1 {
    const node = this.map.get(key);
    if (!node) return -1;
    this.moveToFront(node);
    return node.value as V;
  }

  /** Inserts or updates a key. Evicts the least recently used entry if over capacity. */
  put(key: K, value: V): K | null {
    const existing = this.map.get(key);
    if (existing) {
      existing.value = value;
      this.moveToFront(existing);
      return null;
    }

    const node = new Node<K, V>(key, value);
    this.map.set(key, node);
    this.addToFront(node);

    if (this.map.size > this.capacity) {
      const lru = this.tail.prev as Node<K, V>;
      this.removeNode(lru);
      this.map.delete(lru.key as K);
      return lru.key; // evicted key (handy for demo/tests)
    }
    return null;
  }

  get size(): number {
    return this.map.size;
  }

  /** Keys ordered from most to least recently used. */
  keys(): K[] {
    const result: K[] = [];
    let cur = this.head.next;
    while (cur && cur !== this.tail) {
      result.push(cur.key as K);
      cur = cur.next;
    }
    return result;
  }

  // ---- linked list helpers (all O(1)) ----

  private addToFront(node: Node<K, V>): void {
    node.prev = this.head;
    node.next = this.head.next;
    (this.head.next as Node<K, V>).prev = node;
    this.head.next = node;
  }

  private removeNode(node: Node<K, V>): void {
    (node.prev as Node<K, V>).next = node.next;
    (node.next as Node<K, V>).prev = node.prev;
    node.prev = null;
    node.next = null;
  }

  private moveToFront(node: Node<K, V>): void {
    this.removeNode(node);
    this.addToFront(node);
  }
}
