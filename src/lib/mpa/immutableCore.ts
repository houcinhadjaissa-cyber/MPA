// MPA Immutable Core — Immutable state management & session integrity engine

import { generateSyncId } from "./crypto";

export type DeepReadonly<T> = T extends (infer U)[]
  ? DeepReadonlyArray<U>
  : T extends object
  ? DeepReadonlyObject<T>
  : T;

type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>;
type DeepReadonlyObject<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> };

export function freeze<T extends object>(obj: T): DeepReadonly<T> {
  return Object.freeze({ ...obj }) as DeepReadonly<T>;
}

export function immutableUpdate<T extends object>(base: T, patch: Partial<T>): T {
  return Object.freeze({ ...base, ...patch }) as T;
}

export interface ImmutableLog<T> {
  readonly entries: ReadonlyArray<{ readonly state: T; readonly ts: number; readonly id: string }>;
  push(state: T): ImmutableLog<T>;
  latest(): T | null;
  rollback(steps?: number): T | null;
  toArray(): T[];
}

export function createImmutableLog<T>(maxEntries = 50): ImmutableLog<T> {
  const entries: Array<{ state: T; ts: number; id: string }> = [];

  const log: ImmutableLog<T> = {
    get entries() { return Object.freeze([...entries]); },
    push(state: T) {
      entries.push({ state, ts: Date.now(), id: generateSyncId() });
      if (entries.length > maxEntries) entries.shift();
      return log;
    },
    latest() { return entries.length ? entries[entries.length - 1].state : null; },
    rollback(steps = 1) {
      const idx = entries.length - 1 - steps;
      return idx >= 0 ? entries[idx].state : null;
    },
    toArray() { return entries.map((e) => e.state); },
  };

  return log;
}

export interface SessionSnapshot {
  readonly id: string;
  readonly ts: number;
  readonly checksum: string;
  readonly data: unknown;
}

export function createSnapshot(id: string, data: unknown, checksum: string): SessionSnapshot {
  return Object.freeze({ id, ts: Date.now(), checksum, data });
}

export class IntegrityGuard {
  private readonly baseline: string;

  constructor(state: unknown) {
    this.baseline = JSON.stringify(state);
  }

  validate(state: unknown): boolean {
    try {
      const current = JSON.stringify(state);
      return current.length > 0 && typeof state === "object" && state !== null;
    } catch {
      return false;
    }
  }

  get baselineLength(): number {
    return this.baseline.length;
  }
}

export function mergeStates<T extends Record<string, unknown>>(
  base: T,
  incoming: Partial<T>,
  resolver?: (key: keyof T, a: T[keyof T], b: T[keyof T]) => T[keyof T]
): T {
  const result = { ...base };
  for (const key in incoming) {
    if (Object.prototype.hasOwnProperty.call(incoming, key)) {
      if (resolver && key in base) {
        result[key] = resolver(key, base[key], incoming[key] as T[keyof T]);
      } else {
        result[key] = incoming[key] as T[typeof key];
      }
    }
  }
  return Object.freeze(result) as T;
}

export function diffStates<T extends Record<string, unknown>>(a: T, b: T): Partial<T> {
  const diff: Partial<T> = {};
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) {
      diff[key as keyof T] = b[key as keyof T];
    }
  }
  return diff;
}
