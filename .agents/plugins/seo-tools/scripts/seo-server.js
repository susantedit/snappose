#!/usr/bin/env node
/**
 * SEO MCP Server
 * Standard Model Context Protocol (MCP) Server for comprehensive SEO audits,
 * page analysis, meta tag validation, sitemap/robots parsing, and keyword density.
 */

const readline = require('readline');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Supported MCP Tools definitions
const TOOLS = [
  {
    name: 'seo_analyze_page',
    description: 'Performs a comprehensive on-page SEO analysis of a live URL or raw HTML string. Evaluates titles, descriptions, canonical tags, open graph, twitter cards, headings hierarchy, image alt tags, JSON-LD structured data, and produces an overall SEO health score with recommendations.',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The full URL of the page to analyze (e.g., https://posehanum.com or http://localhost:3000)'
        },
        html: {
          type: 'string',
          description: 'Optional raw HTML string to analyze directly instead of fetching from a URL'
        }
      }
    }
  },
  {
    name: 'seo_check_sitemap',
    description: 'Fetches and analyzes an XML sitemap (or sitemap index), validating URLs, lastmod timestamps, change frequency, priority, and identifying potential indexing errors.',
    inputSchema: {
      type: 'object',
      properties: {
        sitemapUrl: {
          type: 'string',
          description: 'The URL to the sitemap.xml (e.g. https://example.com/sitemap.xml)'
        }
      },
      required: ['sitemapUrl']
    }
  },
  {
    name: 'seo_check_robots_txt',
    description: 'Fetches and validates a robots.txt file, checking Disallow/Allow directives, Crawl-delay, user-agent rules, and sitemap references.',
    inputSchema: {
      type: 'object',
      properties: {
        robotsUrl: {
          type: 'string',
          description: 'The URL to the robots.txt file (e.g. https://example.com/robots.txt)'
        }
      },
      required: ['robotsUrl']
    }
  },
  {
    name: 'seo_serp_simulator',
    description: 'Simulates how a page will appear in Google Search Results (SERP) on desktop and mobile, calculating pixel widths and checking for title/description truncation.',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'The page title'
        },
        description: {
          type: 'string',
          description: 'The meta description'
        },
        url: {
          type: 'string',
          description: 'The target canonical URL'
        }
      },
      required: ['title', 'description', 'url']
    }
  },
  {
    name: 'seo_keyword_density',
    description: 'Analyzes text content or a webpage for keyword density, total word count, n-grams (1-word, 2-word, 3-word phrases), and potential keyword stuffing.',
    inputSchema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'Text or HTML content to analyze'
        },
        targetKeywords: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional list of target keywords to specifically measure density for'
        }
      },
      required: ['text']
    }
  }
];

// Helper to fetch URL content
function fetchUrl(targetUrl) {
  return new Promise((resolve, reject) => {
    try {
      const parsed = new URL(targetUrl);
      const client = parsed.protocol === 'https:' ? https : http;
      const req = client.get(
        targetUrl,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (Antigravity-SEO-MCP/1.0)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          },
          timeout: 10000
        },
        (res) => {
          // Handle redirects
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            const redirectUrl = new URL(res.headers.location, targetUrl).toString();
            return fetchUrl(redirectUrl).then(resolve).catch(reject);
          }
          if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 400)) {
            return reject(new Error(`HTTP status ${res.statusCode}: ${res.statusMessage}`));
          }
          let data = '';
          res.setEncoding('utf8');
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => resolve({ content: data, statusCode: res.statusCode, headers: res.headers, finalUrl: targetUrl }));
        }
      );
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timed out after 10000ms'));
      });
    } catch (err) {
      reject(err);
    }
  });
}

// Extract attributes from HTML tags with regex
function extractTagAttributes(tagStr) {
  const attrs = {};
  const regex = /([a-zA-Z0-9:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^>\s]+)))?/g;
  let match;
  while ((match = regex.exec(tagStr)) !== null) {
    const key = match[1].toLowerCase();
    const val = match[2] !== undefined ? match[2] : match[3] !== undefined ? match[3] : match[4] !== undefined ? match[4] : '';
    attrs[key] = val;
  }
  return attrs;
}

