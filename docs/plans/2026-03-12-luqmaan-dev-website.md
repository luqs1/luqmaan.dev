# luqmaan.dev Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build luqmaan.dev — a writing-first personal website with blog, RSS, and /connect page.

**Architecture:** Astro static site with content collections for blog posts (markdown). Three pages: homepage (post list), /connect (social links), /writing/[slug] (post). RSS auto-generated, JSON-LD Person schema in head, Seeds for Gaza font for Arabic text only.

**Tech Stack:** Astro 5, TypeScript, pnpm, Cloudflare Pages (deployment later)

---

### Design reference

- 680px centred content column on 1440px canvas
- Header: `luqmaan.dev` (JetBrains Mono 13px, bold) + `connect →` (Inter 13px, red #E53935)
- Background: #FFFFFF, text: #000000, secondary: #777777, accent: #E53935, borders: #E4E4E4
- Zero border radius, no shadows, 1px borders
- Inter for UI/body, JetBrains Mono for dates/code/logo
- Seeds for Gaza font (https://seeds.careem.com) for Arabic text only
- Body text: 16px, 1.6 line-height
- Essay rows: date (JetBrains Mono 12px grey) + title (Inter 14px black) + → (grey), 1px bottom border
- Page top padding: 48px

---

### Task 1: Scaffold Astro project

**Files:**
- Create: `~/repos/luqmaan.dev/` (Astro project root)

**Steps:**
1. `cd ~/repos/luqmaan.dev && pnpm create astro@latest . -- --template minimal --typescript strict --no-git --no-install`
2. `pnpm install`
3. `pnpm add @astrojs/rss`
4. `git init && git add -A && git commit -m "chore: scaffold astro project"`

---

### Task 2: Global styles + fonts

**Files:**
- Create: `src/styles/global.css`
- Modify: `src/layouts/Base.astro` (create this)

Global CSS imports Inter + JetBrains Mono from Google Fonts. Seeds for Gaza downloaded locally to `public/fonts/Seeds_for_Gaza.woff2` (from the zip at seeds.careem.com).

CSS resets, base typography, link styles, `.mono` utility class.

---

### Task 3: Base layout

**Files:**
- Create: `src/layouts/Base.astro`

Props: `title`, `description`, `ogImage?`

Contains:
- `<html lang="en">`
- `<head>`: charset, viewport, title, description, OG tags, canonical, RSS `<link rel="alternate">`, JSON-LD Person schema, Google Fonts preconnect + stylesheet link
- `<body>`: `<slot />`

JSON-LD Person:
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Luqmaan Ahmed",
  "url": "https://luqmaan.dev",
  "sameAs": [
    "https://linkedin.com/in/luqmaan-ahmed",
    "https://upscrolled.com/@luqs1",
    "https://x.com/_luqy",
    "https://github.com/luqs1"
  ],
  "jobTitle": "Cloud Platform and MLOps Engineer",
  "worksFor": { "@type": "Organization", "name": "Cisco" }
}
```

---

### Task 4: Homepage

**Files:**
- Create: `src/pages/index.astro`

Layout: Base.astro with title="luqmaan.dev", description="Engineer, reader, builder."

Structure (680px centred column, padding-top 48px):
```html
<header>
  <span class="logo">luqmaan.dev</span>
  <a href="/connect">connect →</a>
</header>

<p class="bio">Engineer, reader, builder. Writing about technology, society, and the things in between.</p>

<ul class="post-list">
  {posts.map(post => (
    <li>
      <time>{post.date}</time>
      <a href={`/writing/${post.slug}`}>{post.title}</a>
      <span>→</span>
    </li>
  ))}
</ul>
```

Posts loaded from Astro content collection, sorted by date desc.

---

### Task 5: Content collection

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/writing/on-building-things-that-matter.md`
- Create: `src/content/writing/deploying-llms-at-scale.md`
- Create: `src/content/writing/islamic-fintech-is-not-just-a-niche.md`

`config.ts` defines `writing` collection with zod schema: `title`, `date` (Date), `description` (string).

Sample posts use real titles from the mockup. Body is placeholder prose.

---

### Task 6: Blog post page

**Files:**
- Create: `src/pages/writing/[slug].astro`
- Create: `src/layouts/Post.astro`

Post layout extends Base.astro. Structure:
```html
<header>luqmaan.dev / connect →</header>
<a href="/">← writing</a>
<time>{date}</time>
<h1>{title}</h1>
<article><slot /></article>
```

Arabic text in posts uses `<span class="arabic">` — CSS sets `font-family: 'Seeds for Gaza', serif`.

---

### Task 7: Connect page

**Files:**
- Create: `src/pages/connect.astro`

Same layout as homepage. Three rows:
- LinkedIn — "Professional background, work, and writing I co-publish." — `linkedin.com/in/luqmaan-ahmed →`
- UpScrolled — "Day-to-day thoughts, from anything I find interesting." — `upscrolled.com/@luqs1 →`
- Twitter/X — "still where tech happens (unfortunately)" — `x.com/_luqy →`

Header has `connect →` in red #E53935 (active state).

---

### Task 8: RSS feed

**Files:**
- Create: `src/pages/rss.xml.js`

Uses `@astrojs/rss`. Pulls all posts from content collection. Feed metadata: title "luqmaan.dev", description, site URL.

---

### Task 9: Cloudflare Pages config

**Files:**
- Create: `astro.config.mjs` (update site URL)
- Create: `wrangler.toml` (stub for later)
- Create: `.github/workflows/deploy.yml` (stub)

Set `site: 'https://luqmaan.dev'` in astro config for canonical URLs and RSS.

---

### Task 10: GitHub repo + push

```bash
gh repo create luqs1/luqmaan.dev --public --source=. --remote=origin
git push -u origin main
```
