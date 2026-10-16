import { siteConfig } from '../config/site.config'
import type { Address, LocalizedText } from '../types'

export type AddressErrors = Partial<Record<keyof Address, LocalizedText>>

const MOBILE_RE = /^[6-9]\d{9}$/
const PIN_RE = /^[1-9]\d{5}$/

const required: LocalizedText = { en: 'This field is required', hi: 'यह जानकारी ज़रूरी है' }

export const isValidMobile = (v: string): boolean => MOBILE_RE.test(v.trim())
export const isValidPin = (v: string): boolean => PIN_RE.test(v.trim())
export const isServiceablePin = (v: string): boolean =>
  siteConfig.serviceablePincodes.includes(v.trim())

const REQUIRED_FIELDS: (keyof Address)[] = [
  'name',
  'mobile',
  'village',
  'postOffice',
  'block',
  'district',
  'state',
  'pincode',
]

export function validateField(field: keyof Address, address: Address): LocalizedText | undefined {
  const value = address[field].trim()
  if (REQUIRED_FIELDS.includes(field) && !value) return required
  if (field === 'mobile' && !isValidMobile(value)) {
    return {
      en: 'Enter a valid 10-digit mobile number',
      hi: 'सही 10 अंकों का मोबाइल नंबर डालें',
    }
  }
  if (field === 'pincode') {
    if (!isValidPin(value)) {
      return { en: 'Enter a valid 6-digit PIN code', hi: 'सही 6 अंकों का पिन कोड डालें' }
    }
    if (!isServiceablePin(value)) {
      return {
        en: 'We do not deliver to this PIN code yet',
        hi: 'इस पिन कोड पर अभी डिलीवरी नहीं है',
      }
    }
  }
  return undefined
}

export function validateAddress(address: Address): AddressErrors {
  const errors: AddressErrors = {}
  for (const field of Object.keys(address) as (keyof Address)[]) {
    const err = validateField(field, address)
    if (err) errors[field] = err
  }
  return errors
}
