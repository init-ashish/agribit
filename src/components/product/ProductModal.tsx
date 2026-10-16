import { useState } from 'react'
import type { Product } from '../../types'
import { useLanguage } from '../../i18n/LanguageContext'
import Sheet from '../common/Sheet'
import PurchasePanel from './PurchasePanel'

interface Props {
  product: Product | null
  onClose: () => void
}

function Body({ product }: { product: Product }) {
  const { t, pick } = useLanguage()
  const [active, setActive] = useState(0)
  const name = pick(product.name)
  return (
    <div className="grid gap-4 p-4 md:grid-cols-2">
      <div>
        <img
          src={product.images[active]}
          alt={`${name} — ${t('product.photo', { n: active + 1 })}`}
          className="aspect-square w-full rounded-3xl object-cover"
        />
        {product.images.length > 1 && (
          <div className="mt-2 flex gap-2">
            {product.images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={t('product.photo', { n: i + 1 })}
                aria-pressed={i === active}
                className={`size-16 overflow-hidden rounded-xl border-2 ${i === active ? 'border-leaf-600' : 'border-transparent opacity-70'}`}
              >
                <img src={src} alt="" loading="lazy" className="size-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="mb-1 font-extrabold text-leaf-900">{t('product.about')}</h3>
          <p className="text-soil-700">{pick(product.description)}</p>
        </div>
        {product.sowingInfo && (
          <div className="rounded-2xl bg-white p-3 ring-1 ring-leaf-100">
            <h3 className="mb-2 font-extrabold text-leaf-900">🌱 {t('product.sowing')}</h3>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
              <dt className="font-semibold text-soil-500">{t('product.seedRate')}</dt>
              <dd className="font-bold">{pick(product.sowingInfo.seedRatePerAcre)}</dd>
              <dt className="font-semibold text-soil-500">{t('product.duration')}</dt>
              <dd className="font-bold">{pick(product.sowingInfo.duration)}</dd>
            </dl>
          </div>
        )}
        <PurchasePanel product={product} />
      </div>
    </div>
  )
}

export default function ProductModal({ product, onClose }: Props) {
  const { pick } = useLanguage()
  return (
    <Sheet open={product !== null} onClose={onClose} title={product ? pick(product.name) : ''} wide>
      {product && <Body key={product.id} product={product} />}
    </Sheet>
  )
}
