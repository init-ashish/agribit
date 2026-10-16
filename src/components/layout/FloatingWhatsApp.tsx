import { MessageCircle } from 'lucide-react'
import { siteConfig } from '../../config/site.config'
import { useCart } from '../../context/CartContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { buildWhatsAppLink } from '../../utils/whatsapp'

export default function FloatingWhatsApp() {
  const { t } = useLanguage()
  const { count } = useCart()
  return (
    <a
      href={buildWhatsAppLink(siteConfig.whatsappNumber, t('wa.greeting'))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('wa.floating')}
      className={`fixed right-4 z-30 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition-all active:scale-90 ${
        count > 0 ? 'bottom-24 md:bottom-6' : 'bottom-6'
      }`}
    >
      <MessageCircle className="size-7" aria-hidden="true" />
    </a>
  )
}
