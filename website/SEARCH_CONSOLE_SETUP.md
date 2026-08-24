# Google Search Console & Indexing Execution Setup
**Target Website**: `https://www.posehanum.tech`  
**Sitemap URL**: `https://www.posehanum.tech/sitemap.xml`  

---

## 1. Step-by-Step Ownership Verification
1. Navigate to [Google Search Console](https://search.google.com/search-console).
2. Click **Add Property** and select **URL prefix**: `https://www.posehanum.tech` (or **Domain** if DNS access is available).
3. **Recommended Verification Methods**:
   - **DNS TXT Record**: Add `google-site-verification=...` TXT record in your DNS manager (Cloudflare, Namecheap, GoDaddy).
   - **HTML Tag Method**: Add `<meta name="google-site-verification" content="..." />` into `website/src/app/layout.tsx`.

---

## 2. Submit XML Sitemap
1. Go to **Sitemaps** in the left sidebar of Google Search Console.
2. In the "Add a new sitemap" input, enter:
   ```text
   sitemap.xml
   ```
3. Click **Submit**.
4. Verify the status changes to `Success` and that all 11+ routes are discovered.

---

## 3. Priority URL Inspection & Indexing Queue
Inspect and request instant indexing for high-priority landing pages:
1. `https://www.posehanum.tech` (Homepage)
2. `https://www.posehanum.tech/blog` (Blog Hub)
3. `https://www.posehanum.tech/blog/what-is-ai-pose-matching`
4. `https://www.posehanum.tech/blog/how-pose-scoring-works`
5. `https://www.posehanum.tech/blog/photo-poses-for-beginners`
6. `https://www.posehanum.tech/blog/how-to-take-better-photos-alone`
7. `https://www.posehanum.tech/blog/privacy-first-ai-photography`
8. `https://www.posehanum.tech/privacy`

Click **"Request Indexing"** on each inspected URL.

---

## 4. Bing Webmaster Tools & IndexNow Integration
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. Click **Import from Google Search Console** for instant 1-click verification.
3. Submit `https://www.posehanum.tech/sitemap.xml` to populate Bing, Yahoo, and DuckDuckGo indexes.

---

## 5. Monitoring & Maintenance Cadence
- **Weekly**: Review **Coverage / Page indexing** reports to resolve any 404 or redirect warnings.
- **Monthly**: Review **Core Web Vitals** (LCP, FID/INP, CLS) across Mobile and Desktop visitors.
- **Ongoing**: Track Search Queries & Impressions to identify expanding long-tail keyword opportunities.
