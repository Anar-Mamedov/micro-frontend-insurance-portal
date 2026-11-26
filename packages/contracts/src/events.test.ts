import { describe, expect, it, vi } from 'vitest'
import { emit, on } from './events'

describe('event bus', () => {
  it('delivers the payload to subscribers', () => {
    const handler = vi.fn()
    const off = on('claim:created', handler)

    emit('claim:created', { claimId: 'CL-1', policyNumber: 'MT-1001' })

    expect(handler).toHaveBeenCalledWith({ claimId: 'CL-1', policyNumber: 'MT-1001' })
    off()
  })

  it('stops delivering after unsubscribe', () => {
    const handler = vi.fn()
    const off = on('policy:viewed', handler)
    off()

    emit('policy:viewed', { policyNumber: 'MT-1001' })

    expect(handler).not.toHaveBeenCalled()
  })

  it('does not mix up different event names', () => {
    const handler = vi.fn()
    const off = on('claim:created', handler)

    emit('policy:viewed', { policyNumber: 'MT-1001' })

    expect(handler).not.toHaveBeenCalled()
    off()
  })

  it('can use an isolated target', () => {
    const target = new EventTarget()
    const handler = vi.fn()
    on('policy:viewed', handler, target)

    emit('policy:viewed', { policyNumber: 'TR-2001' })
    expect(handler).not.toHaveBeenCalled()

    emit('policy:viewed', { policyNumber: 'TR-2001' }, target)
    expect(handler).toHaveBeenCalledOnce()
  })
})
