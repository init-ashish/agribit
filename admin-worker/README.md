# agribit-admin (Cloudflare Worker)

Backend for the site's `/admin` page. It holds the GitHub token and admin
password (as Worker secrets, never shipped to the browser) and commits
product edits straight to `src/data/products.json` and uploaded images to
`public/images/products/` on the `main` branch — which is exactly what
`.github/workflows/deploy.yml` watches, so saving in `/admin` triggers the
site's normal build-and-deploy Action.

## One-time setup

1. **GitHub token** — github.com → Settings → Developer settings →
   Personal access tokens → Fine-grained tokens → generate one scoped to
   *only* the `agribit` repository, with **Contents: Read and write**
   permission. Copy it.
2. **Cloudflare** — create a free account at dash.cloudflare.com if you
   don't have one.
3. From this folder:
   ```
   npm install
   npx wrangler login       # opens a browser to authorize
   npx wrangler secret put GITHUB_TOKEN      # paste the token from step 1
   npx wrangler secret put ADMIN_PASSWORD    # choose a password for /admin
   npx wrangler deploy
   ```
   `wrangler deploy` prints the Worker's URL, e.g.
   `https://agribit-admin.<your-subdomain>.workers.dev`.
4. Back in the main repo, set that URL as the `ADMIN_API_URL` **repository
   variable** (not secret — it's just a URL) at:
   github.com/init-ashish/agribit → Settings → Secrets and variables →
   Actions → Variables tab.
5. Push anything to `main` (or re-run the workflow) so the site rebuilds
   with the admin page wired to this Worker.

Visit `https://init-ashish.github.io/agribit/admin`, log in with the
password from step 3, and edit away — each save is a commit that
redeploys the live site in a minute or two.

## If you edit `wrangler.toml`

`GITHUB_REPO`, `GITHUB_BRANCH` and `ALLOWED_ORIGIN` are plain vars in
`wrangler.toml` (safe to commit). Re-run `npx wrangler deploy` after
changing them.
