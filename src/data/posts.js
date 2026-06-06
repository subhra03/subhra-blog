const mdxModules = import.meta.glob("../content/articles/*.mdx", {
  eager: true,
});

function slugFromPath(path) {
  return path.split("/").pop().replace(/\.mdx$/, "");
}

function normalizePost([path, module]) {
  const meta = module.meta ?? {};
  const slug = meta.slug ?? slugFromPath(path);

  return {
    ...meta,
    id: slug,
    slug,
    path: `/articles/${slug}/`,
    Component: module.default,
    searchText: `${meta.title ?? ""} ${meta.excerpt ?? ""} ${meta.author ?? ""} ${
      meta.searchText ?? ""
    }`.toLowerCase(),
  };
}

export const posts = Object.entries(mdxModules)
  .map(normalizePost)
  .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

export const featuredPost = posts.find((post) => post.featured) ?? posts[0];

export const homePosts = posts.filter((post) => post.showOnHome).slice(0, 6);

export const archivePosts = posts.filter((post) => !post.featured);

export const allTags = Array.from(new Set(posts.flatMap((post) => post.tags ?? []))).sort();

export function findPostBySlug(slug) {
  return posts.find((post) => post.slug === slug);
}

export function postsByCategory(categoryId) {
  return posts.filter((post) => post.category === categoryId);
}

export function postsByTag(tag) {
  return posts.filter((post) => post.tags?.includes(tag));
}

export function postCountByCategory(categoryId) {
  return postsByCategory(categoryId).length;
}

export function relatedPostsFor(post, limit = 3) {
  return posts
    .filter((candidate) => candidate.slug !== post.slug && candidate.category === post.category)
    .slice(0, limit);
}
