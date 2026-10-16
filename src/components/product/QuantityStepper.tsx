import { Minus, Plus } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'

interface Props {
  value: number
  onChange: (qty: number) => void
  min?: number
  max?: number
  /** Allow going below min to 0 (used in the cart to remove) */
  className?: string
}

export default function QuantityStepper({ value, onChange, min = 1, max = 99, className = '' }: Props) {
  const { t } = useLanguage()
  const btn =
    'grid size-11 place-items-center rounded-xl bg-white text-leaf-700 shadow-sm ring-1 ring-leaf-100 transition active:scale-90 disabled:opacity-40'
  return (
    <div className={`inline-flex items-center gap-1 rounded-2xl bg-leaf-100 p-1 ${className}`} role="group" aria-label={t('product.quantity')}>
      <button type="button" className={btn} aria-label={t('product.decrease')} disabled={value <= min} onClick={() => onChange(value - 1)}>
        <Minus className="size-5" aria-hidden="true" />
      </button>
      <span className="min-w-10 text-center text-lg font-extrabold text-leaf-900" aria-live="polite">{value}</span>
      <button type="button" className={btn} aria-label={t('product.increase')} disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Plus className="size-5" aria-hidden="true" />
      </button>
    </div>
  )
}
