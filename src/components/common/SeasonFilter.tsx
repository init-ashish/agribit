import type { Season } from '../../types'
import { useLanguage } from '../../i18n/LanguageContext'

export type SeasonValue = Season | 'all'

interface Props {
  value: SeasonValue
  onChange: (s: SeasonValue) => void
}

const seasons: SeasonValue[] = ['all', 'rabi', 'kharif', 'zaid']

export default function SeasonFilter({ value, onChange }: Props) {
  const { t } = useLanguage()
  return (
    <div
      role="group"
      aria-label={t('shop.season')}
      className="grid grid-cols-4 gap-1 rounded-2xl bg-leaf-100 p-1"
    >
      {seasons.map((s) => (
        <button
          key={s}
          type="button"
          aria-pressed={value === s}
          onClick={() => onChange(s)}
          className={`min-h-11 rounded-xl px-1 text-xs font-bold leading-tight transition min-[380px]:text-sm ${
            value === s ? 'bg-mustard-500 text-leaf-900 shadow' : 'text-leaf-700'
          }`}
        >
          {t(`season.${s}`)}
        </button>
      ))}
    </div>
  )
}
