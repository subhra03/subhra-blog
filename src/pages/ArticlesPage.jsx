import { useMemo, useState } from "react";
import { ArticleCard } from "../components/ArticleCard.jsx";
import { TagCloud } from "../components/TagCloud.jsx";
import { categoryMeta } from "../data/articles.js";
import { allTags, archivePosts, featuredPost } from "../data/posts.js";

export function ArticlesPage({ onNavigate }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");

  const filteredArticles = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return [...archivePosts]
      .filter((article) => {
        const matchesCategory = category === "all" || article.category === category;
        const matchesQuery =
          !normalized ||
          article.title.toLowerCase().includes(normalized) ||
          article.excerpt.toLowerCase().includes(normalized) ||
          article.author.toLowerCase().includes(normalized);
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sort === "popular") return b.popularity - a.popularity;
        const aDate = Date.parse(a.date);
        const bDate = Date.parse(b.date);
        return sort === "oldest" ? aDate - bDate : bDate - aDate;
      });
  }, [category, query, sort]);

  const showFeatured =
    (category === "all" || featuredPost.category === category) &&
    (!query.trim() ||
      `${featuredPost.title} ${featuredPost.excerpt} ${featuredPost.author}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()));

  return (
    <>
      <PageHeader
        titleStart="All"
        titleHighlight="Articles"
        text="Browse our complete collection of articles on technology, science, environment, and more."
      />
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="relative flex-grow max-w-2xl">
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search articles..."
                  className="search-input w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-slate-800"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400"
                  aria-label="Search"
                >
                  <i className="fas fa-search" />
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-slate-800"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                </select>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-slate-800"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(categoryMeta).map(([value, meta]) => (
                    <option value={value} key={value}>
                      {meta.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="article-grid mb-12">
            {showFeatured && (
              <ArticleCard article={featuredPost} featured showReadMore onNavigate={onNavigate} />
            )}
            {filteredArticles.map((article) => (
              <ArticleCard
                article={article}
                key={article.id}
                showReadMore
                onNavigate={onNavigate}
              />
            ))}
          </div>
          {!showFeatured && filteredArticles.length === 0 && (
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
              No articles match your search.
            </p>
          )}

          <div className="pagination mb-12">
            <button type="button" className="hover:bg-indigo-500 hover:text-white hover:border-transparent">
              <i className="fas fa-chevron-left" />
            </button>
            <button type="button" className="hover:bg-indigo-500 hover:text-white hover:border-transparent">1</button>
            <span className="current">2</span>
            <button type="button" className="hover:bg-indigo-500 hover:text-white hover:border-transparent">3</button>
            <button type="button" className="hover:bg-indigo-500 hover:text-white hover:border-transparent">4</button>
            <button type="button" className="hover:bg-indigo-500 hover:text-white hover:border-transparent">5</button>
            <button type="button" className="hover:bg-indigo-500 hover:text-white hover:border-transparent">
              <i className="fas fa-chevron-right" />
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm mb-12">
            <h3 className="text-xl font-bold mb-6">
              Browse by <span className="gradient-text">Tags</span>
            </h3>
            <TagCloud tags={allTags} onNavigate={onNavigate} />
          </div>
        </div>
      </main>
    </>
  );
}

function PageHeader({ titleStart, titleHighlight, text }) {
  return (
    <header className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {titleStart} <span className="gradient-text">{titleHighlight}</span>
        </h1>
        <p className="text-xl max-w-3xl mx-auto opacity-90">{text}</p>
      </div>
    </header>
  );
}
