import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { siteConfig } from '../../config/site.config'
import { useLanguage } from '../../i18n/LanguageContext'
import Button from '../common/Button'

interface NetworkInformation {
  saveData?: boolean
}

function shouldUsePosterOnly(): boolean {
  const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection
  return Boolean(conn?.saveData) || window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const particles = [
  { e: '🍃', left: '8%', top: '70%', delay: 0, dur: 7, size: '1.6rem' },
  { e: '🌾', left: '22%', top: '82%', delay: 1.5, dur: 9, size: '2rem' },
  { e: '🌱', left: '40%', top: '75%', delay: 3, dur: 8, size: '1.5rem' },
  { e: '🍃', left: '58%', top: '85%', delay: 0.8, dur: 10, size: '1.8rem' },
  { e: '🫘', left: '74%', top: '72%', delay: 2.2, dur: 7.5, size: '1.2rem' },
  { e: '🌾', left: '90%', top: '80%', delay: 4, dur: 9, size: '2rem' },
]

const scrollToProducts = () => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })

export default function HeroVideo() {
  const { t } = useLanguage()
  const posterOnly = shouldUsePosterOnly()

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-leaf-900 text-white">
      {posterOnly ? (
        <img src={siteConfig.heroPoster} alt="" className="absolute inset-0 -z-20 size-full object-cover" />
      ) : (
        <video
          className="absolute inset-0 -z-20 size-full object-cover"
          src={siteConfig.heroVideo}
          poster={siteConfig.heroPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-leaf-900 via-leaf-900/50 to-leaf-900/20" />

      {!posterOnly && (
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          {particles.map((p, i) => (
            <span
              key={i}
              className="absolute animate-float opacity-70"
              style={{ left: p.left, top: p.top, fontSize: p.size, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }}
            >
              {p.e}
            </span>
          ))}
        </div>
      )}

      <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 inline-block rounded-full bg-mustard-500 px-4 py-1 text-sm font-extrabold text-leaf-900"
        >
          {siteConfig.taglineHi}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-7xl"
        >
          {t('hero.title1')}
          <br />
          <span className="text-mustard-400">{t('hero.title2')}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 max-w-xl text-lg text-cream/90 md:text-xl"
        >
          {t('hero.sub')}
          <span className="mt-1 block text-base text-cream/70">{siteConfig.taglineEn}</span>
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }} className="mt-8">
          <Button variant="accent" size="lg" onClick={scrollToProducts}>
            {t('hero.cta')}
            <ChevronDown className="size-5" aria-hidden="true" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
