import { BadgeCheck, Banknote, MessageCircle, Truck } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../i18n/LanguageContext'

const badges = [
  { icon: BadgeCheck, key: 'certified' },
  { icon: Banknote, key: 'cod' },
  { icon: Truck, key: 'delivery' },
  { icon: MessageCircle, key: 'whatsapp' },
] as const

export default function TrustBadges() {
  const { t } = useLanguage()
  return (
    <section aria-label="AgriBit" className="mx-auto max-w-6xl px-4 py-6">
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {badges.map(({ icon: Icon, key }, i) => (
          <motion.li
            key={key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="flex flex-col items-center gap-1 rounded-3xl bg-white p-4 text-center shadow-sm ring-1 ring-leaf-100"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-leaf-100 text-leaf-600">
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <span className="font-extrabold leading-tight text-leaf-900">{t(`trust.${key}`)}</span>
            <span className="text-sm text-soil-500">{t(`trust.${key}Sub`)}</span>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
