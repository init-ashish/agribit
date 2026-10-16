import type { Lang } from '../types'

/**
 * Everything store-specific lives here. Edit and redeploy.
 */
export const siteConfig = {
  storeName: 'AgriBit',
  taglineHi: 'खेती अब उंगलियों पर',
  taglineEn: 'Seeds & farming at your fingertips',

  /** International format, digits only, no "+" (e.g. 919876543210) */
  whatsappNumber: '919999999999',
  /** Shown in the footer and used by the Call button */
  phone: '+91 99999 99999',
  storeAddress: {
    hi: 'AgriBit बीज भंडार, मुख्य बाज़ार, लखनऊ, उत्तर प्रदेश',
    en: 'AgriBit Beej Bhandar, Main Bazaar, Lucknow, Uttar Pradesh',
  },

  /** Orders are accepted only for these PIN codes. Replace with your delivery area. */
  serviceablePincodes: [
    '226001', '226002', '226003', '226010', '226016', '226021',
    '227105', '229001', '230001', '231001', '221001', '208001',
    // Bhagalpur, Bihar
    '812001', '812002', '812003', '812004', '812005', '812006', '812007', '813210',
  ],
  /** Minimum cart value (₹) to place an order. 0 = no minimum. */
  minOrder: 200,

  /** Values for the State dropdown in the checkout form */
  states: ['Uttar Pradesh', 'Bihar', 'Madhya Pradesh', 'Rajasthan', 'Haryana', 'Punjab', 'Uttarakhand'],
  defaultState: 'Uttar Pradesh',

  defaultLang: 'hi' as Lang,

  /** Hero video (put your file at public/videos/hero.mp4) and poster */
  heroVideo: '/videos/hero.mp4',
  heroPoster: '/images/hero-poster.jpg',

  /**
   * Future: set true after adding a Firebase Phone OTP step to
   * CheckoutModal (see the `otp` step hook-point there). Not implemented yet.
   */
  enableOtp: false,

  /** Brand colors — applied as CSS variables at startup (see main.tsx) */
  theme: {
    'leaf-50': '#eef7ec',
    'leaf-100': '#d7ecd2',
    'leaf-500': '#3f9a45',
    'leaf-600': '#2f7d32',
    'leaf-700': '#25632a',
    'leaf-900': '#123618',
    'mustard-400': '#f0b43a',
    'mustard-500': '#e3a21a',
    'mustard-600': '#c4870f',
    'soil-500': '#8a5a32',
    'soil-700': '#5c3b1f',
    cream: '#f6efe0',
  } as Record<string, string>,
}
