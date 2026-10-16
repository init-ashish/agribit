# AgriBit — खेती अब उंगलियों पर

Seeds & farming at your fingertips. A mobile-first, fully static agriculture storefront
(Vite + React + TypeScript + Tailwind v4 + Framer Motion). Orders are sent to your
WhatsApp — there is no backend and no login.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run lint
```

## What to edit

| I want to change…            | Edit                                                  |
| ---------------------------- | ----------------------------------------------------- |
| WhatsApp number, phone, address | `src/config/site.config.ts`                        |
| Delivery PIN codes, min order, states | `src/config/site.config.ts` (`serviceablePincodes`, `minOrder`, `states`) |
| Colors                       | `src/config/site.config.ts` → `theme`                 |
| Products, prices, images     | `src/data/products.ts`                                |
| Categories                   | `src/data/categories.ts`                              |
| Text (Hindi / English)       | `src/i18n/hi.json`, `src/i18n/en.json`                |
| Hero video / poster          | `public/videos/hero.mp4`, `public/images/hero-poster.jpg` |

### WhatsApp number
`whatsappNumber` is in international format, digits only, **no +**: `919876543210`.
Every order, the floating chat button and the footer button use it.

### Products and prices
Each product in `src/data/products.ts` has bilingual `name` / `description`, a `season`
(`rabi` | `kharif` | `zaid`), a `category` id from `categories.ts`, and a list of
`variants`. For each variant, `price` is what the customer pays and `mrp` is the struck-through
price; the discount % is calculated automatically. Set `inStock: false` to show "Out of Stock".
The `variants(...)` helper builds the 250 g / 1 kg / 5 kg packets plus one bora — or write the
variants array by hand for custom sizes.
The sample prices are placeholders. Replace them with your real rates.

### Images
Use any image URL (the samples are Unsplash placeholders) or put files in `public/images/`
and reference them as `/images/wheat.jpg`. Use square images, about 800×800 px. The first image
is the card photo; the rest appear in the product popup gallery.

### Hero video
Replace `public/videos/hero.mp4` (keep it under about 3 MB, 720p, muted) and
`public/images/hero-poster.jpg`. The current video is a sample placeholder. Visitors with
Data Saver on, or "reduce motion", see only the poster.

### Colors
Edit the `theme` object in `site.config.ts`. These values become CSS variables at startup,
so all `leaf-*`, `mustard-*`, `soil-*` and `cream` shades update everywhere.
For the installed-app color, also change `theme_color` in `vite.config.ts`.

### Phone verification (future)
`enableOtp` in `site.config.ts` is `false`. The order arriving from the customer's own
WhatsApp number acts as verification. `CheckoutModal.tsx` has a marked place before the
final confirm step where a Firebase Phone OTP step can be added. Nothing from Firebase is installed.

## PWA
The app has a manifest (green theme color) and a service worker, so it can be added to the
home screen. The icon is `public/pwa-icon.svg`. For best Android install support, you can
add 192×192 and 512×512 PNG icons and list them in `vite.config.ts`.

## Deploy free

**Netlify** — push to GitHub → *Add new site → Import from Git*. Build command
`npm run build`, publish directory `dist`. (Or drag the `dist` folder onto netlify.com/drop.)

**Vercel** — push to GitHub → *Add New Project → Import*. Vercel detects Vite
(build `npm run build`, output `dist`). Click Deploy.

No environment variables are needed. After changing products or config, commit and push
and the site redeploys.
