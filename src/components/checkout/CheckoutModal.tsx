import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { siteConfig } from '../../config/site.config'
import { useCart } from '../../context/CartContext'
import { useLanguage } from '../../i18n/LanguageContext'
import type { Address, Order, PaymentMethod } from '../../types'
import { buildOrder } from '../../utils/cart'
import { formatINR } from '../../utils/format'
import { loadJSON, saveJSON } from '../../utils/storage'
import { validateAddress, validateField } from '../../utils/validation'
import type { AddressErrors } from '../../utils/validation'
import { buildOrderMessage, buildWhatsAppLink } from '../../utils/whatsapp'
import Button from '../common/Button'
import Sheet from '../common/Sheet'
import AddressForm from './AddressForm'
import OrderSuccess from './OrderSuccess'
import OrderSummary from './OrderSummary'

const ADDRESS_KEY = 'agribit:address'
const PAYMENT_KEY = 'agribit:payment'

const emptyAddress = (): Address => ({
  name: '', mobile: '', village: '', postOffice: '', block: '', district: '',
  state: siteConfig.defaultState, pincode: '', landmark: '',
})

type Step = 1 | 2 | 3 | 'success'

interface Props {
  open: boolean
  onClose: () => void
}

function Wizard({ onClose }: { onClose: () => void }) {
  const { t, lang } = useLanguage()
  const { lines, total, dispatch, closeCart } = useCart()
  const [step, setStep] = useState<Step>(1)
  const [address, setAddress] = useState<Address>(() => ({ ...emptyAddress(), ...loadJSON<Partial<Address>>(ADDRESS_KEY, {}) }))
  const [payment, setPayment] = useState<PaymentMethod>(() => loadJSON<PaymentMethod>(PAYMENT_KEY, 'cod'))
  const [errors, setErrors] = useState<AddressErrors>({})
  const [order, setOrder] = useState<Order | null>(null)

  const onChange = (field: keyof Address, raw: string) => {
    const value = field === 'mobile' || field === 'pincode' ? raw.replace(/\D/g, '') : raw
    const next = { ...address, [field]: value }
    setAddress(next)
    if (errors[field]) setErrors((e) => ({ ...e, [field]: validateField(field, next) }))
  }
  const onBlur = (field: keyof Address) => setErrors((e) => ({ ...e, [field]: validateField(field, address) }))

  const toSummary = () => {
    const errs = validateAddress(address)
    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      const first = Object.keys(errs)[0]
      document.getElementById(`f-${first}`)?.focus()
      return
    }
    saveJSON(ADDRESS_KEY, address)
    saveJSON(PAYMENT_KEY, payment)
    setStep(2)
  }

  const confirm = () => {
    const placed = buildOrder(lines, address, payment)
    const link = buildWhatsAppLink(siteConfig.whatsappNumber, buildOrderMessage(placed, lang))
    window.open(link, '_blank', 'noopener,noreferrer')
    setOrder(placed)
    dispatch({ type: 'CLEAR' })
    setStep('success')
  }

  const done = () => {
    closeCart()
    onClose()
  }

  const stepNum = step === 'success' ? 3 : step
  const labels = [t('checkout.stepAddress'), t('checkout.stepReview'), t('checkout.stepConfirm')]

  const progress = step !== 'success' && (
    <div className="mt-3" aria-label={t('checkout.step', { n: stepNum })}>
      <ol className="flex gap-2">
        {labels.map((l, i) => (
          <li key={l} className="flex-1" aria-current={stepNum === i + 1 ? 'step' : undefined}>
            <div className={`h-2 rounded-full transition-colors ${stepNum >= i + 1 ? 'bg-leaf-600' : 'bg-leaf-100'}`} />
            <span className={`mt-1 block text-xs font-bold ${stepNum === i + 1 ? 'text-leaf-700' : 'text-soil-500'}`}>{i + 1}. {l}</span>
          </li>
        ))}
      </ol>
    </div>
  )

  let body
  let footer
  if (step === 'success' && order) {
    body = <OrderSuccess order={order} onDone={done} />
  } else if (step === 1) {
    body = <AddressForm address={address} errors={errors} payment={payment} onChange={onChange} onBlur={onBlur} onPaymentChange={setPayment} />
    footer = <Button size="lg" full onClick={toSummary}>{t('checkout.next')}</Button>
  } else if (step === 2) {
    body = <OrderSummary lines={lines} total={total} address={address} payment={payment} onEdit={() => setStep(1)} />
    footer = (
      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={() => setStep(1)}>{t('checkout.back')}</Button>
        <Button size="lg" full onClick={() => setStep(3)}>{t('checkout.next')}</Button>
      </div>
    )
  } else {
    // FUTURE: when siteConfig.enableOtp is true, render a Firebase Phone OTP step
    // here (verify address.mobile) and only show the confirm button once verified.
    body = (
      <div className="flex flex-col items-center gap-4 p-6 text-center">
        <MessageCircle className="size-16 text-[#25D366]" aria-hidden="true" />
        <p className="text-3xl font-extrabold text-leaf-700">{formatINR(total)}</p>
        <p className="text-soil-700">{t('checkout.confirmNote')}</p>
      </div>
    )
    footer = (
      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={() => setStep(2)}>{t('checkout.back')}</Button>
        <Button variant="whatsapp" size="lg" full onClick={confirm} disabled={lines.length === 0}>
          <MessageCircle className="size-5" aria-hidden="true" />
          {t('checkout.confirm')}
        </Button>
      </div>
    )
  }

  return (
    <Sheet open onClose={onClose} title={t('checkout.title')} headerExtra={progress || undefined} footer={footer}>
      {body}
    </Sheet>
  )
}

/** Mounts a fresh wizard each time it opens so state never leaks between orders. */
export default function CheckoutModal({ open, onClose }: Props) {
  return open ? <Wizard onClose={onClose} /> : null
}
