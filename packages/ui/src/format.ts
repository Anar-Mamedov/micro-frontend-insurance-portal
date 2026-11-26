const moneyFormatters = new Map<string, Intl.NumberFormat>()

/** Formats an amount with the currency symbol, e.g. `1.234,50 ₼` for AZN in the az-AZ locale. */
export function formatMoney(amount: number, currency = 'AZN', locale = 'az-AZ'): string {
  const key = `${locale}|${currency}`
  let formatter = moneyFormatters.get(key)
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, { style: 'currency', currency })
    moneyFormatters.set(key, formatter)
  }
  return formatter.format(amount)
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

/** Formats an ISO date (`2026-11-26`) as `26 Nov 2026`. */
export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate))
}
