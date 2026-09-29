# Pranite Essentials — *Where nature meets science*

Next.js storefront for **Green Pranite by Pranite Essentials**, rebuilt from
[praniteessentials.com](https://www.praniteessentials.com) with a calm, botanical,
premium feel and animation tuned to stay smooth on 3–4-year-old phones.

| | |
|---|---|
| Framework | Next.js 15 (App Router) · React 19 · TypeScript |
| Styling | Tailwind CSS 4 (design tokens in `src/app/globals.css`) |
| Motion | Motion 13 (`LazyMotion` + `m`) for UI, GSAP 3 + ScrollTrigger + SplitText for storytelling |
| Fonts | Fraunces (headlines) + Manrope (body) via `next/font`, self-hosted |
| Images | `next/image` → AVIF / WebP at the exact rendered size |

## Getting started

```bash
npm install
cp .env.example .env.local   # then add the Storefront token, see "Shopify (headless)" below
npm run dev                  # http://localhost:3000
```

```bash
npm run build && npm start   # production build (product pages prerender from Shopify, refresh every 5 min)
npm run lint                 # ESLint
npm run typecheck            # tsc --noEmit
```

The splash plays once per browser session on the homepage. To see it again,
open a new tab/private window, or run `sessionStorage.clear()` and reload.

## Pages

| Route | Notes |
|---|---|
| `/` | Splash → hero → philosophy (brand film) → Discover Tanora → Science of True Glow → marquee → Pranite Standard → track order |
| `/catalog` | All Shopify products (with a “more on the way” card while the range is small) |
| `/products/[handle]` | Shopify product: gallery, price (+ sale price), variant picker, purchase box + mobile sticky add-to-cart; editorial sections (benefits, master blend, before/after) when the product has content; FAQ, Product JSON-LD |
| `/about`, `/contact`, `/faq` | Content migrated from the live site; FAQ emits FAQPage JSON-LD |
| `/track-order` | Order lookup (see “Track order”) |
| `/cart` | Shopify cart → Shopify hosted checkout (see “Shopify (headless)”) |
| `/checkout` | Forwards the cart to Shopify checkout (kept for old links) |
| `/policies/[slug]` | privacy-policy, terms-of-service, shipping-policy, refund-policy, contact-information, legal-notice |

Old Shopify URLs redirect permanently (`/collections/*`, `/pages/about-us`,
`/pages/contact`, `/pages/faq`); `/products/<handle>` and `/policies/<slug>`
keep their exact Shopify paths, so existing links and search rankings carry over.

## Project structure

```
src/
  app/                    routes, layout, template (page transitions), sitemap/robots/manifest, icons
  assets/images/          brand + product images (static imports → auto width/height + blur)
  components/
    cart/                 CartProvider (Shopify cart via Server Actions), drawer, cart page, checkout button
    decor/                LeafMark (brand sprout), botanical SVG accents, wave, circular text
    forms/                ContactForm, TrackOrder
    home/                 Hero, Philosophy, BrandFilm, TanoraHighlight, ScienceOfGlow, Marquee, PraniteStandard, TrackOrderBand
    icons/                UI icons (24px) + botanical line icons (48px, self-drawing)
    layout/               Header, MobileMenu, Footer, PageHero
    motion/               MotionProvider, Reveal / RevealGroup / RevealItem, InViewClass
    product/              ProductGallery, ProductPurchase, ProductCard, product page sections
    splash/               SplashScript (head), SplashScreen
    ui/                   Button, Logo, SectionHeading, Accordion, Breadcrumbs, RichText
  content/                site.ts (contact, nav, values) · products.ts (editorial product sections) · faq.ts · policies.ts
  lib/
    shopify/              Storefront API client (shopifyFetch), GraphQL queries, types
    catalog.ts            data layer: Shopify product → Product (+ editorial content)
    cart-actions.ts       cart Server Actions (cart id in an httpOnly cookie)
    gsap.ts · splash.ts · utils.ts
public/media/             brand film (mp4) + poster
```

## Design system

Colours come from the TANORA packaging (forest-green box, lime leaf pattern,
citrus, gold foil), set on warm cream rather than white. No pure black or white.

| Token | Hex | Use |
|---|---|---|
| `forest-700` | `#1f4a2c` | Primary: buttons, headings accents (9.4:1 on cream) |
| `forest-800/900` | `#1b3b27` / `#163020` | Dark sections, footer |
| `sage-100…400` | `#e9eee0` → `#9db08a` | Soft section backgrounds |
| `leaf-300…500` | `#bfdd95` → `#7fb23e` | Leaf accents |
| `citrus-400/500` | `#f2a650` / `#e8892b` | Accents, citrus CTA on dark (decorative on light) |
| `citrus-700` | `#a5520f` | Small orange text on cream (5.1:1) |
| `gold-400/600` | `#c9a45e` / `#8a6a2f` | Credential badges |
| `cream-50/100` | `#fdfbf7` / `#faf6ee` | Page + card backgrounds |
| `ink-900 / 500` | `#1e2520` / `#5b645c` | Body text / muted text (5.7:1) |

Type: `.text-display`, `.text-h2`, `.text-h3`, `.text-lead` are fluid (`clamp`);
`.eyebrow` for small caps labels; `.italic-accent` for the soft italic Fraunces
accent words.

## Animation architecture

**Motion** (UI): page transitions (`app/template.tsx`), scroll reveals
(`Reveal`, `RevealGroup`), cart drawer, mobile menu, accordion, gallery
cross-fade, add-to-cart feedback, cart badge.
It runs through `LazyMotion` with **asynchronously loaded features**, so only a
tiny core ships up front, and `strict` mode prevents accidental heavy imports.

**GSAP** (storytelling): splash timeline, hero (SplitText line reveal + parallax),
philosophy quote that “reads itself” on scroll, Tanora scroll-scrubbed wordmark,
Science of True Glow progress ring / active steps.
GSAP only ships in the homepage chunk; the splash imports GSAP core
dynamically **only** when it's actually going to play.

**Performance rules followed everywhere**

- Only `transform` and `opacity` are animated (plus SVG stroke offsets); no layout-affecting animation.
- The hero image is never hidden, so it paints immediately (LCP).
- The first page load is not transition-animated; only client navigations are.
- Sticky storytelling uses native `position: sticky`, not JS pinning.
- Icons draw themselves with a CSS transition, not per-frame JS.
- The brand film uses `preload="none"`, plays only while on screen, and always has a pause button.
- **`prefers-reduced-motion`**: no splash, GSAP sets final states, Motion keeps opacity fades only, CSS loops stop.
- **Low-power devices** (`Save-Data`, ≤ 2 GB RAM or < 4 CPU cores → `html[data-lite]`):
  scroll-scrubbed effects, backdrop blur and idle floats are skipped.
- **No JavaScript**: all content is visible (`<noscript>` override + `html.js` gating).

## Replacing or adding images

All brand/product images live in **`src/assets/images/`** and are imported
statically, which gives `next/image` their dimensions and a blur placeholder
automatically. Current files (all taken from the live site):

| File | Used for |
|---|---|
| `pranite-logo.png` / `pranite-logo-light.png` | Header / footer + splash (transparent cut-outs of the site logo) |
| `tanora-lifestyle.jpg` | Hero |
| `tanora-key-benefits.jpg` | Spare |
| `tanora-key-ingredients.jpg` | About page |
| `tanora-before-after.jpg` | “Why Tanora?” (product page) |
| `tanora-bathing-bar.jpg` | Discover Tanora card (homepage) |

**Product photos** (gallery, catalog cards, cart thumbnails) come from **Shopify**:
edit them in Shopify admin → Products. The first image is shown filling the
frame (use a photograph); the others are shown whole, so text-bearing graphics
are never cropped. Add alt text to each image in Shopify for accessibility.
| `premium-skincare-badges.png` | Spare (badges are rebuilt in code as icons) |
| `src/app/icon.png`, `apple-icon.png` | Favicon / home-screen icon |
| `public/media/brand-film.mp4` + `brand-film-poster.webp` | Brand film |

**To swap an image for a better version** (e.g. a high-res photo shoot):
replace the file keeping the **same file name**. Width/height update
automatically. Recommended: ≥ 2000 px on the long edge, sRGB JPG/PNG. No need
to pre-convert to WebP/AVIF; `next/image` does it.


**Favicon:** replace `src/app/icon.png` (192×192) and `src/app/apple-icon.png` (180×180).

## Shopify (headless)

Shopify is the commerce backend; this Next.js app is the storefront.

| What | Where it comes from |
|---|---|
| Products, prices (INR), sale prices, variants, stock, photos, description, SEO | Shopify **Storefront API** (GraphQL), `src/lib/shopify/` |
| Cart | Shopify **Cart API**, via Server Actions in `src/lib/cart-actions.ts`; the cart id is kept in an httpOnly cookie (`pranite_cart`, 10 days) |
| Checkout & payment | Shopify's hosted checkout (`cart.checkoutUrl`), with no custom payment page |
| Storytelling sections (benefits, master blend, before/after, promise) | `src/content/products.ts`, matched by **Shopify tag** (`TANORA`) |
| Badges | Shopify tags: `new` → “New”, `best value` → “Best value”, `bestseller` → “Bestseller” |

- **Caching:** product data is cached and refreshed in the background every
  5 minutes (`PRODUCTS_REVALIDATE_SECONDS` in `src/lib/shopify/index.ts`). A price
  change in Shopify shows up within ~5 minutes; the cart and checkout are always live.
- **New products** appear in the catalog within 5 minutes and get their own page
  automatically. Tag them `TANORA` (or add a new entry in `src/content/products.ts`)
  to give them the full storytelling page; otherwise they get a clean page built
  from their Shopify description.
- **Security:** only the Storefront API token is used, server-side (no
  `NEXT_PUBLIC_` prefix). Never add an Admin API token (`shpat_…`) to this project.

### Setup

1. **Create the Storefront API token.** In Shopify admin → *Sales channels* →
   add the **Headless** channel (free, by Shopify) → *Create storefront* →
   *Storefront API* → *Manage* permissions and make sure these are enabled:
   product listings, product inventory, checkouts (read/write), and tags. Copy the
   **public access token**.
2. **Publish products to the Headless channel** (Products → select all → *Include
   in sales channels* → Headless). Products not published there are invisible to this site.
3. **Environment variables**: set these locally in `.env.local` and in
   **Vercel → Project → Settings → Environment Variables** (Production and Preview), then redeploy:

   | Variable | Value |
   |---|---|
   | `SHOPIFY_STORE_DOMAIN` | `jx9k0m-fn.myshopify.com` |
   | `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | the public token from step 1 |
   | `SHOPIFY_STOREFRONT_API_VERSION` | `2026-07` (Shopify retires versions after 12 months) |
   | `NEXT_PUBLIC_SITE_URL` | `https://pranite-essentials.vercel.app` (later `https://www.praniteessentials.com`) |
   | `NEXT_PUBLIC_SHOPIFY_ACCOUNT_URL` | `https://shopify.com/76863570134/account` |

   Without a token, Shopify still answers product and cart queries (“tokenless”
   access, with lower limits), so local development works right away, but set
   the token for production.

### Testing

1. `/catalog` lists the Shopify products with the same prices as Shopify admin.
2. Open a product → *Add to cart* → the drawer shows the item; change the quantity,
   reload the page (the cart is still there), open a new tab (same cart).
3. *Checkout* → you land on Shopify's checkout (`…/checkouts/cn/…`) with the same items.
   To test a full order without paying, enable **Bogus Gateway** in Settings →
   Payments (test mode), pay with card `1`, then switch it off again.
4. After the order, return to the site: the cart is empty (Shopify closed it).

⚠️ **Before pointing `www.praniteessentials.com` at Vercel:** `checkoutUrl`
uses the store's *primary domain* (currently `praniteessentials.com`, which is
Shopify-hosted). Once that domain points at this Next.js site, checkout would
land here instead. First add a sub-domain such as `shop.praniteessentials.com`
in Shopify → Settings → Domains and make it the primary domain; checkout URLs
then use it automatically.

