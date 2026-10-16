import { ShoppingCart, Sprout } from 'lucide-react'
import { siteConfig } from '../../config/site.config'
import { useCart } from '../../context/CartContext'
import { useLanguage } from '../../i18n/LanguageContext'
import LanguageToggle from '../common/LanguageToggle'

export default function Navbar() {
  const { count, openCart, addTick } = useCart()
  const { t } = useLanguage()
  return (
    <header className="sticky top-0 z-40 border-b border-leaf-100 bg-cream/80 pt-[env(safe-area-inset-top)] backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4" aria-label="Main">
        <a href="#top" className="flex items-center gap-2 text-lg font-extrabold text-leaf-700 min-[380px]:text-xl">
          <span className="grid size-10 place-items-center rounded-xl bg-leaf-600 text-white">
            <Sprout className="size-6" aria-hidden="true" />
          </span>
          {siteConfig.storeName}
        </a>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button
            type="button"
            onClick={openCart}
            aria-label={t('nav.openCart', { n: count })}
            className="relative grid size-12 place-items-center rounded-full bg-white text-leaf-700 shadow ring-1 ring-leaf-100 active:scale-95"
          >
            <span key={addTick} className={addTick > 0 ? 'animate-bounce-once' : ''}>
              <ShoppingCart aria-hidden="true" />
            </span>
            {count > 0 && (
              <span
                key={`b${addTick}`}
                className={`absolute -right-1 -top-1 grid min-w-6 place-items-center rounded-full bg-mustard-500 px-1 text-xs font-extrabold text-leaf-900 ${addTick > 0 ? 'animate-bounce-once' : ''}`}
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  )
}
