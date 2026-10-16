import { useLanguage } from '../../i18n/LanguageContext'

export default function LanguageToggle() {
  const { lang, setLang, t } = useLanguage()
  return (
    <div
      role="group"
      aria-label={t('lang.switchTo')}
      className="flex rounded-full bg-leaf-100 p-1 text-sm font-bold"
    >
      {(['hi', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
          className={`min-h-10 min-w-12 rounded-full px-3 transition ${
            lang === l ? 'bg-leaf-600 text-white shadow' : 'text-leaf-700'
          }`}
        >
          {l === 'hi' ? 'हिंदी' : 'EN'}
        </button>
      ))}
    </div>
  )
}
