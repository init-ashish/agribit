/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import en from './en.json'
import hi from './hi.json'
import { siteConfig } from '../config/site.config'
import type { Lang, LocalizedText } from '../types'

type Dict = Record<string, string>
type Vars = Record<string, string | number>

const dictionaries: Record<Lang, Dict> = { en, hi }
const STORAGE_KEY = 'agribit:lang'

interface LanguageValue {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
  /** Look up a UI string by key, with optional {placeholder} values */
  t: (key: string, vars?: Vars) => string
  /** Pick the current language from a LocalizedText */
  pick: (text: LocalizedText) => string
}

const LanguageContext = createContext<LanguageValue | null>(null)

function readStoredLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'en' || v === 'hi') return v
  } catch {
    /* storage unavailable */
  }
  return siteConfig.defaultLang
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.body.classList.toggle('lang-hi', lang === 'hi')
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* storage unavailable */
    }
  }, [lang])

  const t = useCallback(
    (key: string, vars?: Vars) => {
      let str = dictionaries[lang][key] ?? dictionaries.en[key] ?? key
      if (vars) {
        for (const [k, v] of Object.entries(vars)) str = str.replaceAll(`{${k}}`, String(v))
      }
      return str
    },
    [lang],
  )

  const pick = useCallback((text: LocalizedText) => text[lang] || text.en, [lang])

  const value = useMemo<LanguageValue>(
    () => ({
      lang,
      setLang: setLangState,
      toggleLang: () => setLangState((l) => (l === 'hi' ? 'en' : 'hi')),
      t,
      pick,
    }),
    [lang, t, pick],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return ctx
}
