import type { Product } from '../types'
import raw from './products.json'

/**
 * Product data lives in ./products.json, not here — it's edited by the
 * admin page (see src/pages/Admin.tsx) via commits to this file.
 * Images are either absolute URLs or paths relative to the site's base
 * (e.g. "images/products/wheat-1.jpg") for files uploaded through the admin.
 */
const withBase = (src: string): string =>
  /^https?:\/\//.test(src) ? src : `${import.meta.env.BASE_URL}${src}`

export const products: Product[] = (raw as Product[]).map((p) => ({
  ...p,
  images: p.images.map(withBase),
}))
