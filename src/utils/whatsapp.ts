import type { Lang, Order } from '../types'
import { formatINR } from './format'

const LINE = '--------------------'

const paymentLabel: Record<Order['payment'], Record<Lang, string>> = {
  cod: { en: 'Cash on Delivery', hi: 'कैश ऑन डिलीवरी' },
  upi: { en: 'UPI on delivery', hi: 'डिलीवरी पर UPI' },
}

const labels = {
  en: { id: 'Order ID', total: 'Total', payment: 'Payment', name: 'Name', mobile: 'Mobile', address: 'Address', po: 'PO', landmark: 'Landmark' },
  hi: { id: 'ऑर्डर नंबर', total: 'कुल', payment: 'भुगतान', name: 'नाम', mobile: 'मोबाइल', address: 'पता', po: 'डाकघर', landmark: 'पहचान' },
} as const

/** Plain-text (not yet URL-encoded) order message in WhatsApp markup. */
export function buildOrderMessage(order: Order, lang: Lang): string {
  const l = labels[lang]
  const a = order.address
  const items = order.lines.map(
    (line, i) =>
      `${i + 1}. ${line.productName[lang]} — ${line.variantLabel[lang]} × ${line.qty} = ${formatINR(line.unitPrice * line.qty)}`,
  )
  const addressLine = [a.village, `${l.po}: ${a.postOffice}`, a.block, a.district, a.state].join(', ') + ` - ${a.pincode}`

  const parts = [
    '🌾 *New Order — AgriBit*',
    `${l.id}: ${order.id}`,
    LINE,
    ...items,
    LINE,
    `*${l.total}: ${formatINR(order.total)}*`,
    `${l.payment}: ${paymentLabel[order.payment][lang]}`,
    '',
    `👤 ${l.name}: ${a.name}`,
    `📞 ${l.mobile}: ${a.mobile}`,
    `📍 ${l.address}: ${addressLine}`,
  ]
  if (a.landmark.trim()) parts.push(`${l.landmark}: ${a.landmark.trim()}`)
  return parts.join('\n')
}

/** `number` in international format without "+" (e.g. 919876543210). */
export function buildWhatsAppLink(number: string, message: string): string {
  return `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
}
