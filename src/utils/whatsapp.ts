import type { Lang, Order } from '../types'
import { formatINR } from './format'

const LINE = '──────────────'

const paymentLabel: Record<Order['payment'], Record<Lang, string>> = {
  cod: { en: 'Cash on Delivery', hi: 'कैश ऑन डिलीवरी' },
  upi: { en: 'UPI on delivery', hi: 'डिलीवरी पर UPI' },
}

const labels = {
  en: { id: 'Order ID', total: 'Total', payment: 'Payment', name: 'Name', mobile: 'Mobile', address: 'Address', po: 'PO', landmark: 'Landmark', title: 'NEW ORDER', items: 'ITEMS', customer: 'CUSTOMER', delivery: 'DELIVERY ADDRESS', village: 'Village/Locality', block: 'Block', district: 'District', state: 'State', pin: 'PIN' },
  hi: { id: 'ऑर्डर नंबर', total: 'कुल', payment: 'भुगतान', name: 'नाम', mobile: 'मोबाइल', address: 'पता', po: 'डाकघर', landmark: 'पहचान', title: 'नया ऑर्डर', items: 'सामान', customer: 'ग्राहक', delivery: 'डिलीवरी का पता', village: 'गाँव/मोहल्ला', block: 'ब्लॉक', district: 'जिला', state: 'राज्य', pin: 'पिन' },
} as const

/** Plain-text (not yet URL-encoded) order message in WhatsApp markup. */
export function buildOrderMessage(order: Order, lang: Lang): string {
  const l = labels[lang]
  const a = order.address
  const items = order.lines.map(
    (line, i) =>
      `${i + 1}. *${line.productName[lang]}*\n     ${line.variantLabel[lang]} × ${line.qty} = ${formatINR(line.unitPrice * line.qty)}`,
  )

  const parts = [
    `*${l.title} — AgriBit*`,
    `${l.id}: *${order.id}*`,
    LINE,
    `*${l.items}*`,
    ...items,
    LINE,
    `*${l.total}: ${formatINR(order.total)}*`,
    `${l.payment}: ${paymentLabel[order.payment][lang]}`,
    LINE,
    `*${l.customer}*`,
    `${l.name}: ${a.name}`,
    `${l.mobile}: ${a.mobile}`,
    '',
    `*${l.delivery}*`,
    ...(
      [
        [l.village, a.village],
        [l.po, a.postOffice],
        [l.block, a.block],
        [l.district, a.district],
        [l.state, a.state],
        [l.pin, a.pincode],
      ] as const
    )
      .filter(([, v]) => v.trim())
      .map(([k, v]) => `${k}: ${v.trim()}`),
  ]
  if (a.landmark.trim()) parts.push(`${l.landmark}: ${a.landmark.trim()}`)
  return parts.join('\n')
}

/** `number` in international format without "+" (e.g. 919876543210). */
export function buildWhatsAppLink(number: string, message: string): string {
  return `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
}
