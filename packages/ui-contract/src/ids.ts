/**
 * Stable semantic component identities.
 * Never use array indexes as semantic identities.
 */
export type ComponentId =
  | `stack:${string}`
  | `grid:${string}`
  | `heading:${string}`
  | `text:${string}`
  | `metric:${string}`
  | `status:${string}`
  | `alert:${string}`
  | `table:${string}`
  | `chart:${string}`
  | `timeline:${string}`
  | `sources:${string}`
  | `source:${string}`;

export function assertStableId(id: string): void {
  if (!id.includes(":")) {
    throw new Error(`Component id must be namespaced (got "${id}")`);
  }
  if (/^\d+$/.test(id.split(":")[1] ?? "")) {
    throw new Error(`Component id must not use bare numeric indexes (got "${id}")`);
  }
}
