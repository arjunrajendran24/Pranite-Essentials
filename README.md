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
cp .env.example .env.local   # then edit, see "Checkout" below
npm run dev                  # http://localhost:3000
```

```bash
npm run build && npm start   # production build (all 24 routes prerender statically)
npm run lint                 # ESLint
npm run typecheck            # tsc --noEmit
```

The splash plays once per browser session on the homepage. To see it again,
open a new tab/private window, or run `sessionStorage.clear()` and reload.

## Pages

| Route | Notes |
|---|---|
| `/` | Splash → hero → philosophy (brand film) → Discover Tanora → Science of True Glow → marquee → Pranite Standard → track order |
| `/catalog` | Product grid (with a “more on the way” card while the range is small) |
| `/products/[handle]` | Gallery, purchase box + mobile sticky add-to-cart, benefits, master blend, before/after, FAQ, Product JSON-LD |
| `/about`, `/contact`, `/faq` | Content migrated from the live site; FAQ emits FAQPage JSON-LD |
| `/track-order` | Order lookup (see “Track order”) |
| `/cart`, `/checkout`, `/checkout/success` | Client-side cart → checkout (see “Checkout”) |
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
    cart/                 CartProvider (context + localStorage), drawer, cart page, checkout, confirmation
    decor/                LeafMark (brand sprout), botanical SVG accents, wave, circular text
    forms/                ContactForm, TrackOrder
    home/                 Hero, Philosophy, BrandFilm, TanoraHighlight, ScienceOfGlow, Marquee, PraniteStandard, TrackOrderBand
    icons/                UI icons (24px) + botanical line icons (48px, self-drawing)
    layout/               Header, MobileMenu, Footer, PageHero
    motion/               MotionProvider, Reveal / RevealGroup / RevealItem, InViewClass
    product/              ProductGallery, ProductPurchase, ProductCard, product page sections
    splash/               SplashScript (head), SplashScreen
    ui/                   Button, Logo, SectionHeading, Accordion, Breadcrumbs, RichText
  content/                site.ts (contact, nav, values) · faq.ts · policies.ts
  lib/                    catalog.ts (data layer) · checkout.ts · orders.ts · gsap.ts · splash.ts · utils.ts
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
| `tanora-lifestyle.jpg` | Hero, gallery #1, catalog card, cart thumbnail |
| `tanora-key-benefits.jpg` | Gallery #2 |
| `tanora-key-ingredients.jpg` | Gallery #3, About page |
| `tanora-before-after.jpg` | Gallery #4, “Why Tanora?” |
| `tanora-bathing-bar.jpg` | Gallery #5, Discover Tanora card, catalog hover image |
| `premium-skincare-badges.png` | Spare (badges are rebuilt in code as icons) |
| `src/app/icon.png`, `apple-icon.png` | Favicon / home-screen icon |
| `public/media/brand-film.mp4` + `brand-film-poster.webp` | Brand film |

**To swap an image for a better version** (e.g. a high-res photo shoot):
replace the file keeping the **same file name**. Width/height update
automatically. Recommended: ≥ 2000 px on the long edge, sRGB JPG/PNG. No need
to pre-convert to WebP/AVIF; `next/image` does it.

**To add images to a product:** drop the file into `src/assets/images/`,
import it at the top of `src/lib/catalog.ts` and add an entry to that product's
`images` array with a descriptive `alt`. Use `fit: "cover"` for photographs and
leave it out (defaults to `contain`) for graphics that contain text.

**Remote images** (e.g. straight from Shopify's CDN) also work: use the URL
string as `src`. `cdn.shopify.com` is already allowed in `next.config.ts`.
Remote images won't get a blur placeholder.

**Favicon:** replace `src/app/icon.png` (192×192) and `src/app/apple-icon.png` (180×180).

## Products & going headless

Every page reads products through `getProducts()` / `getProduct(handle)` in
`src/lib/catalog.ts`. They're `async` on purpose: to move to the **Shopify
Storefront API**, re-implement those two functions to fetch from Shopify and map
the response onto the `Product` type; no page or component changes.
To add a product today, add another object to the `products` array (the catalog,
sitemap and static product pages pick it up automatically).

## Checkout

The cart is client-side (React context, saved in `localStorage`, synced across tabs).

- **`NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN` set** (default in `.env.example`):
  “Continue to secure payment” sends the cart to Shopify's hosted checkout via a
  [cart permalink](https://help.shopify.com/en/manual/products/details/cart-permalink)
  (`/cart/<variantId>:<qty>`) with email and address pre-filled. No API keys needed.
  Verified working against the live store (it lands on Shopify's `/checkouts/…`).

  ⚠️ **Before pointing `www.praniteessentials.com` at this Next.js site:** Shopify
  redirects its `*.myshopify.com` domain to the store's *primary domain*. So first
  add a sub-domain such as `shop.praniteessentials.com` in Shopify → Settings →
  Domains, make it the primary domain, and set
  `NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN=shop.praniteessentials.com`. Otherwise
  checkout would bounce back to this site.
- **Variable empty**: demo mode. Orders are saved in the browser only and no
  payment is taken (the checkout says so on screen).

Terms respected in the UI: prepaid only (no COD), free standard shipping,
dispatch in 1–3 business days.

## Customer accounts (login)

Mirrors the live store, which uses **Shopify's new customer accounts**: there
are no passwords. Customers sign in on a Shopify-hosted page with their email
and a one-time code (or "Continue with Shop"), and view orders and addresses
there.

- The header **account icon**, the mobile menu's "Log in / My account", the footer's
  "My account", and the "Have an account? Log in to check out faster." prompts
  (cart drawer, cart page, checkout) all point to
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

Orders placed through the demo checkout are found locally and show a status
timeline. Anything else gets clear next steps (tracking arrives by email/SMS)
and a one-click, pre-filled email to support. To connect a courier or Shopify
order-status API, replace `lookup` in `src/components/forms/TrackOrder.tsx`.

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