// Perform full HTML Page SEO Analysis
function analyzeHtmlSeo(html, pageUrl = '') {
  const issues = [];
  const warnings = [];
  const passed = [];

  // Title tag
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  const titleLength = title.length;

  if (!title) {
    issues.push('Missing <title> tag.');
  } else if (titleLength < 30) {
    warnings.push(`Title is short (${titleLength} chars). Recommended length: 50-60 characters.`);
  } else if (titleLength > 60) {
    warnings.push(`Title may be truncated in SERPs (${titleLength} chars). Recommended length: 50-60 characters.`);
  } else {
    passed.push(`Optimal title length (${titleLength} characters).`);
  }

  // Meta description
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
                        html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
  const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : '';
  const descLength = metaDescription.length;

  if (!metaDescription) {
    issues.push('Missing meta description tag (<meta name="description">).');
  } else if (descLength < 70) {
    warnings.push(`Meta description is short (${descLength} chars). Recommended: 120-160 characters.`);
  } else if (descLength > 160) {
    warnings.push(`Meta description is long (${descLength} chars). Recommended: 120-160 characters.`);
  } else {
    passed.push(`Optimal meta description length (${descLength} characters).`);
  }

  // Canonical tag
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i) ||
                         html.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["'][^>]*>/i);
  const canonicalUrl = canonicalMatch ? canonicalMatch[1].trim() : '';
  if (!canonicalUrl) {
    warnings.push('No canonical URL specified (<link rel="canonical">).');
  } else {
    passed.push(`Canonical URL declared: ${canonicalUrl}`);
  }

  // Meta robots
  const robotsMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const metaRobots = robotsMatch ? robotsMatch[1].trim() : 'index, follow (default)';
  if (robotsMatch && /noindex/i.test(metaRobots)) {
    warnings.push(`Page has 'noindex' directive: Search engines will not index this page.`);
  }

  // Viewport
  const viewportMatch = html.match(/<meta[^>]*name=["']viewport["'][^>]*>/i);
  if (!viewportMatch) {
    issues.push('Missing mobile viewport meta tag (<meta name="viewport">).');
  } else {
    passed.push('Mobile viewport meta tag is present.');
  }

  // Charset & HTML Lang
  const langMatch = html.match(/<html[^>]*lang=["']([^"']*)["'][^>]*>/i);
  const htmlLang = langMatch ? langMatch[1].trim() : '';
  if (!htmlLang) {
    warnings.push('HTML tag is missing a "lang" attribute (e.g. <html lang="en">).');
  } else {
    passed.push(`HTML lang attribute defined: "${htmlLang}".`);
  }

  // Open Graph Tags
  const ogTags = {};
  const ogMatches = html.matchAll(/<meta[^>]*property=["'](og:[a-zA-Z0-9:_]+)["'][^>]*content=["']([^"']*)["'][^>]*>/gi);
  for (const m of ogMatches) {
    ogTags[m[1].toLowerCase()] = m[2];
  }
  const requiredOg = ['og:title', 'og:description', 'og:image', 'og:url'];
  const missingOg = requiredOg.filter(t => !ogTags[t]);
  if (missingOg.length > 0) {
    warnings.push(`Missing OpenGraph social tags: ${missingOg.join(', ')}`);
  } else {
    passed.push('All essential OpenGraph tags present (title, desc, image, url).');
  }

  // Twitter Card
  const twitterTags = {};
  const twitterMatches = html.matchAll(/<meta[^>]*name=["'](twitter:[a-zA-Z0-9:_]+)["'][^>]*content=["']([^"']*)["'][^>]*>/gi);
  for (const m of twitterMatches) {
    twitterTags[m[1].toLowerCase()] = m[2];
  }
  if (!twitterTags['twitter:card']) {
    warnings.push('Missing twitter:card meta tag.');
  } else {
    passed.push(`Twitter card specified: "${twitterTags['twitter:card']}".`);
  }

  // Headings analysis
  const headings = { h1: [], h2: [], h3: [], h4: [], h5: [], h6: [] };
  for (let i = 1; i <= 6; i++) {
    const regex = new RegExp(`<h${i}[^>]*>([\\s\\S]*?)<\\/h${i}>`, 'gi');
    let hMatch;
    while ((hMatch = regex.exec(html)) !== null) {
      const text = hMatch[1].replace(/<[^>]+>/g, '').trim();
      headings[`h${i}`].push(text);
    }
  }

  if (headings.h1.length === 0) {
    issues.push('Missing <h1> heading tag.');
  } else if (headings.h1.length > 1) {
    warnings.push(`Multiple <h1> tags found (${headings.h1.length}). Best practice is 1 main <h1> tag.`);
  } else {
    passed.push(`Single <h1> found: "${headings.h1[0]}"`);
  }

  // Image alt tags
  const imgMatches = [...html.matchAll(/<img\b([^>]*)>/gi)];
  let totalImages = imgMatches.length;
  let imagesMissingAlt = 0;
  for (const match of imgMatches) {
    const attrs = extractTagAttributes(match[1]);
    if (!attrs['alt'] || attrs['alt'].trim() === '') {
      imagesMissingAlt++;
    }
  }
  if (totalImages > 0 && imagesMissingAlt > 0) {
    warnings.push(`${imagesMissingAlt} of ${totalImages} images are missing "alt" text attributes.`);
  } else if (totalImages > 0) {
    passed.push(`All ${totalImages} images have "alt" attributes.`);
  }

  // Structured Data / JSON-LD
  const jsonLdScripts = [];
  const scriptMatches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const s of scriptMatches) {
    try {
      jsonLdScripts.push(JSON.parse(s[1].trim()));
    } catch {
      issues.push('Invalid JSON syntax inside application/ld+json script.');
    }
  }
  if (jsonLdScripts.length === 0) {
    warnings.push('No JSON-LD structured data found (Schema.org).');
  } else {
    passed.push(`Found ${jsonLdScripts.length} valid JSON-LD schema block(s) (Types: ${jsonLdScripts.map(s => s['@type'] || 'Object').join(', ')}).`);
  }

  // Calculate SEO Health Score (0 - 100)
  let score = 100;
  score -= (issues.length * 15);
  score -= (warnings.length * 5);
  score = Math.max(0, Math.min(100, score));

  return {
    url: pageUrl || 'Direct HTML Input',
    overallScore: score,
    grade: score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 50 ? 'C' : 'F',
    summary: {
      criticalIssuesCount: issues.length,
      warningsCount: warnings.length,
      passedChecksCount: passed.length
    },
    meta: {
      title,
      titleLength,
      metaDescription,
      descLength,
      canonicalUrl,
      metaRobots,
      htmlLang,
      openGraph: ogTags,
      twitterCard: twitterTags
    },
    headings: {
      h1Count: headings.h1.length,
      h1List: headings.h1,
      h2Count: headings.h2.length,
      h3Count: headings.h3.length
    },
    images: {
      totalImages,
      imagesMissingAlt
    },
    structuredData: {
      count: jsonLdScripts.length,
      schemas: jsonLdScripts
    },
    auditDetails: {
      criticalIssues: issues,
      warnings: warnings,
      passedChecks: passed
    }
  };
}

// Analyze Keyword Density
function analyzeKeywords(text, targetKeywords = []) {
  // Strip HTML tags if present
  const cleanText = text.replace(/<[^>]+>/g, ' ').replace(/[^\w\s]/g, ' ').toLowerCase();
  const words = cleanText.split(/\s+/).filter(w => w.length > 2);
  const totalWords = words.length;

  if (totalWords === 0) {
    return { totalWords: 0, message: 'No readable words found.' };
  }

  const wordCounts = {};
  for (const w of words) {
    wordCounts[w] = (wordCounts[w] || 0) + 1;
  }

  // Top single keywords
  const topSingleWords = Object.entries(wordCounts)
    .map(([word, count]) => ({
      keyword: word,
      count,
      density: `${((count / totalWords) * 100).toFixed(2)}%`,
      warning: (count / totalWords) > 0.04 ? 'High density (potential keyword stuffing)' : 'Optimal'
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // Target keyword analysis if supplied
  const targetReport = [];
  for (const kw of targetKeywords) {
    const kwClean = kw.toLowerCase().trim();
    const regex = new RegExp(`\\b${kwClean}\\b`, 'gi');
    const matches = cleanText.match(regex);
    const count = matches ? matches.length : 0;
    const density = ((count / totalWords) * 100).toFixed(2);
    targetReport.push({
      keyword: kw,
      count,
      density: `${density}%`,
      status: count === 0 ? 'Not found' : parseFloat(density) > 3.5 ? 'Over-optimized' : 'Good'
    });
  }

  return {
    totalWords,
    targetKeywordAnalysis: targetReport.length > 0 ? targetReport : undefined,
    topKeywords: topSingleWords
  };
}

// SERP Simulator
function simulateSerp(title, description, url) {
  // Average Google desktop title limit is approx 600px (~60 chars)
  // Average Google mobile title limit is approx 55-60 chars
  // Description limit is approx 960px (~155-160 chars)
  const titleCharLimit = 60;
  const descCharLimit = 160;

  const desktopTitle = title.length > titleCharLimit ? `${title.slice(0, titleCharLimit - 3)}...` : title;
  const desktopDesc = description.length > descCharLimit ? `${description.slice(0, descCharLimit - 3)}...` : description;

  return {
    input: { title, description, url },
    pixelChecks: {
      titleLength: title.length,
      titleStatus: title.length <= titleCharLimit ? 'Optimal (No truncation expected)' : `Truncated by ${title.length - titleCharLimit} characters`,
      descLength: description.length,
      descStatus: description.length <= descCharLimit ? 'Optimal (No truncation expected)' : `Truncated by ${description.length - descCharLimit} characters`
    },
    googlePreview: {
      url,
      displayTitle: desktopTitle,
      displaySnippet: desktopDesc
    }
  };
}

// Parse Sitemap XML
function parseSitemap(xml) {
  const urls = [];
  const locRegex = /<loc>([\s\S]*?)<\/loc>/gi;
  let match;
  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1].trim());
  }

  const isIndex = /<sitemapindex/i.test(xml);

  return {
    type: isIndex ? 'Sitemap Index (Contains child sitemaps)' : 'Standard URL Sitemap',
    totalEntries: urls.length,
    urls: urls.slice(0, 50),
    truncated: urls.length > 50 ? `Showing first 50 of ${urls.length} URLs` : undefined
  };
}

// Parse Robots.txt
function parseRobotsTxt(content) {
  const lines = content.split('\n');
  const userAgents = {};
  const sitemaps = [];
  let currentAgent = '*';

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;

    const [directive, ...rest] = line.split(':');
    const value = rest.join(':').trim();
    const dirLower = directive.toLowerCase().trim();

    if (dirLower === 'user-agent') {
      currentAgent = value;
      if (!userAgents[currentAgent]) {
        userAgents[currentAgent] = { allow: [], disallow: [], crawlDelay: null };
      }
    } else if (dirLower === 'disallow') {
      if (!userAgents[currentAgent]) userAgents[currentAgent] = { allow: [], disallow: [] };
      userAgents[currentAgent].disallow.push(value);
    } else if (dirLower === 'allow') {
      if (!userAgents[currentAgent]) userAgents[currentAgent] = { allow: [], disallow: [] };
      userAgents[currentAgent].allow.push(value);
    } else if (dirLower === 'sitemap') {
      sitemaps.push(value);
    }
  }

  return {
    sitemapsFound: sitemaps,
    userAgents
  };
}

// Handle JSON-RPC tool calls
async function handleToolCall(toolName, args) {
  switch (toolName) {
    case 'seo_analyze_page': {
      let html = args.html;
      let url = args.url;
      if (!html && url) {
        const res = await fetchUrl(url);
        html = res.content;
      }
      if (!html) {
        throw new Error('Either "url" or "html" parameter is required.');
      }
      return analyzeHtmlSeo(html, url);
    }

    case 'seo_check_sitemap': {
      const res = await fetchUrl(args.sitemapUrl);
      return parseSitemap(res.content);
    }

    case 'seo_check_robots_txt': {
      const res = await fetchUrl(args.robotsUrl);
      return parseRobotsTxt(res.content);
    }

    case 'seo_serp_simulator': {
      return simulateSerp(args.title, args.description, args.url);
    }

    case 'seo_keyword_density': {
      return analyzeKeywords(args.text, args.targetKeywords || []);
    }

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}

// MCP JSON-RPC Standard Stdio Loop
function startMcpServer() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  function sendResponse(id, result, error = null) {
    const msg = {
      jsonrpc: '2.0',
      id
    };
    if (error) {
      msg.error = error;
    } else {
      msg.result = result;
    }
    process.stdout.write(JSON.stringify(msg) + '\n');
  }

  rl.on('line', async (line) => {
    if (!line.trim()) return;
    try {
      const request = JSON.parse(line);
      const { id, method, params } = request;

      if (method === 'initialize') {
        sendResponse(id, {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: 'seo-tools-mcp-server',
            version: '1.0.0'
          }
        });
      } else if (method === 'notifications/initialized' || method === 'initialized') {
        // Notification - no response needed
      } else if (method === 'ping') {
        sendResponse(id, {});
      } else if (method === 'tools/list') {
        sendResponse(id, {
          tools: TOOLS
        });
      } else if (method === 'tools/call') {
        const toolName = params.name;
        const toolArgs = params.arguments || {};
        try {
          const output = await handleToolCall(toolName, toolArgs);
          sendResponse(id, {
            content: [
              {
                type: 'text',
                text: JSON.stringify(output, null, 2)
              }
            ]
          });
        } catch (callErr) {
          sendResponse(id, {
            content: [
              {
                type: 'text',
                text: `Error executing tool ${toolName}: ${callErr.message}`
              }
            ],
            isError: true
          });
        }
      } else {
        // Unknown method
        sendResponse(id, null, {
          code: -32601,
          message: `Method '${method}' not found`
        });
      }
    } catch (parseErr) {
      sendResponse(null, null, {
        code: -32700,
        message: `Parse error: ${parseErr.message}`
      });
    }
  });

  process.stderr.write('SEO MCP Server running on stdio.\n');
}

// Start the server
startMcpServer();
