import type { Variant } from '../../types'
import { useLanguage } from '../../i18n/LanguageContext'

interface Props {
  variants: Variant[]
  value: string
  onChange: (id: string) => void
  name: string
}

export default function VariantSelector({ variants, value, onChange, name }: Props) {
  const { t, pick } = useLanguage()
  return (
    <div role="radiogroup" aria-label={t('product.size')} className="grid grid-cols-2 gap-1.5">
      {variants.map((v) => {
        const selected = v.id === value
        return (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${name} ${pick(v.label)}`}
            onClick={() => onChange(v.id)}
            className={`min-h-11 rounded-xl border-2 px-2 text-sm font-bold leading-tight transition active:scale-95 ${
              selected ? 'border-leaf-600 bg-leaf-50 text-leaf-700' : 'border-leaf-100 bg-white text-soil-700'
            }`}
          >
            {pick(v.label)}
          </button>
        )
      })}
    </div>
  )
}
