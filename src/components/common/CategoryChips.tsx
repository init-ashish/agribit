import type { Category } from '../../types'
import { useLanguage } from '../../i18n/LanguageContext'

interface Props {
  categories: Category[]
  value: string
  onChange: (id: string) => void
}

export default function CategoryChips({ categories, value, onChange }: Props) {
  const { t, pick } = useLanguage()
  const chips = [{ id: 'all', emoji: '🌱', label: t('shop.all') }, ...categories.map((c) => ({ id: c.id, emoji: c.emoji, label: pick(c.name) }))]
  return (
    <div
      role="group"
      aria-label={t('shop.categories')}
      className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1"
    >
      {chips.map((c) => (
        <button
          key={c.id}
          type="button"
          aria-pressed={value === c.id}
          onClick={() => onChange(c.id)}
          className={`flex min-h-12 shrink-0 items-center gap-2 rounded-full border-2 px-4 font-bold transition active:scale-95 ${
            value === c.id
              ? 'border-leaf-600 bg-leaf-600 text-white shadow-md'
              : 'border-leaf-100 bg-white text-leaf-900'
          }`}
        >
          <span aria-hidden="true">{c.emoji}</span>
          {c.label}
        </button>
      ))}
    </div>
  )
}