Terms respected in the UI: prepaid only (no COD), free standard shipping,
dispatch in 1–3 business days.

## Customer accounts (login)

Mirrors the live store, which uses **Shopify's new customer accounts**: there
are no passwords. Customers sign in on a Shopify-hosted page with their email
and a one-time code (or "Continue with Shop"), and view orders and addresses
there.

- The header **account icon**, the mobile menu's "Log in / My account", the footer's
  "My account", the "Have an account? Log in to check out faster." prompts
  (cart drawer, cart page) and the Track order page all point to
  `NEXT_PUBLIC_SHOPIFY_ACCOUNT_URL` (default `https://shopify.com/76863570134/account`).
- `/account`, `/account/login`, `/account/register`, `/customer_authentication/*`
  and `/account/<anything>` redirect there, so old store links and the
  "View your order" links in Shopify notification emails keep working after the move.
- **Look & feel:** the sign-in page can't be embedded or rebuilt in this site (it
  would be the same even with a Hydrogen/headless setup), but you can brand it in
  Shopify admin → Settings → Customer accounts → Customize (logo, colours).
  The live one currently uses Shopify's default purple, so it's worth doing.
- **Next step, if wanted:** to show the signed-in customer's name and orders
  *inside* this site, connect the
  [Customer Account API](https://shopify.dev/docs/api/customer): install the
  Headless channel in Shopify, create a client ID, register
  `https://<domain>/account/callback` as a callback URL, then add an OAuth (PKCE)
  login/callback route and a session cookie. The sign-in page still stays on Shopify.

## Track order

Orders are placed on Shopify, so live status lives in the customer's Shopify
account (and in the shipping emails/SMS). The form points there and offers a
one-click, pre-filled email to support. To show status inline, connect the
Customer Account API and replace `lookup` in `src/components/forms/TrackOrder.tsx`.

## Contact form

With no backend, submitting opens the visitor's email app with a pre-filled
message to connect@praniteessentials.com, so nothing is silently lost. To store
messages server-side instead, post the fields from `onSubmit` in
`src/components/forms/ContactForm.tsx` to a Route Handler or form service
(Resend, Formspree, etc.).

## SEO

Per-page metadata and canonical URLs, Open Graph, `sitemap.xml`, `robots.txt`
(cart/checkout excluded), web manifest, and JSON-LD for Organization, Product
(+ Offer), BreadcrumbList and FAQPage. Set `NEXT_PUBLIC_SITE_URL` in production.

## Content notes for review

Copy was migrated from the live site. A few things were added or tidied and
should get a quick brand/legal look:

- **Added:** “How to use” steps on the product page (written conservatively from
  “daily use on face and body” and “for external use only”); the lead lines on
  About/Contact/Catalog; the four “Science of True Glow” step descriptions
  (condensed from the product description).
- **Tidied in policies:** removed template brackets (`[connect@…]`) and a leftover
  “Optional:” before “We offer FREE standard shipping on all orders”.
- **Phone format:** the site uses both “+91 9867 441254” and “+91 98674 41254”;
  the former is used in the header/footer, policies keep their original text.

## Known notes

- `npm audit` flags a `postcss` copy bundled *inside* Next.js 15. It's fixed only
  in a newer Next major; upgrade when you're ready to move past v15.
