import { MapPin, MessageCircle, ShoppingBasket } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../i18n/LanguageContext'

const steps = [
  { icon: ShoppingBasket, key: 'step1' },
  { icon: MapPin, key: 'step2' },
  { icon: MessageCircle, key: 'step3' },
] as const

export default function HowItWorks() {
  const { t } = useLanguage()
  return (
    <section id="how" className="bg-leaf-900 py-12 text-cream">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="mb-8 text-center text-2xl font-extrabold md:text-3xl">{t('how.title')}</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map(({ icon: Icon, key }, i) => (
            <motion.li
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.15, type: 'spring', stiffness: 120 }}
              className="relative flex items-center gap-4 rounded-3xl bg-leaf-700 p-5 md:flex-col md:text-center"
            >
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-mustard-500 text-leaf-900">
                <Icon className="size-7" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-mustard-400">{i + 1}</p>
                <h3 className="text-lg font-extrabold">{t(`how.${key}`)}</h3>
                <p className="text-sm text-leaf-100">{t(`how.${key}Sub`)}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
