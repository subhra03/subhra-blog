import { findCategoryById } from "./data/siteData.js";
import {
  articlePagePath,
  findAuthorBySlug,
  allTags,
  findPostBySlug,
  isValidArticlePage,
  postsByAuthor,
} from "./data/posts.js";
import { getBasePath, parseRoute } from "./routes.js";

const siteName = "Thoughts & Notes";
const defaultDescription =
  "Explore thoughtful articles on technology, science, environment, literature, and culture.";
const defaultImage = "https://source.unsplash.com/random/1200x630/?writing,notebook";

const pageTitles = {
  home: "Thoughts & Notes",
  articles: "Articles | Thoughts & Notes",
  search: "Search Articles | Thoughts & Notes",
  categories: "Categories | Thoughts & Notes",
  about: "About | Thoughts & Notes",
  notFound: "Not Found | Thoughts & Notes",
};

const pageDescriptions = {
  home: defaultDescription,
  articles: "Browse every Thoughts & Notes article and continue through the full archive.",
  search: "Search Thoughts & Notes articles by title, author, category, tag, and article text.",
  categories: "Explore Thoughts & Notes categories across technology, science, environment, literature, and culture.",
  about: "Learn about Thoughts & Notes, the topics it covers, and the thinking behind the writing.",
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
  const author = route.page === "author" ? findAuthorBySlug(route.authorSlug) : null;
  const tagExists = route.page === "tag" ? allTags.includes(route.tag) : false;

  if (post) {
    return createSeo({
      title: `${post.title} | Thoughts & Notes`,
      description: post.excerpt,
      path: post.path,
      image: post.image,
      type: "article",
      jsonLd: articleJsonLd(post, post.path, origin),
      origin,
    });
  }

  if (route.page === "category" && category) {
    const title = `${category.title} Articles | Thoughts & Notes`;
    const description = `Browse Thoughts & Notes articles about ${category.title}.`;

    return createSeo({
      title,
      description,
      path,
      jsonLd: collectionJsonLd({ title, description, path, origin }),
      origin,
    });
  }

  if (route.page === "author" && author) {
    const posts = postsByAuthor(author.slug);
    const title = `${author.name} Articles | Thoughts & Notes`;
    const description = `${author.name} has published ${posts.length} article${
      posts.length === 1 ? "" : "s"
    } on Thoughts & Notes.`;

    return createSeo({
      title,
      description,
      path: author.path,
      image: author.avatar,
      jsonLd: collectionJsonLd({ title, description, path: author.path, origin }),
      origin,
    });
  }

  if (route.page === "tag" && tagExists) {
    const title = `#${route.tag} Articles | Thoughts & Notes`;
    const description = `Browse Thoughts & Notes articles tagged with #${route.tag}.`;

    return createSeo({
      title,
      description,
      path,
      jsonLd: collectionJsonLd({ title, description, path, origin }),
      origin,
    });
  }

  if (route.page === "articles" && route.pageNumber > 1 && isValidArticlePage(route.pageNumber)) {
    const path = articlePagePath(route.pageNumber);
    const title = `Articles Page ${route.pageNumber} | Thoughts & Notes`;
    const description = `Browse page ${route.pageNumber} of the Thoughts & Notes article archive.`;

    return createSeo({
      title,
      description,
      path,
      jsonLd: collectionJsonLd({ title, description, path, origin }),
      origin,
    });
  }

  if (route.page === "search") {
    const query = new URLSearchParams(route.search).get("q") ?? "";
    const title = query
      ? `Search results for "${query}" | Thoughts & Notes`
      : pageTitles.search;
    const description = query
      ? `Search results for "${query}" across Thoughts & Notes articles.`
      : pageDescriptions.search;

    return createSeo({
      title,
      description,
      path: query ? `/search/?q=${encodeURIComponent(query)}` : "/search/",
      jsonLd: collectionJsonLd({
        title,
        description,
        path: query ? `/search/?q=${encodeURIComponent(query)}` : "/search/",
        origin,
      }),
      origin,
    });
  }

  const page =
    (route.page === "article" && !post) ||
    (route.page === "articles" && !isValidArticlePage(route.pageNumber ?? 1)) ||
    (route.page === "category" && !category) ||
    (route.page === "author" && !author) ||
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
      page === "articles" || page === "categories" || page === "search"
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
