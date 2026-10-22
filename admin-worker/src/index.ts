/**
 * Tiny API that lets the /admin page in the site commit product edits
 * straight to GitHub. The GitHub token and admin password live only here
 * (as Worker secrets), never in the browser bundle.
 *
 * Every push this makes lands on `main`, which is exactly what the
 * existing GitHub Actions workflow (.github/workflows/deploy.yml) watches
 * to rebuild and redeploy the site — so saving in the admin page is what
 * triggers the Action.
 */

interface Env {
  GITHUB_REPO: string // "owner/repo"
  GITHUB_BRANCH: string // "main"
  ALLOWED_ORIGIN: string // e.g. "https://init-ashish.github.io"
  GITHUB_TOKEN: string // secret
  ADMIN_PASSWORD: string // secret
}

const PRODUCTS_PATH = 'src/data/products.json'
const MAX_UPLOAD_BYTES = 1_500_000 // GitHub Contents API is only reliable under ~1MB
const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

function corsHeaders(env: Env): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    Vary: 'Origin',
  }
}

function json(data: unknown, status: number, env: Env): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(env) },
  })
}

function requireAuth(request: Request, env: Env): Response | null {
  const header = request.headers.get('Authorization') ?? ''
  const password = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!env.ADMIN_PASSWORD || password !== env.ADMIN_PASSWORD) {
    return json({ error: 'Unauthorized' }, 401, env)
  }
  return null
}

async function ghFetch(env: Env, path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/contents/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'agribit-admin-worker',
      ...(init.headers ?? {}),
    },
  })
}

async function getProducts(env: Env): Promise<Response> {
  const res = await ghFetch(env, `${PRODUCTS_PATH}?ref=${env.GITHUB_BRANCH}`)
  if (!res.ok) return json({ error: 'Failed to read products.json from GitHub' }, 502, env)
  const file = (await res.json()) as { content: string; sha: string }
  const text = Buffer.from(file.content.replace(/\n/g, ''), 'base64').toString('utf-8')
  return json({ products: JSON.parse(text), sha: file.sha }, 200, env)
}

async function putProducts(request: Request, env: Env): Promise<Response> {
  const body = (await request.json()) as { products: unknown; sha: string }
  if (!Array.isArray(body.products) || typeof body.sha !== 'string') {
    return json({ error: 'Expected { products: [...], sha }' }, 400, env)
  }
  const content = Buffer.from(JSON.stringify(body.products, null, 2) + '\n', 'utf-8').toString('base64')
  const res = await ghFetch(env, PRODUCTS_PATH, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Update products via admin page',
      content,
      sha: body.sha,
      branch: env.GITHUB_BRANCH,
    }),
  })
  if (res.status === 409) {
    return json({ error: 'Someone else saved in the meantime — reload and retry' }, 409, env)
  }
  if (!res.ok) {
    const detail = await res.text()
    return json({ error: 'GitHub commit failed', detail }, 502, env)
  }
  const result = (await res.json()) as { content: { sha: string } }
  return json({ sha: result.content.sha }, 200, env)
}

function slug(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'product'
}

async function uploadImage(request: Request, env: Env): Promise<Response> {
  const body = (await request.json()) as { productId?: string; mimeType?: string; contentBase64?: string }
  const ext = body.mimeType ? EXT_BY_MIME[body.mimeType] : undefined
  if (!body.productId || !ext || !body.contentBase64) {
    return json({ error: 'Expected { productId, mimeType: image/jpeg|png|webp, contentBase64 }' }, 400, env)
  }
  const approxBytes = (body.contentBase64.length * 3) / 4
  if (approxBytes > MAX_UPLOAD_BYTES) {
    return json({ error: 'Image too large — resize it under ~1.5MB before uploading' }, 413, env)
  }
  const path = `public/images/products/${slug(body.productId)}-${Date.now()}.${ext}`
  const res = await ghFetch(env, path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `Add product image for ${body.productId}`,
      content: body.contentBase64,
      branch: env.GITHUB_BRANCH,
    }),
  })
  if (!res.ok) {
    const detail = await res.text()
    return json({ error: 'GitHub upload failed', detail }, 502, env)
  }
  return json({ path: path.replace(/^public\//, '') }, 200, env)
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(env) })
    }

    const authError = requireAuth(request, env)
    if (authError) return authError

    const url = new URL(request.url)
    try {
      if (url.pathname === '/api/products' && request.method === 'GET') return await getProducts(env)
      if (url.pathname === '/api/products' && request.method === 'PUT') return await putProducts(request, env)
      if (url.pathname === '/api/upload-image' && request.method === 'POST') return await uploadImage(request, env)
      return json({ error: 'Not found' }, 404, env)
    } catch (err) {
      return json({ error: 'Unexpected error', detail: String(err) }, 500, env)
    }
  },
}
