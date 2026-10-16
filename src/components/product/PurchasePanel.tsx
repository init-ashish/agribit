import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import type { Product } from '../../types'
import { useCart } from '../../context/CartContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { discountPercent, formatINR } from '../../utils/format'
import Button from '../common/Button'
import { useToast } from '../common/Toast'
import QuantityStepper from './QuantityStepper'
import VariantSelector from './VariantSelector'

/** Price + variant + quantity + Add to Cart. Shared by ProductCard and ProductModal. */
export default function PurchasePanel({ product }: { product: Product }) {
  const { t, pick } = useLanguage()
  const { addItem } = useCart()
  const { showToast } = useToast()
  const [variantId, setVariantId] = useState(product.variants[0].id)
  const [qty, setQty] = useState(1)

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0]
  const off = discountPercent(variant.price, variant.mrp)
  const name = pick(product.name)

  const add = () => {
    addItem(product.id, variant.id, qty)
    showToast(t('product.added', { name }))
    setQty(1)
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-xl font-extrabold text-leaf-700">{formatINR(variant.price)}</span>
        {off > 0 && (
          <>
            <s className="text-sm text-soil-500" aria-label={`MRP ${formatINR(variant.mrp)}`}>{formatINR(variant.mrp)}</s>
            <span className="rounded-md bg-mustard-400 px-1.5 text-xs font-extrabold text-leaf-900">{t('product.off', { n: off })}</span>
          </>
        )}
      </div>
      <VariantSelector name={name} variants={product.variants} value={variantId} onChange={setVariantId} />
      {product.inStock ? (
        <>
          <QuantityStepper value={qty} onChange={setQty} className="self-start" />
          <Button full onClick={add}>
            <ShoppingCart className="size-5" aria-hidden="true" />
            {t('product.addToCart')}
          </Button>
        </>
      ) : (
        <Button full disabled variant="outline">{t('product.outOfStock')}</Button>
      )}
    </div>
  )
}
