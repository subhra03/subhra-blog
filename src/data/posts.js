const mdxModules = import.meta.glob("../content/articles/*.mdx", {
  eager: true,
});

const mdxSources = import.meta.glob("../content/articles/*.mdx", {
  eager: true,
  query: "?raw",
  import: "default",
});

export const ARTICLES_PER_PAGE = 6;

const tocBySlug = {
  "circular-economy": toc(
    "Design Comes First",
    "Business Models Matter",
    "Supply Chains Need Visibility",
    "Less Waste, Better Value"
  ),
  "future-ai-everyday-life": toc(
    "Assistance Becomes Ambient",
    "Trust Needs Design",
    "Ethics Moves Into Product Details",
    "A Better Everyday AI"
  ),
  "future-human-computer-interaction": toc(
    "Spatial Computing Becomes Ordinary",
    "Interfaces Start Reading Context",
    "Neural Input Is Still Early",
    "The Real Future Is Mixed"
  ),
  "generative-ai-ethics": toc(
    "Tools Change Workflows",
    "Training Data Is A Core Issue",
    "Credit And Disclosure",
    "Human Taste Still Matters"
  ),
  "magical-realism": toc(
    "Why The Mode Fits Now",
    "The Mundane Makes The Magic Work",
    "Memory And Inheritance",
    "A Durable Literary Tool"
  ),
  "modernist-novel": toc(
    "Interior Life Remains Central",
    "Fragmentation Feels Familiar",
    "Experimentation Needs Purpose",
    "A Living Tradition"
  ),
  "quantum-computing-encryption": toc(
    "Why Encryption Is Exposed",
    "Symmetric Encryption Is Different",
    "Harvest Now, Decrypt Later",
    "The Path Forward"
  ),
  "quantum-entanglement": toc(
    "Correlation Without A Simple Cause",
    "Experiments Changed The Debate",
    "Why It Matters",
    "A New Kind Of Intuition"
  ),
  "rewilding-projects": toc(
    "Species Can Rebuild Systems",
    "People Remain Part Of The Picture",
    "Measuring Success Is Complex",
    "Recovery At Scale"
  ),
  "search-for-exoplanets": toc(
    "Finding Distant Worlds",
    "Atmospheres Are The Next Frontier",
    "Habitability Is Complicated",
    "A Larger Perspective"
  ),
  "urban-green-spaces": toc(
    "Nature Lowers Cognitive Load",
    "Access Matters More Than Acreage",
    "Design For Use, Not Just Beauty",
    "A Healthier City Pattern"
  ),
  "web-development-evolution": toc(
    "Documents Became Interfaces",
    "Frameworks Changed The Mental Model",
    "WebAssembly Expands The Platform",
    "The Future Is Capability And Discipline"
  ),
};

function slugFromPath(path) {
  return path.split("/").pop().replace(/\.mdx$/, "");
}

function normalizePost([path, module]) {
  const meta = module.meta ?? {};
  const slug = meta.slug ?? slugFromPath(path);
  const tags = meta.tags ?? [];
  const rawContent = rawSourceForPath(path);
  const authorSlug = slugify(meta.author ?? "author");

  return {
    ...meta,
    id: slug,
    slug,
    tags,
    authorSlug,
    authorPath: `/authors/${authorSlug}/`,
    path: `/articles/${slug}/`,
    Component: module.default,
    toc: meta.toc ?? tocBySlug[slug] ?? extractToc(rawContent),
    searchText: [
      meta.title,
      meta.excerpt,
      meta.author,
      meta.category,
      tags.join(" "),
      meta.searchText,
      stripMdxSource(rawContent),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  };
}

export const posts = Object.entries(mdxModules)
  .map(normalizePost)
  .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

export const featuredPost = posts.find((post) => post.featured) ?? posts[0];

export const homePosts = posts.filter((post) => post.showOnHome).slice(0, 6);

export const archivePosts = posts.filter((post) => !post.featured);

export const allTags = Array.from(new Set(posts.flatMap((post) => post.tags ?? []))).sort();

export const articlePageCount = Math.max(1, Math.ceil(posts.length / ARTICLES_PER_PAGE));

export const authors = Array.from(
  posts
    .reduce((map, post) => {
      if (!map.has(post.authorSlug)) {
        map.set(post.authorSlug, {
          name: post.author,
          slug: post.authorSlug,
          path: post.authorPath,
          avatar: post.authorImage,
          bio: `${post.author} writes thoughtful notes on ${authorTopicsFor(post.author)}.`,
        });
      }

      return map;
    }, new Map())
    .values()
);

export function findPostBySlug(slug) {
  return posts.find((post) => post.slug === slug);
}

export function articlePagePath(pageNumber) {
  return pageNumber <= 1 ? "/articles/" : `/articles/page/${pageNumber}/`;
}

export function postsForArticlePage(pageNumber = 1) {
  const page = Number.isFinite(pageNumber) ? pageNumber : 1;
  const start = (page - 1) * ARTICLES_PER_PAGE;
  return posts.slice(start, start + ARTICLES_PER_PAGE);
}

export function isValidArticlePage(pageNumber = 1) {
  return Number.isInteger(pageNumber) && pageNumber >= 1 && pageNumber <= articlePageCount;
}

export function postsByCategory(categoryId) {
  return posts.filter((post) => post.category === categoryId);
}

export function postsByTag(tag) {
  return posts.filter((post) => post.tags?.includes(tag));
}

export function findAuthorBySlug(slug) {
  return authors.find((author) => author.slug === slug);
}

export function postsByAuthor(authorSlug) {
  return posts.filter((post) => post.authorSlug === authorSlug);
}

export function postCountByCategory(categoryId) {
  return postsByCategory(categoryId).length;
}

export function relatedPostsFor(post, limit = 3) {
  return posts
    .filter((candidate) => candidate.slug !== post.slug && candidate.category === post.category)
    .slice(0, limit);
}

export function previousAndNextPosts(post) {
  const index = posts.findIndex((candidate) => candidate.slug === post.slug);

  return {
    previous: index > 0 ? posts[index - 1] : null,
    next: index >= 0 && index < posts.length - 1 ? posts[index + 1] : null,
  };
}

export function searchPosts(query) {
  const terms = normalizeSearchTerms(query);
  if (terms.length === 0) return [];

  return posts.filter((post) => terms.every((term) => post.searchText.includes(term)));
}

function normalizeSearchTerms(query) {
  return String(query ?? "")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function authorTopicsFor(authorName) {
  const categories = Array.from(
    new Set(
      posts
        .filter((post) => post.author === authorName)
        .map((post) => post.category)
        .filter(Boolean)
    )
  );

  return categories.length > 0 ? categories.join(", ") : "the ideas they are exploring";
}

function extractToc(source) {
  return String(source)
    .split(/\r?\n/)
    .map((line) => line.match(/^(#{2,3})\s+(.+)$/))
    .filter(Boolean)
    .map((match) => {
      const title = match[2].trim();
      return {
        id: slugify(title),
        level: match[1].length,
        title,
      };
    });
}

function toc(...titles) {
  return titles.map((title) => ({
    id: slugify(title),
    level: 2,
    title,
  }));
}

function rawSourceForPath(path) {
  const source = mdxSources[path] ?? mdxSources[`${path}?raw`] ?? "";
  return typeof source === "string" ? source : source.default ?? "";
}

function stripMdxSource(source) {
  return String(source)
    .replace(/export const meta = \{[\s\S]*?\};/, " ")
    .replace(/[`*_#[\](){}:;,.!?'"<>/\\|-]/g, " ");
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
