export class TimeoutError extends Error {
  override name = 'TimeoutError'
}

/**
 * Rejects if `promise` does not settle within `ms`. Without this, a remote server that accepts the
 * connection but never answers would leave the user looking at a spinner forever.
 */
export function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutError(message)), ms)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}
