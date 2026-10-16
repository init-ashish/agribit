import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { formatINR } from '../../utils/format'

export default function MobileBottomBar() {
  const { count, total, openCart, isOpen } = useCart()
  const { t } = useLanguage()
  return (
    <AnimatePresence>
      {count > 0 && !isOpen && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed inset-x-0 bottom-0 z-30 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
        >
          <button
            type="button"
            onClick={openCart}
            className="flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl bg-leaf-600 px-4 font-bold text-white shadow-xl shadow-leaf-900/40 active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="size-5" aria-hidden="true" />
              {t(count === 1 ? 'cart.item' : 'cart.items', { n: count })} • {formatINR(total)}
            </span>
            <span className="rounded-xl bg-mustard-500 px-3 py-1.5 text-leaf-900">{t('cart.viewCart')}</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
