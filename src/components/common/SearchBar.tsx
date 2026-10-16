import { Search, X } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'

interface Props {
  value: string
  onChange: (v: string) => void
}

export default function SearchBar({ value, onChange }: Props) {
  const { t } = useLanguage()
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-leaf-600" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('shop.search')}
        aria-label={t('shop.searchLabel')}
        className="min-h-12 w-full rounded-2xl border-2 border-leaf-100 bg-white pl-12 pr-12 text-base text-leaf-900 placeholder:text-soil-500/60 focus:border-leaf-600 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label={t('shop.clearSearch')}
          className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-soil-500"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
