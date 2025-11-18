export interface Currency {
  code: string
  symbol: string
  name: string
  flag: string
}

export const CURRENCIES: Currency[] = [
  {
    code: 'USD',
    symbol: '$',
    name: 'Dólar Estadounidense',
    flag: '🇺🇸',
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
  },
  {
    code: 'MXN',
    symbol: '$',
    name: 'Peso Mexicano',
    flag: '🇲🇽',
  },
  {
    code: 'ARS',
    symbol: '$',
    name: 'Peso Argentino',
    flag: '🇦🇷',
  },
  {
    code: 'PEN',
    symbol: 'S/',
    name: 'Sol Peruano',
    flag: '🇵🇪',
  },
]

export function getCurrencyByCode(code: string): Currency | undefined {
  return CURRENCIES.find((c) => c.code === code)
}

export function formatCurrencyLabel(currency: Currency): string {
  return `${currency.flag} ${currency.code} (${currency.symbol}) - ${currency.name}`
}

