import { useEffect, useState } from 'react'
import { Plus, Trash2, UploadCloud, X } from 'lucide-react'
import Button from '../components/common/Button'
import { useToast } from '../components/common/Toast'
import { categories } from '../data/categories'
import type { Product, Season, Variant } from '../types'

const API_BASE = (import.meta.env.VITE_ADMIN_API_URL as string | undefined)?.replace(/\/$/, '')
const PW_KEY = 'agribit-admin-pw'
const SEASONS: Season[] = ['rabi', 'kharif', 'zaid']

function emptyVariant(productId: string, suffix: string, label: string, weightKg: number): Variant {
  return { id: `${productId}-${suffix}`, label: { en: label, hi: label }, weightKg, price: 0, mrp: 0 }
}

function emptyProduct(): Product {
  const id = `new-product-${Date.now()}`
  return {
    id,
    category: categories[0]?.id ?? '',
    name: { en: '', hi: '' },
    description: { en: '', hi: '' },
    images: [],
    season: 'rabi',
    variants: [
      emptyVariant(id, '250g', '250 g Packet', 0.25),
      emptyVariant(id, '1kg', '1 kg Packet', 1),
    ],
    inStock: true,
  }
}

/** Downscales + re-encodes as JPEG so uploads stay small enough for a single GitHub commit. */
function resizeImageToBase64(file: File, maxDim = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext('2d')
      URL.revokeObjectURL(url)
      if (!ctx) return reject(new Error('Canvas not supported'))
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Could not encode image'))
          const reader = new FileReader()
          reader.onload = () => resolve((reader.result as string).split(',')[1])
          reader.onerror = () => reject(new Error('Could not read image'))
          reader.readAsDataURL(blob)
        },
        'image/jpeg',
        quality,
      )
    }
    img.onerror = () => reject(new Error('Could not load image'))
    img.src = url
  })
}

