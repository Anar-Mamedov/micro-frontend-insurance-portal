/**
 * Typed event bus on top of DOM CustomEvents.
 *
 * Micro-frontends never import each other. When one needs to tell the others something, it emits
 * an event listed here; the event names and payloads are the public contract. Because the bus uses
 * `window` events instead of module state, it works even if each app bundles its own copy of this
 * package.
 */
export type MfdEventMap = {
  'claim:created': { claimId: string; policyNumber: string }
  'policy:viewed': { policyNumber: string }
}

export type MfdEventName = keyof MfdEventMap

const PREFIX = 'mfd:'

export function emit<K extends MfdEventName>(
  type: K,
  detail: MfdEventMap[K],
  target: EventTarget = window,
): void {
  target.dispatchEvent(new CustomEvent(PREFIX + type, { detail }))
}

/** Subscribes to an event and returns the function that unsubscribes. */
export function on<K extends MfdEventName>(
  type: K,
  handler: (detail: MfdEventMap[K]) => void,
  target: EventTarget = window,
): () => void {
  const listener = (event: Event) => handler((event as CustomEvent<MfdEventMap[K]>).detail)
  target.addEventListener(PREFIX + type, listener)
  return () => target.removeEventListener(PREFIX + type, listener)
}
