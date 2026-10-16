import { CheckCircle2, XCircle } from 'lucide-react'
import { siteConfig } from '../../config/site.config'
import { useLanguage } from '../../i18n/LanguageContext'
import type { Address, PaymentMethod } from '../../types'
import { isServiceablePin, isValidPin } from '../../utils/validation'
import type { AddressErrors } from '../../utils/validation'

interface Props {
  address: Address
  errors: AddressErrors
  payment: PaymentMethod
  onChange: (field: keyof Address, value: string) => void
  onBlur: (field: keyof Address) => void
  onPaymentChange: (p: PaymentMethod) => void
}

const inputCls =
  'min-h-12 w-full rounded-xl border-2 bg-white px-3 text-base text-leaf-900 focus:border-leaf-600 focus:outline-none'

export default function AddressForm({ address, errors, payment, onChange, onBlur, onPaymentChange }: Props) {
  const { t, pick } = useLanguage()

  const field = (
    name: keyof Address,
    label: string,
    opts: { type?: string; inputMode?: 'numeric' | 'tel' | 'text'; autoComplete?: string; maxLength?: number; optional?: boolean } = {},
  ) => {
    const err = errors[name]
    const id = `f-${name}`
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="text-sm font-bold text-leaf-900">{label}</label>
        <input
          id={id}
          name={name}
          type={opts.type ?? 'text'}
          inputMode={opts.inputMode}
          autoComplete={opts.autoComplete}
          maxLength={opts.maxLength}
          value={address[name]}
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? `${id}-err` : undefined}
          onChange={(e) => onChange(name, e.target.value)}
          onBlur={() => onBlur(name)}
          className={`${inputCls} ${err ? 'border-red-500' : 'border-leaf-100'}`}
        />
        {err && <p id={`${id}-err`} className="text-sm font-semibold text-red-600">{pick(err)}</p>}
      </div>
    )
  }

  const pin = address.pincode.trim()
  const pinKnown = isValidPin(pin)
  const serviceable = pinKnown && isServiceablePin(pin)

  return (
    <div className="grid gap-3 p-4 sm:grid-cols-2">
      <div className="sm:col-span-2">{field('name', t('form.name'), { autoComplete: 'name' })}</div>
      {field('mobile', t('form.mobile'), { type: 'tel', inputMode: 'numeric', autoComplete: 'tel-national', maxLength: 10 })}
      {field('village', t('form.village'), { autoComplete: 'address-line1' })}
      {field('postOffice', t('form.postOffice'))}
      {field('block', t('form.block'))}
      {field('district', t('form.district'), { autoComplete: 'address-level2' })}
      <div className="flex flex-col gap-1">
        <label htmlFor="f-state" className="text-sm font-bold text-leaf-900">{t('form.state')}</label>
        <select
          id="f-state"
          value={address.state}
          onChange={(e) => onChange('state', e.target.value)}
          className={`${inputCls} border-leaf-100`}
        >
          {siteConfig.states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        {field('pincode', t('form.pincode'), { inputMode: 'numeric', autoComplete: 'postal-code', maxLength: 6 })}
        {pinKnown && (
          <p
            className={`mt-1 flex items-start gap-1 text-sm font-bold ${serviceable ? 'text-leaf-600' : 'text-red-600'}`}
            role="status"
          >
            {serviceable ? <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" /> : <XCircle className="size-5 shrink-0" aria-hidden="true" />}
            {serviceable ? t('form.pinOk') : t('form.pinNo')}
          </p>
        )}
      </div>
      <div className="sm:col-span-2">{field('landmark', t('form.landmark'))}</div>

      <fieldset className="sm:col-span-2">
        <legend className="mb-1 text-sm font-bold text-leaf-900">{t('form.payment')}</legend>
        <div className="grid grid-cols-2 gap-2">
          {(['cod', 'upi'] as const).map((p) => (
            <label
              key={p}
              className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border-2 px-3 font-bold has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-mustard-500 ${
                payment === p ? 'border-leaf-600 bg-leaf-50 text-leaf-700' : 'border-leaf-100 bg-white'
              }`}
            >
              <input type="radio" name="payment" value={p} checked={payment === p} onChange={() => onPaymentChange(p)} className="size-5 accent-leaf-600" />
              {t(`form.${p}`)}
            </label>
          ))}
        </div>
      </fieldset>
      <p className="text-sm text-soil-500 sm:col-span-2">{t('form.saved')}</p>
    </div>
  )
}
