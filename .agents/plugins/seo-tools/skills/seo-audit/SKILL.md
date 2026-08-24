---
name: seo-audit
description: >-
  Run on-page SEO audits, sitemap validations, robots.txt inspection, SERP snippet simulation,
  and keyword density analysis using the SEO MCP tools.
---

# SEO Audit & Optimization Skill

This skill provides comprehensive workflows for analyzing web pages and content for search engine optimization (SEO) and App Store Optimization (ASO).

## Available MCP Tools

The `seo-auditor` MCP server exposes the following tools:

1. **`seo_analyze_page`**
   - Evaluates title tags, meta descriptions, canonical URLs, OpenGraph, Twitter cards, heading hierarchies (H1-H6), image alt attributes, and JSON-LD Schema markup.
   - Calculates a 0-100 SEO health score with recommendations.

2. **`seo_check_sitemap`**
   - Parses XML sitemaps and sitemap index files to verify indexed URLs and lastmod timestamps.

3. **`seo_check_robots_txt`**
   - Inspects crawl directives, User-Agent rules, Disallow/Allow paths, and sitemap references.

4. **`seo_serp_simulator`**
   - Simulates Google search snippet previews on desktop and mobile, ensuring pixel and character truncation boundaries are met.

5. **`seo_keyword_density`**
   - Analyzes keyword frequency and density to prevent keyword stuffing while optimizing target search phrases.
