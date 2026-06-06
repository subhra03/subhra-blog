import { findCategoryById } from "./data/siteData.js";
import { allTags, findPostBySlug } from "./data/posts.js";
import { getBasePath, parseRoute } from "./routes.js";

const siteName = "Cosmic Blog";
const defaultDescription =
  "Explore thoughtful articles on technology, science, environment, literature, and culture.";
const defaultImage = "/assets/logo.png";

const pageTitles = {
  home: "Cosmic Blog",
  articles: "Articles | Cosmic Blog",
  categories: "Categories | Cosmic Blog",
  about: "About | Cosmic Blog",
  notFound: "Not Found | Cosmic Blog",
};

const pageDescriptions = {
  home: defaultDescription,
  articles: "Browse every Cosmic Blog article, filter by category, and search by topic or author.",
  categories: "Explore Cosmic Blog categories across technology, science, environment, literature, and culture.",
  about: "Learn about Cosmic Blog, the topics it covers, and the thinking behind the writing.",
  notFound: "The page you are looking for does not exist or has moved.",
};

export function createSeo({
  title = siteName,
  description = defaultDescription,
  path = "/",
  image = defaultImage,
  type = "website",
  jsonLd,
  origin = getDefaultOrigin(),
}) {
  const url = toSiteUrl(path, origin);
  const imageUrl = toSiteUrl(image, origin);

  return {
    title,
    description,
    canonical: url,
    tags: [
      ["name", "description", description],
      ["property", "og:site_name", siteName],
      ["property", "og:title", title],
      ["property", "og:description", description],
      ["property", "og:type", type],
      ["property", "og:url", url],
      ["property", "og:image", imageUrl],
      ["name", "twitter:card", "summary_large_image"],
      ["name", "twitter:title", title],
      ["name", "twitter:description", description],
      ["name", "twitter:image", imageUrl],
    ],
    jsonLd,
  };
}

export function seoForPath(path, origin = getDefaultOrigin()) {
  const route = parseRoute(path);
  const post = route.page === "article" ? findPostBySlug(route.slug) : null;
  const category = route.page === "category" ? findCategoryById(route.categoryId) : null;
  const tagExists = route.page === "tag" ? allTags.includes(route.tag) : false;

  if (post) {
    return createSeo({
      title: `${post.title} | Cosmic Blog`,
      description: post.excerpt,
      path: post.path,
      image: post.image,
      type: "article",
      jsonLd: articleJsonLd(post, post.path, origin),
      origin,
    });
  }

  if (route.page === "category" && category) {
    const title = `${category.title} Articles | Cosmic Blog`;
    const description = `Browse Cosmic Blog articles about ${category.title}.`;

    return createSeo({
      title,
      description,
      path,
      jsonLd: collectionJsonLd({ title, description, path, origin }),
      origin,
    });
  }

  if (route.page === "tag" && tagExists) {
    const title = `#${route.tag} Articles | Cosmic Blog`;
    const description = `Browse Cosmic Blog articles tagged with #${route.tag}.`;

    return createSeo({
      title,
      description,
      path,
      jsonLd: collectionJsonLd({ title, description, path, origin }),
      origin,
    });
  }

  const page =
    (route.page === "article" && !post) ||
    (route.page === "category" && !category) ||
    (route.page === "tag" && !tagExists)
      ? "notFound"
      : route.page;

  const title = pageTitles[page] ?? pageTitles.notFound;
  const description = pageDescriptions[page] ?? pageDescriptions.notFound;

  return createSeo({
    title,
    description,
    path,
    jsonLd:
      page === "articles" || page === "categories"
        ? collectionJsonLd({ title, description, path, origin })
        : undefined,
    origin,
  });
}

export function applySeo(seo) {
  document.title = seo.title;
  setCanonical(seo.canonical);

  seo.tags.forEach(([attribute, key, content]) => {
    setMeta(attribute, key, content);
  });

  setJsonLd(seo.jsonLd);
}

export function articleJsonLd(post, path, origin = getDefaultOrigin()) {
  const url = toSiteUrl(path, origin);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: toSiteUrl(post.image, origin),
    author: {
      "@type": "Person",
      name: post.author,
    },
    datePublished: toIsoDate(post.date),
    dateModified: toIsoDate(post.date),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function collectionJsonLd({ title, description, path, origin = getDefaultOrigin() }) {
  const url = toSiteUrl(path, origin);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url,
  };
}

function setMeta(attribute, key, content) {
  let node = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attribute, key);
    document.head.appendChild(node);
  }

  node.setAttribute("content", content);
}

function setCanonical(url) {
  let node = document.head.querySelector('link[rel="canonical"]');

  if (!node) {
    node = document.createElement("link");
    node.setAttribute("rel", "canonical");
    document.head.appendChild(node);
  }

  node.setAttribute("href", url);
}

function setJsonLd(jsonLd) {
  let node = document.head.querySelector('script[data-seo-json-ld="true"]');

  if (!jsonLd) {
    node?.remove();
    return;
  }

  if (!node) {
    node = document.createElement("script");
    node.type = "application/ld+json";
    node.setAttribute("data-seo-json-ld", "true");
    document.head.appendChild(node);
  }

  node.textContent = JSON.stringify(jsonLd);
}

function toIsoDate(date) {
  const parsed = Date.parse(date);
  return Number.isNaN(parsed) ? undefined : new Date(parsed).toISOString();
}

function getDefaultOrigin() {
  if (typeof window !== "undefined") return `${window.location.origin}${getBasePath()}`;
  if (typeof process !== "undefined" && process.env.SITE_URL) {
    return process.env.SITE_URL;
  }
  return "https://subhra03.github.io/subhra-blog";
}

function toSiteUrl(value, siteRoot) {
  if (/^https?:\/\//i.test(value)) return value;

  const root = new URL(siteRoot);
  const basePath = root.pathname.replace(/\/$/, "");
  const cleanValue = value.startsWith("/") ? value : `/${value}`;
  root.pathname = `${basePath}${cleanValue}`.replace(/\/{2,}/g, "/");
  root.search = "";
  root.hash = "";

  return root.toString();
}
