import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const ssrDir = path.join(rootDir, "dist-ssr");
const siteUrl = normalizeOrigin(process.env.SITE_URL ?? "https://subhra03.github.io/subhra-blog");

const template = await readFile(path.join(distDir, "index.html"), "utf8");
const server = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")));
const routes = server.getPrerenderRoutes();

for (const route of routes) {
  const { html, seo } = server.render(route, siteUrl);
  const output = renderDocument(template, html, seo);
  const outputPath = routeToOutputPath(route);

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output, "utf8");
}

await writeFile(path.join(distDir, "sitemap.xml"), renderSitemap(routes), "utf8");
await writeFile(path.join(distDir, "rss.xml"), renderRss(server.getFeedItems()), "utf8");
await writeFile(path.join(distDir, "robots.txt"), renderRobots(), "utf8");
await rm(ssrDir, { recursive: true, force: true });

console.log(`Prerendered ${routes.length} routes.`);
console.log(`Generated sitemap.xml, rss.xml, and robots.txt for ${siteUrl}.`);

function renderDocument(baseTemplate, appHtml, seo) {
  const seoTags = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<link rel="canonical" href="${escapeAttribute(seo.canonical)}" />`,
    ...seo.tags.map(([attribute, key, content]) =>
      `<meta ${attribute}="${escapeAttribute(key)}" content="${escapeAttribute(content)}" />`
    ),
    seo.jsonLd
      ? `<script type="application/ld+json" data-seo-json-ld="true">${escapeScriptJson(
          seo.jsonLd
        )}</script>`
      : "",
  ]
    .filter(Boolean)
    .join("\n    ");

  return baseTemplate
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace(/\s*<link rel="canonical"[\s\S]*?>/g, "")
    .replace(/\s*<meta\s+(?:name|property)="(?:description|og:[^"]+|twitter:[^"]+)"[\s\S]*?>/g, "")
    .replace(/\s*<script type="application\/ld\+json" data-seo-json-ld="true">[\s\S]*?<\/script>/g, "")
    .replace("</head>", `    ${seoTags}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

function routeToOutputPath(route) {
  if (route === "/") return path.join(distDir, "index.html");

  const routePath = route
    .split("/")
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment));

  return path.join(distDir, ...routePath, "index.html");
}

function renderSitemap(routes) {
  const urls = routes
    .map((route) => {
      const loc = toSiteUrl(route);
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function renderRss(items) {
  const entries = items
    .map((item) => {
      const link = toSiteUrl(item.path);
      const pubDate = new Date(Date.parse(item.date)).toUTCString();
      const categories = [item.category, ...item.tags]
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join("\n");

      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid>${escapeXml(link)}</guid>
      <pubDate>${escapeXml(pubDate)}</pubDate>
      <dc:creator>${escapeXml(item.author)}</dc:creator>
      <description>${escapeXml(item.description)}</description>
${categories}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Cosmic Blog</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>Thoughtful articles on technology, science, environment, literature, and culture.</description>
    <language>en-us</language>
${entries}
  </channel>
</rss>
`;
}

function renderRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${toSiteUrl("/sitemap.xml")}
`;
}

function normalizeOrigin(value) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('"', "&quot;");
}

function escapeXml(value) {
  return escapeAttribute(value).replaceAll("'", "&apos;");
}

function escapeScriptJson(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function toSiteUrl(value) {
  if (/^https?:\/\//i.test(value)) return value;

  const root = new URL(siteUrl);
  const basePath = root.pathname.replace(/\/$/, "");
  const cleanValue = value.startsWith("/") ? value : `/${value}`;
  root.pathname = `${basePath}${cleanValue}`.replace(/\/{2,}/g, "/");
  root.search = "";
  root.hash = "";

  return root.toString();
}
