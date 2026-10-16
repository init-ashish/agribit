import { ShoppingBasket } from 'lucide-react'
import { siteConfig } from '../../config/site.config'
import { useCart } from '../../context/CartContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { formatINR } from '../../utils/format'
import Button from '../common/Button'
import Sheet from '../common/Sheet'
import CartItem from './CartItem'

export default function CartDrawer({ onBuyNow }: { onBuyNow: () => void }) {
  const { isOpen, closeCart, lines, total } = useCart()
  const { t } = useLanguage()
  const belowMin = total < siteConfig.minOrder

  return (
    <Sheet
      open={isOpen}
      onClose={closeCart}
      title={t('cart.title')}
      mode="drawer"
      footer={
        lines.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-lg">
              <span className="font-semibold">{t('cart.subtotal')}</span>
              <span className="text-2xl font-extrabold text-leaf-700">{formatINR(total)}</span>
            </div>
            {belowMin && (
              <p className="text-sm font-semibold text-red-600" role="alert">
                {t('cart.minOrder', { amount: formatINR(siteConfig.minOrder), more: formatINR(siteConfig.minOrder - total) })}
              </p>
            )}
            <Button size="lg" full disabled={belowMin} onClick={onBuyNow}>
              {t('cart.buyNow')}
            </Button>
          </div>
        )
      }
    >
      {lines.length === 0 ? (
        <div className="flex flex-col items-center gap-2 p-10 text-center">
          <ShoppingBasket className="size-16 text-leaf-500" aria-hidden="true" />
          <p className="text-xl font-extrabold text-leaf-900">{t('cart.empty')}</p>
          <p className="text-soil-500">{t('cart.emptySub')}</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3 p-4">
          {lines.map((l) => (
            <CartItem key={`${l.product.id}:${l.variant.id}`} line={l} />
          ))}
        </ul>
      )}
    </Sheet>
  )
}
