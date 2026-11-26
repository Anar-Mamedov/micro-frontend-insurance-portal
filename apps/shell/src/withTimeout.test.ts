import { afterEach, describe, expect, it, vi } from 'vitest'
import { TimeoutError, withTimeout } from './withTimeout'

afterEach(() => {
  vi.useRealTimers()
})

describe('withTimeout', () => {
  it('resolves with the value when the promise is fast enough', async () => {
    await expect(withTimeout(Promise.resolve('ok'), 100, 'slow')).resolves.toBe('ok')
  })

  it('rejects with a TimeoutError when the promise hangs', async () => {
    vi.useFakeTimers()
    const result = withTimeout(new Promise(() => {}), 8000, 'Claims did not respond')
    vi.advanceTimersByTime(8000)
    await expect(result).rejects.toBeInstanceOf(TimeoutError)
    await expect(result).rejects.toThrow('Claims did not respond')
  })

  it('passes through the original error', async () => {
    await expect(withTimeout(Promise.reject(new Error('404')), 100, 'slow')).rejects.toThrow('404')
  })
})
