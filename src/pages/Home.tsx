import { useMemo, useState } from 'react'
import { categories } from '../data/categories'
import { products } from '../data/products'
import { useLanguage } from '../i18n/LanguageContext'
import type { Product } from '../types'
import { matchesQuery } from '../utils/search'
import CartDrawer from '../components/cart/CartDrawer'
import CheckoutModal from '../components/checkout/CheckoutModal'
import CategoryChips from '../components/common/CategoryChips'
import HowItWorks from '../components/common/HowItWorks'
import SearchBar from '../components/common/SearchBar'
import SeasonFilter from '../components/common/SeasonFilter'
import type { SeasonValue } from '../components/common/SeasonFilter'
import TrustBadges from '../components/common/TrustBadges'
import HeroVideo from '../components/hero/HeroVideo'
import Footer from '../components/layout/Footer'
import FloatingWhatsApp from '../components/layout/FloatingWhatsApp'
import MobileBottomBar from '../components/layout/MobileBottomBar'
import Navbar from '../components/layout/Navbar'
import ProductGrid from '../components/product/ProductGrid'
import ProductModal from '../components/product/ProductModal'
import { useCart } from '../context/CartContext'

export default function Home() {
  const { t } = useLanguage()
  const { closeCart } = useCart()
  const [category, setCategory] = useState('all')
  const [season, setSeason] = useState<SeasonValue>('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Product | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === 'all' || p.category === category) &&
          (season === 'all' || p.season === season) &&
          matchesQuery(p, categories.find((c) => c.id === p.category), query),
      ),
    [category, season, query],
  )

  return (
    <>
      <Navbar />
      <main>
        <HeroVideo />
        <TrustBadges />
        <section id="products" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-12 pt-4">
          <h2 className="mb-4 text-2xl font-extrabold text-leaf-900 md:text-3xl">{t('shop.title')}</h2>
          <div className="mb-5 flex flex-col gap-3">
            <SearchBar value={query} onChange={setQuery} />
            <CategoryChips categories={categories} value={category} onChange={setCategory} />
            <SeasonFilter value={season} onChange={setSeason} />
            <p className="text-sm font-semibold text-soil-500" aria-live="polite">{t('shop.count', { n: filtered.length })}</p>
          </div>
          <ProductGrid products={filtered} onOpen={setSelected} />
        </section>
        <HowItWorks />
      </main>
      <Footer />
      <MobileBottomBar />
      <FloatingWhatsApp />
      <ProductModal product={selected} onClose={() => setSelected(null)} />
      <CartDrawer onBuyNow={() => { closeCart(); setCheckoutOpen(true) }} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  )
}
