import type { Product } from '../../types'
import { useLanguage } from '../../i18n/LanguageContext'
import ProductCard from './ProductCard'

interface Props {
  products: Product[]
  onOpen: (product: Product) => void
}

export default function ProductGrid({ products, onOpen }: Props) {
  const { t } = useLanguage()
  if (products.length === 0) {
    return (
      <p className="rounded-3xl bg-white p-8 text-center text-lg font-semibold text-soil-500" role="status">
        🌱 {t('shop.empty')}
      </p>
    )
  }
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onOpen={onOpen} />
      ))}
    </div>
  )
}
