import { describe, expect, it } from 'vitest'
import { formatDate, formatMoney } from './format'

describe('formatMoney', () => {
  it('formats AZN with the manat sign and two decimals', () => {
    const text = formatMoney(1234.5)
    expect(text).toContain('₼')
    expect(text.replace(/\s/g, ' ')).toMatch(/1[.\s]?234,50/)
  })

  it('supports other currencies and locales', () => {
    expect(formatMoney(10, 'EUR', 'en-GB')).toBe('€10.00')
  })
})

describe('formatDate', () => {
  it('formats an ISO date for display', () => {
    expect(formatDate('2026-11-26')).toBe('26 Nov 2026')
  })
})
