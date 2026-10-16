import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useMediaQuery } from './useMediaQuery'

interface SheetProps {
  open: boolean
  onClose: () => void
  title: string
  /** modal: bottom sheet → centered dialog. drawer: bottom sheet → right drawer */
  mode?: 'modal' | 'drawer'
  wide?: boolean
  children: ReactNode
  /** Optional sticky footer inside the panel */
  footer?: ReactNode
  /** Extra header content under the title (e.g. progress bar) */
  headerExtra?: ReactNode
}

let lockCount = 0

/** Accessible dialog shell: backdrop, Esc to close, scroll lock, focus handling. */
export default function Sheet({ open, onClose, title, mode = 'modal', wide, children, footer, headerExtra }: SheetProps) {
  const { t } = useLanguage()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    lockCount++
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      lockCount--
      if (lockCount === 0) document.body.style.overflow = ''
      previous?.focus?.()
    }
  }, [open, onClose])

  const initial =
    mode === 'drawer' && isDesktop
      ? { x: '100%' }
      : isDesktop
        ? { opacity: 0, scale: 0.96 }
        : { y: '100%' }
  const animate = { x: 0, y: 0, opacity: 1, scale: 1 }

  const layout =
    mode === 'drawer'
      ? 'items-end md:items-stretch md:justify-end'
      : 'items-end md:items-center md:justify-center'
  const size =
    mode === 'drawer'
      ? 'max-h-[92dvh] rounded-t-3xl md:h-full md:max-h-none md:w-[26rem] md:rounded-none md:rounded-l-3xl'
      : `max-h-[94dvh] rounded-t-3xl md:rounded-3xl ${wide ? 'md:w-[56rem]' : 'md:w-[34rem]'}`

  return (
    <AnimatePresence>
      {open && (
        <div className={`fixed inset-0 z-50 flex ${layout}`}>
          <motion.div
            className="absolute inset-0 bg-leaf-900/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            className={`relative flex w-full flex-col bg-cream shadow-2xl outline-none ${size}`}
            initial={initial}
            animate={animate}
            exit={initial}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
          >
            <div className="border-b border-leaf-100 px-4 pb-3 pt-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-extrabold text-leaf-900">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={t('product.close')}
                  className="grid size-11 place-items-center rounded-full bg-white text-leaf-900 shadow active:scale-95"
                >
                  <X aria-hidden="true" />
                </button>
              </div>
              {headerExtra}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
            {footer && (
              <div className="border-t border-leaf-100 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
