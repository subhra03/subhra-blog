export const routes = {
  "/": "home",
  "/index.html": "home",
  "/articles": "articles",
  "/articles.html": "articles",
  "/search": "search",
  "/search.html": "search",
  "/categories": "categories",
  "/categories.html": "categories",
  "/about": "about",
  "/about.html": "about",
};

export function getBasePath() {
  const rawBase = import.meta.env.BASE_URL ?? "/";
  const baseUrl = /^https?:\/\//i.test(rawBase) ? new URL(rawBase).pathname : rawBase;

  if (baseUrl === "/" || baseUrl === "") return "";

  return `/${baseUrl.replace(/^\/+|\/+$/g, "")}`;
}

export function stripBasePath(pathname) {
  const basePath = getBasePath();

  if (!basePath) return pathname || "/";
  if (pathname === basePath) return "/";
  if (pathname.startsWith(`${basePath}/`)) {
    return pathname.slice(basePath.length) || "/";
  }

  return pathname || "/";
}

export function toPublicPath(path) {
  if (!path || path === "#") return path;
  if (/^(https?:|mailto:|tel:|#)/i.test(path)) return path;

  const [, pathname = "", suffix = ""] = String(path).match(/^([^?#]*)(.*)$/) ?? [];
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  return `${getBasePath()}${cleanPath}`.replace(/\/{2,}/g, "/") + suffix;
}

export function parseRoute(pathname) {
  const appPath = stripBasePath(pathname);
  const { pathname: routePath, search } = splitPathAndSearch(appPath);
  const normalized = routePath.length > 1 ? routePath.replace(/\/$/, "") : routePath;
  const articlePageMatch = normalized.match(/^\/articles\/page\/(\d+)$/);
  const articleMatch = normalized.match(/^\/articles\/([^/]+)$/);
  const categoryMatch = normalized.match(/^\/categories\/([^/]+)$/);
  const tagMatch = normalized.match(/^\/tags\/([^/]+)$/);
  const authorMatch = normalized.match(/^\/authors\/([^/]+)$/);

  if (articlePageMatch) {
    return { page: "articles", pageNumber: Number(articlePageMatch[1]), search };
  }

  if (articleMatch) {
    return { page: "article", slug: decodeURIComponent(articleMatch[1]), search };
  }

  if (categoryMatch) {
    return { page: "category", categoryId: decodeURIComponent(categoryMatch[1]), search };
  }

  if (tagMatch) {
    return { page: "tag", tag: decodeURIComponent(tagMatch[1]), search };
  }

  if (authorMatch) {
    return { page: "author", authorSlug: decodeURIComponent(authorMatch[1]), search };
  }

  return { page: routes[normalized] ?? "notFound", search };
}

export function resolvePage(pathname) {
  return parseRoute(pathname).page;
}

export function getQueryParam(pathname, key) {
  const { search } = splitPathAndSearch(stripBasePath(pathname));
  return new URLSearchParams(search).get(key) ?? "";
}

function splitPathAndSearch(value) {
  const text = value || "/";
  const hashIndex = text.indexOf("#");
  const withoutHash = hashIndex >= 0 ? text.slice(0, hashIndex) : text;
  const searchIndex = withoutHash.indexOf("?");

  if (searchIndex < 0) {
    return { pathname: withoutHash || "/", search: "" };
  }

  return {
    pathname: withoutHash.slice(0, searchIndex) || "/",
    search: withoutHash.slice(searchIndex),
  };
}
