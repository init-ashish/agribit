import { Pencil } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import type { Address, PaymentMethod } from '../../types'
import type { CartLine } from '../../utils/cart'
import { formatINR } from '../../utils/format'

interface Props {
  lines: CartLine[]
  total: number
  address: Address
  payment: PaymentMethod
  onEdit: () => void
}

export default function OrderSummary({ lines, total, address: a, payment, onEdit }: Props) {
  const { t, pick } = useLanguage()
  return (
    <div className="flex flex-col gap-4 p-4">
      <section aria-label={t('summary.items')}>
        <h3 className="mb-2 font-extrabold text-leaf-900">{t('summary.items')}</h3>
        <ul className="divide-y divide-leaf-100 rounded-2xl bg-white ring-1 ring-leaf-100">
          {lines.map((l) => (
            <li key={`${l.product.id}:${l.variant.id}`} className="flex items-start justify-between gap-3 p-3">
              <div>
                <p className="font-bold">{pick(l.product.name)}</p>
                <p className="text-sm text-soil-500">{pick(l.variant.label)} × {l.qty}</p>
              </div>
              <span className="font-extrabold">{formatINR(l.lineTotal)}</span>
            </li>
          ))}
          <li className="flex items-center justify-between p-3 text-lg">
            <span className="font-bold">{t('summary.total')}</span>
            <span className="text-2xl font-extrabold text-leaf-700">{formatINR(total)}</span>
          </li>
        </ul>
      </section>
      <section className="rounded-2xl bg-white p-3 ring-1 ring-leaf-100">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="font-extrabold text-leaf-900">{t('summary.deliverTo')}</h3>
          <button type="button" onClick={onEdit} className="flex min-h-11 items-center gap-1 rounded-xl px-3 font-bold text-leaf-700 active:scale-95">
            <Pencil className="size-4" aria-hidden="true" />
            {t('checkout.edit')}
          </button>
        </div>
        <p className="font-bold">{a.name} · {a.mobile}</p>
        <p>{a.village}, {t('form.postOffice')}: {a.postOffice}, {a.block}, {a.district}, {a.state} - {a.pincode}</p>
        {a.landmark && <p className="text-soil-500">{t('form.landmark')}: {a.landmark}</p>}
        <p className="mt-2 font-bold">{t('summary.payment')}: {t(`form.${payment}`)}</p>
      </section>
    </div>
  )
}
