# Google Search Console & Search Engine Indexing Setup

**Target Domain**: `https://www.posehanum.tech`  
**Sitemap XML**: `https://www.posehanum.tech/sitemap.xml`  
**Robots TXT**: `https://www.posehanum.tech/robots.txt`  

---

## 1. Google Search Console Setup

### Step 1: Add Property
1. Visit [Google Search Console](https://search.google.com/search-console).
2. Select **URL prefix** and input `https://www.posehanum.tech`.

### Step 2: Domain Verification
Choose one of the verified verification methods:
- **DNS TXT Record**: Add a `TXT` record at the root domain (`@`) with your Google verification token.
- **HTML Meta Tag**: Paste `<meta name="google-site-verification" content="..." />` into `website/src/app/layout.tsx`.

### Step 3: Sitemap Submission
1. Click **Sitemaps** in the left navigation menu.
2. Enter `sitemap.xml` in the submission box and click **Submit**.
3. Confirm status displays **Success** with all 11+ canonical URLs discovered.

---

## 2. Priority URL Inspection & Indexing Queue
Inspect and click **"Request Indexing"** on the following priority routes:
1. `https://www.posehanum.tech/` (Homepage)
2. `https://www.posehanum.tech/blog` (Guides Hub)
3. `https://www.posehanum.tech/blog/what-is-ai-pose-matching`
4. `https://www.posehanum.tech/blog/how-pose-scoring-works`
5. `https://www.posehanum.tech/blog/photo-poses-for-beginners`
6. `https://www.posehanum.tech/blog/how-to-take-better-photos-alone`
7. `https://www.posehanum.tech/blog/privacy-first-ai-photography`
8. `https://www.posehanum.tech/privacy`

---

## 3. Bing Webmaster Tools & IndexNow
1. Open [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. Use **Import from Google Search Console** for instant 1-click verification.
3. Submit `https://www.posehanum.tech/sitemap.xml` to populate Bing, Yahoo, DuckDuckGo, and Copilot.

---

## 4. Search Engine Crawl Verification
- Test robots access: `curl -I https://www.posehanum.tech/robots.txt` $\rightarrow$ `HTTP 200 OK`.
- Test sitemap access: `curl -I https://www.posehanum.tech/sitemap.xml` $\rightarrow$ `HTTP 200 OK`.
- Test PWA manifest access: `curl -I https://www.posehanum.tech/manifest.webmanifest` $\rightarrow$ `HTTP 200 OK`.
