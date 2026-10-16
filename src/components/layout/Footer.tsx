import { MapPin, MessageCircle, Phone } from 'lucide-react'
import { siteConfig } from '../../config/site.config'
import { useCart } from '../../context/CartContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { buildWhatsAppLink } from '../../utils/whatsapp'
import Button from '../common/Button'

export default function Footer() {
  const { t, pick } = useLanguage()
  const { count } = useCart()
  return (
    <footer className={`bg-soil-700 text-cream ${count > 0 ? 'pb-24 md:pb-0' : ''}`}>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-2">
        <div>
          <p className="text-2xl font-extrabold">{siteConfig.storeName}</p>
          <p className="text-mustard-400">{siteConfig.taglineHi}</p>
          <p className="text-sm text-cream/80">{siteConfig.taglineEn}</p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-extrabold">{t('footer.contact')}</h2>
          <p className="flex items-start gap-2">
            <MapPin className="mt-1 size-5 shrink-0 text-mustard-400" aria-hidden="true" />
            <span><span className="sr-only">{t('footer.address')}: </span>{pick(siteConfig.storeAddress)}</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="accent" href={`tel:${siteConfig.phone.replace(/[^\d+]/g, '')}`}>
              <Phone className="size-5" aria-hidden="true" />
              {t('footer.call')} · {siteConfig.phone}
            </Button>
            <Button variant="whatsapp" href={buildWhatsAppLink(siteConfig.whatsappNumber, t('wa.greeting'))} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-5" aria-hidden="true" />
              {t('footer.whatsapp')}
            </Button>
          </div>
        </div>
      </div>
      <p className="border-t border-cream/10 py-4 text-center text-sm text-cream/70">
        © {new Date().getFullYear()} {siteConfig.storeName}. {t('footer.rights')}
      </p>
    </footer>
  )
}
