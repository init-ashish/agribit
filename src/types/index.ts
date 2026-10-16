export type Lang = 'en' | 'hi'

export interface LocalizedText {
  en: string
  hi: string
}

export type Season = 'rabi' | 'kharif' | 'zaid'
export type PaymentMethod = 'cod' | 'upi'

export interface Variant {
  id: string
  label: LocalizedText
  weightKg: number
  price: number
  mrp: number
}

export interface Product {
  id: string
  category: string
  name: LocalizedText
  description: LocalizedText
  images: string[]
  season: Season
  badge?: LocalizedText
  variants: Variant[]
  inStock: boolean
  sowingInfo?: { seedRatePerAcre: LocalizedText; duration: LocalizedText }
}

export interface Category {
  id: string
  name: LocalizedText
  emoji: string
}

export interface CartItem {
  productId: string
  variantId: string
  qty: number
}

export interface Address {
  name: string
  mobile: string
  village: string
  postOffice: string
  block: string
  district: string
  state: string
  pincode: string
  landmark: string
}

export interface OrderLine {
  productName: LocalizedText
  variantLabel: LocalizedText
  qty: number
  unitPrice: number
}

export interface Order {
  id: string
  lines: OrderLine[]
  total: number
  address: Address
  payment: PaymentMethod
  createdAt: string
}
