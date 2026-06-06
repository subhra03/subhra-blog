export const routes = {
  "/": "home",
  "/index.html": "home",
  "/articles": "articles",
  "/articles.html": "articles",
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
  const normalized = appPath.length > 1 ? appPath.replace(/\/$/, "") : appPath;
  const articleMatch = normalized.match(/^\/articles\/([^/]+)$/);
  const categoryMatch = normalized.match(/^\/categories\/([^/]+)$/);
  const tagMatch = normalized.match(/^\/tags\/([^/]+)$/);

  if (articleMatch) {
    return { page: "article", slug: decodeURIComponent(articleMatch[1]) };
  }

  if (categoryMatch) {
    return { page: "category", categoryId: decodeURIComponent(categoryMatch[1]) };
  }

  if (tagMatch) {
    return { page: "tag", tag: decodeURIComponent(tagMatch[1]) };
  }

  return { page: routes[normalized] ?? "notFound" };
}

export function resolvePage(pathname) {
  return parseRoute(pathname).page;
}
