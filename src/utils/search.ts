import type { Category, Product } from '../types'

/** Lowercase + drop Devanagari chandrabindu/anusvara so गेहूं == गेहूँ == गेहू */
const normalize = (s: string): string => s.toLowerCase().replace(/[ँं]/g, '').trim()

export function matchesQuery(product: Product, category: Category | undefined, query: string): boolean {
  const q = normalize(query)
  if (!q) return true
  const haystack = [
    product.name.en,
    product.name.hi,
    category?.name.en ?? '',
    category?.name.hi ?? '',
  ].map(normalize)
  return haystack.some((h) => h.includes(q))
}
