import { renderToString } from "react-dom/server";
import App from "./App.jsx";
import { articlePageCount, articlePagePath, authors, posts, allTags } from "./data/posts.js";
import { categories } from "./data/siteData.js";
import { seoForPath } from "./seo.js";

export function render(path, origin) {
  return {
    html: renderToString(<App initialPath={path} />),
    seo: seoForPath(path, origin),
  };
}

export function getPrerenderRoutes() {
  return uniqueRoutes([
    "/",
    "/articles/",
    ...Array.from({ length: articlePageCount - 1 }, (_, index) => articlePagePath(index + 2)),
    "/search/",
    "/categories/",
    "/about/",
    ...posts.map((post) => post.path),
    ...authors.map((author) => author.path),
    ...categories.map((category) => `/categories/${category.id}/`),
    ...allTags.map((tag) => `/tags/${encodeURIComponent(tag)}/`),
  ]);
}

export function getFeedItems() {
  return posts.map((post) => ({
    title: post.title,
    description: post.excerpt,
    path: post.path,
    date: post.date,
    author: post.author,
    category: post.category,
    tags: post.tags ?? [],
  }));
}

function uniqueRoutes(routes) {
  return Array.from(new Set(routes));
}
