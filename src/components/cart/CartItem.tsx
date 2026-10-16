import { Trash2 } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { formatINR } from '../../utils/format'
import type { CartLine } from '../../utils/cart'
import QuantityStepper from '../product/QuantityStepper'

export default function CartItem({ line }: { line: CartLine }) {
  const { dispatch } = useCart()
  const { t, pick } = useLanguage()
  const { product, variant, qty, lineTotal } = line
  const name = pick(product.name)
  return (
    <li className="flex gap-3 rounded-2xl bg-white p-3 ring-1 ring-leaf-100">
      <img src={product.images[0]} alt={name} loading="lazy" className="size-20 shrink-0 rounded-xl object-cover" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-extrabold leading-snug text-leaf-900">{name}</p>
            <p className="text-sm text-soil-500">{pick(variant.label)} · {formatINR(variant.price)}</p>
          </div>
          <button
            type="button"
            aria-label={t('cart.remove', { name })}
            onClick={() => dispatch({ type: 'REMOVE', productId: product.id, variantId: variant.id })}
            className="grid size-11 shrink-0 place-items-center rounded-full text-red-600 active:scale-90"
          >
            <Trash2 className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <QuantityStepper
            value={qty}
            onChange={(q) => dispatch({ type: 'SET_QTY', productId: product.id, variantId: variant.id, qty: q })}
          />
          <span className="font-extrabold text-leaf-700">{formatINR(lineTotal)}</span>
        </div>
      </div>
    </li>
  )
}
