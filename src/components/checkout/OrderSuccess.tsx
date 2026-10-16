import { motion } from 'framer-motion'
import { CheckCircle2, MessageCircle } from 'lucide-react'
import { siteConfig } from '../../config/site.config'
import { useLanguage } from '../../i18n/LanguageContext'
import type { Order } from '../../types'
import { buildOrderMessage, buildWhatsAppLink } from '../../utils/whatsapp'
import Button from '../common/Button'

export default function OrderSuccess({ order, onDone }: { order: Order; onDone: () => void }) {
  const { t, lang } = useLanguage()
  const link = buildWhatsAppLink(siteConfig.whatsappNumber, buildOrderMessage(order, lang))
  return (
    <div className="flex flex-col items-center gap-3 p-6 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
        <CheckCircle2 className="size-20 text-leaf-600" aria-hidden="true" />
      </motion.div>
      <h3 className="text-2xl font-extrabold text-leaf-900">{t('success.title')}</h3>
      <p className="text-soil-700">{t('success.sub')}</p>
      <div className="rounded-2xl bg-white px-6 py-3 ring-1 ring-leaf-100">
        <p className="text-sm text-soil-500">{t('success.orderId')}</p>
        <p className="text-xl font-extrabold tracking-wide text-leaf-700">{order.id}</p>
      </div>
      <p className="text-sm text-soil-500">{t('success.popupBlocked')}</p>
      <Button variant="whatsapp" href={link} target="_blank" rel="noopener noreferrer" full>
        <MessageCircle className="size-5" aria-hidden="true" />
        {t('success.reopen')}
      </Button>
      <Button variant="outline" full onClick={onDone}>{t('success.done')}</Button>
    </div>
  )
}
