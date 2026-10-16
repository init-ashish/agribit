import { products } from '../data/products'
import type { CartItem, Order, Address, PaymentMethod, Product, Variant } from '../types'
import { generateOrderId } from './format'

export interface CartLine {
  product: Product
  variant: Variant
  qty: number
  lineTotal: number
}

/** Join cart references with live product data. Unknown/removed items are dropped. */
export function resolveCart(items: CartItem[]): CartLine[] {
  const lines: CartLine[] = []
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId)
    const variant = product?.variants.find((v) => v.id === item.variantId)
    if (product && variant && product.inStock) {
      lines.push({ product, variant, qty: item.qty, lineTotal: variant.price * item.qty })
    }
  }
  return lines
}

export const cartTotal = (lines: CartLine[]): number =>
  lines.reduce((sum, l) => sum + l.lineTotal, 0)

export const cartCount = (lines: CartLine[]): number => lines.reduce((sum, l) => sum + l.qty, 0)

export function buildOrder(lines: CartLine[], address: Address, payment: PaymentMethod): Order {
  return {
    id: generateOrderId(),
    lines: lines.map((l) => ({
      productName: l.product.name,
      variantLabel: l.variant.label,
      qty: l.qty,
      unitPrice: l.variant.price,
    })),
    total: cartTotal(lines),
    address,
    payment,
    createdAt: new Date().toISOString(),
  }
}
