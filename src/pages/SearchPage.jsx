import { useEffect, useMemo, useState } from "react";
import { ArticleCard } from "../components/ArticleCard.jsx";
import { searchPosts } from "../data/posts.js";
import { toPublicPath } from "../routes.js";

export function SearchPage({ search = "", onNavigate }) {
  const query = useMemo(() => new URLSearchParams(search).get("q") ?? "", [search]);
  const [input, setInput] = useState(query);
  const results = useMemo(() => searchPosts(query), [query]);

  useEffect(() => {
    setInput(query);
  }, [query]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalized = input.trim();
    const target = normalized ? `/search/?q=${encodeURIComponent(normalized)}` : "/search/";
    onNavigate(target);
  };

  return (
    <>
      <header className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Search <span className="gradient-text">Articles</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Find essays by title, author, category, tag, excerpt, or body text.
          </p>
        </div>
      </header>

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <form
            className="mb-10 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm"
            onSubmit={handleSubmit}
          >
            <label className="block text-sm font-semibold mb-2" htmlFor="site-search">
              Search query
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="site-search"
                type="search"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Try AI, sustainability, fiction, or an author name"
                className="search-input flex-grow px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-slate-800"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <i className="fas fa-search mr-2" />
                Search
              </button>
            </div>
          </form>

          {query ? (
            <>
              <div className="flex items-center justify-between gap-4 mb-8">
                <h2 className="text-2xl font-bold">
                  {results.length} result{results.length === 1 ? "" : "s"} for "{query}"
                </h2>
                <a
                  href={toPublicPath("/articles/")}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate("/articles/");
                  }}
                >
                  Browse all articles
                </a>
              </div>

              {results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {results.map((article) => (
                    <ArticleCard
                      article={article}
                      key={article.slug}
                      showReadMore
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>
              ) : (
                <EmptySearchState onNavigate={onNavigate} />
              )}
            </>
          ) : (
            <EmptyIntroState />
          )}
        </div>
      </main>
    </>
  );
}

function EmptyIntroState() {
  return (
    <section className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
      <i className="fas fa-magnifying-glass text-4xl text-indigo-500 mb-4" />
      <h2 className="text-2xl font-bold mb-3">Start with a keyword</h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
        Search supports article titles, excerpts, authors, categories, tags, and the MDX article text.
      </p>
    </section>
  );
}

function EmptySearchState({ onNavigate }) {
  return (
    <section className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-3">No matching articles</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Try a broader term or browse the full archive.
      </p>
      <a
        href={toPublicPath("/articles/")}
        className="inline-flex px-5 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
        onClick={(event) => {
          event.preventDefault();
          onNavigate("/articles/");
        }}
      >
        Browse Articles
      </a>
    </section>
  );
}
