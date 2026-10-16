import { motion } from 'framer-motion'
import type { Product } from '../../types'
import { useLanguage } from '../../i18n/LanguageContext'
import PurchasePanel from './PurchasePanel'

interface Props {
  product: Product
  onOpen: (product: Product) => void
}

export default function ProductCard({ product, onOpen }: Props) {
  const { t, pick } = useLanguage()
  const name = pick(product.name)
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-leaf-100"
    >
      <button
        type="button"
        onClick={() => onOpen(product)}
        aria-label={t('product.viewDetails', { name })}
        className="relative block aspect-square w-full overflow-hidden bg-leaf-100"
      >
        <img
          src={product.images[0]}
          alt={name}
          loading="lazy"
          decoding="async"
          width={400}
          height={400}
          className={`size-full object-cover transition duration-500 hover:scale-105 ${product.inStock ? '' : 'grayscale'}`}
        />
        {product.badge && (
          <span className="absolute left-2 top-2 rounded-full bg-mustard-500 px-2.5 py-1 text-xs font-extrabold text-leaf-900 shadow">
            {pick(product.badge)}
          </span>
        )}
      </button>
      <div className="flex flex-1 flex-col gap-2.5 p-3">
        <h3 className="text-base font-extrabold leading-snug text-leaf-900 sm:text-lg">{name}</h3>
        <PurchasePanel product={product} />
      </div>
    </motion.article>
  )
}