export default function Admin() {
  const { showToast } = useToast()
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem(PW_KEY))
  const [products, setProducts] = useState<Product[] | null>(null)
  const [sha, setSha] = useState<string | null>(null)
  const [draft, setDraft] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const loading = authed && products === null && !error

  function authHeader(): Record<string, string> {
    return { Authorization: `Bearer ${sessionStorage.getItem(PW_KEY) ?? ''}` }
  }

  async function loadProducts() {
    try {
      const res = await fetch(`${API_BASE}/api/products`, { headers: authHeader() })
      if (res.status === 401) {
        sessionStorage.removeItem(PW_KEY)
        setAuthed(false)
        return
      }
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? 'Failed to load products')
      const data = (await res.json()) as { products: Product[]; sha: string }
      setProducts(data.products)
      setSha(data.sha)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch-on-auth
    if (authed) void loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed])

  function openProduct(p: Product) {
    setDraft(structuredClone(p))
  }

  function closeProduct() {
    setDraft(null)
  }

  function login() {
    sessionStorage.setItem(PW_KEY, password)
    setAuthed(true)
  }

  function logout() {
    sessionStorage.removeItem(PW_KEY)
    setAuthed(false)
    setProducts(null)
    closeProduct()
  }

  function selectNew() {
    const p = emptyProduct()
    setProducts((prev) => (prev ? [p, ...prev] : [p]))
    openProduct(p)
  }

  async function saveDraft() {
    if (!draft || !products || sha === null) return
    if (!draft.name.en.trim()) {
      showToast('Product name (English) is required')
      return
    }
    const nextProducts = products.some((p) => p.id === draft.id)
      ? products.map((p) => (p.id === draft.id ? draft : p))
      : [draft, ...products]
    setSaving(true)
    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: nextProducts, sha }),
      })
      const data = (await res.json()) as { sha?: string; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Save failed')
      setProducts(nextProducts)
      setSha(data.sha!)
      showToast('Saved — the site will redeploy in a minute or two')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function deleteProduct(id: string) {
    if (!products || sha === null) return
    if (!confirm('Delete this product? This saves immediately.')) return
    const nextProducts = products.filter((p) => p.id !== id)
    setSaving(true)
    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: nextProducts, sha }),
      })
      const data = (await res.json()) as { sha?: string; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Delete failed')
      setProducts(nextProducts)
      setSha(data.sha!)
      closeProduct()
      showToast('Deleted — the site will redeploy in a minute or two')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setSaving(false)
    }
  }

  async function uploadImage(file: File) {
    if (!draft) return
    setUploading(true)
    try {
      const base64 = await resizeImageToBase64(file)
      const res = await fetch(`${API_BASE}/api/upload-image`, {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: draft.id, mimeType: 'image/jpeg', contentBase64: base64 }),
      })
      const data = (await res.json()) as { path?: string; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      setDraft((d) => (d ? { ...d, images: [...d.images, data.path!] } : d))
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (!API_BASE) {
    return (
      <div className="mx-auto max-w-lg p-8 text-center">
        <h1 className="text-xl font-bold text-leaf-900">Admin not configured</h1>
        <p className="mt-2 text-soil-700">
          Set <code className="rounded bg-leaf-100 px-1">VITE_ADMIN_API_URL</code> to your deployed Worker URL and
          rebuild the site.
        </p>
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6">
        <h1 className="text-2xl font-bold text-leaf-900">AgriBit Admin</h1>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && login()}
          className="min-h-12 rounded-xl border-2 border-leaf-200 px-4 text-base"
          autoFocus
        />
        <Button onClick={login} full>
          Log in
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl p-4 pb-24">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-leaf-900">AgriBit Admin</h1>
        <button onClick={logout} className="text-sm font-semibold text-soil-500 underline">
          Log out
        </button>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-red-700">{error}</p>}
      {loading && <p className="text-soil-500">Loading…</p>}

      {products && !draft && (
        <div className="space-y-2">
          <Button onClick={selectNew} variant="outline" className="mb-2">
            <Plus className="size-4" /> New product
          </Button>
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => openProduct(p)}
              className="flex w-full items-center gap-3 rounded-xl border border-leaf-100 bg-white p-3 text-left hover:bg-leaf-50"
            >
              {p.images[0] && (
                <img src={p.images[0]} alt="" className="size-12 rounded-lg object-cover" />
              )}
              <div className="flex-1">
                <p className="font-semibold text-leaf-900">{p.name.en || '(untitled)'}</p>
                <p className="text-sm text-soil-500">
                  {p.category} · ₹{p.variants[0]?.price ?? '—'}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {draft && (
        <div className="space-y-5 rounded-2xl border border-leaf-100 bg-white p-4">
          <button onClick={closeProduct} className="text-sm font-semibold text-leaf-700 underline">
            ← Back to list
          </button>

          <div>
            <label className="block text-sm font-semibold text-soil-700">Images</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {draft.images.map((src, i) => (
                <div key={src} className="relative">
                  <img src={src} alt="" className="size-20 rounded-lg object-cover" />
                  <button
                    onClick={() => setDraft({ ...draft, images: draft.images.filter((_, j) => j !== i) })}
                    className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
              <label className="flex size-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-leaf-300 text-leaf-600">
                {uploading ? <span className="text-xs">Uploading…</span> : <UploadCloud className="size-6" />}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) void uploadImage(file)
                    e.target.value = ''
                  }}
                />
              </label>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-soil-700">Name (English)</span>
              <input
                className="mt-1 min-h-11 w-full rounded-xl border-2 border-leaf-200 px-3"
                value={draft.name.en}
                onChange={(e) => setDraft({ ...draft, name: { ...draft.name, en: e.target.value } })}
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-soil-700">Name (Hindi)</span>
              <input
                className="mt-1 min-h-11 w-full rounded-xl border-2 border-leaf-200 px-3"
                value={draft.name.hi}
                onChange={(e) => setDraft({ ...draft, name: { ...draft.name, hi: e.target.value } })}
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-soil-700">Description (English)</span>
              <textarea
                className="mt-1 w-full rounded-xl border-2 border-leaf-200 px-3 py-2"
                rows={3}
                value={draft.description.en}
                onChange={(e) => setDraft({ ...draft, description: { ...draft.description, en: e.target.value } })}
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-soil-700">Description (Hindi)</span>
              <textarea
                className="mt-1 w-full rounded-xl border-2 border-leaf-200 px-3 py-2"
                rows={3}
                value={draft.description.hi}
                onChange={(e) => setDraft({ ...draft, description: { ...draft.description, hi: e.target.value } })}
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="text-sm font-semibold text-soil-700">Category</span>
              <select
                className="mt-1 min-h-11 w-full rounded-xl border-2 border-leaf-200 px-3"
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.name.en}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-soil-700">Season</span>
              <select
                className="mt-1 min-h-11 w-full rounded-xl border-2 border-leaf-200 px-3"
                value={draft.season}
                onChange={(e) => setDraft({ ...draft, season: e.target.value as Season })}
              >
                {SEASONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 pt-7">
              <input
                type="checkbox"
                checked={draft.inStock}
                onChange={(e) => setDraft({ ...draft, inStock: e.target.checked })}
              />
              <span className="text-sm font-semibold text-soil-700">In stock</span>
            </label>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-soil-700">Variants &amp; prices</span>
              <button
                className="text-sm font-semibold text-leaf-700 underline"
                onClick={() =>
                  setDraft({
                    ...draft,
                    variants: [...draft.variants, emptyVariant(draft.id, `pack${draft.variants.length}`, 'New pack', 1)],
                  })
                }
              >
                + Add variant
              </button>
            </div>
            <div className="space-y-2">
              {draft.variants.map((v, i) => (
                <div key={v.id} className="flex flex-wrap items-center gap-2 rounded-xl bg-leaf-50 p-2">
                  <input
                    className="min-h-10 flex-1 rounded-lg border border-leaf-200 px-2 text-sm"
                    placeholder="Label (English)"
                    value={v.label.en}
                    onChange={(e) => {
                      const variants = draft.variants.slice()
                      variants[i] = { ...v, label: { ...v.label, en: e.target.value } }
                      setDraft({ ...draft, variants })
                    }}
                  />
                  <input
                    type="number"
                    className="min-h-10 w-24 rounded-lg border border-leaf-200 px-2 text-sm"
                    placeholder="Price ₹"
                    value={v.price}
                    onChange={(e) => {
                      const variants = draft.variants.slice()
                      variants[i] = { ...v, price: Number(e.target.value) }
                      setDraft({ ...draft, variants })
                    }}
                  />
                  <input
                    type="number"
                    className="min-h-10 w-24 rounded-lg border border-leaf-200 px-2 text-sm"
                    placeholder="MRP ₹"
                    value={v.mrp}
                    onChange={(e) => {
                      const variants = draft.variants.slice()
                      variants[i] = { ...v, mrp: Number(e.target.value) }
                      setDraft({ ...draft, variants })
                    }}
                  />
                  <button
                    onClick={() => setDraft({ ...draft, variants: draft.variants.filter((_, j) => j !== i) })}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    disabled={draft.variants.length <= 1}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button onClick={() => deleteProduct(draft.id)} className="text-sm font-semibold text-red-600 underline">
              Delete product
            </button>
            <Button onClick={saveDraft} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
