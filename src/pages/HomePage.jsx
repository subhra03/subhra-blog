import { useMemo, useState } from "react";
import { ArticleCard } from "../components/ArticleCard.jsx";
import { NewsletterForm } from "../components/NewsletterForm.jsx";
import { TagCloud } from "../components/TagCloud.jsx";
import { allTags, homePosts } from "../data/posts.js";
import { heroFeatures } from "../data/siteData.js";
import { toPublicPath } from "../routes.js";

const filters = [
  { label: "All", value: "all", className: "bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200" },
  { label: "Technology", value: "technology", className: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200" },
  { label: "Environment", value: "environment", className: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" },
  { label: "Literature", value: "literature", className: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200" },
  { label: "Science", value: "science", className: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200" },
];

export function HomePage({ onNavigate }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const filteredArticles = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return homePosts.filter((article) => {
      const matchesCategory = category === "all" || article.category === category;
      const matchesQuery =
        !normalized ||
        article.title.toLowerCase().includes(normalized) ||
        article.excerpt.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <>
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Explore <span className="gradient-text">Thoughts & Notes</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10">
              Read thought-provoking articles, insightful analyses, and creative notes.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-medium hover:opacity-90 transition-opacity"
                onClick={() => document.getElementById("articles-section")?.scrollIntoView({ behavior: "smooth" })}
              >
                Start Reading
              </button>
              <button
                type="button"
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => document.getElementById("newsletter-section")?.scrollIntoView({ behavior: "smooth" })}
              >
                Subscribe
              </button>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {heroFeatures.map((feature) => (
              <div className="relative overflow-hidden rounded-xl card p-6" key={feature.title}>
                <div className={`absolute -right-10 -top-10 w-32 h-32 ${feature.accentClass} rounded-full opacity-20`} />
                <div className="relative z-10">
                  <div className={`w-12 h-12 ${feature.iconBgClass} rounded-lg flex items-center justify-center mb-4`}>
                    <i className={`fas ${feature.icon} ${feature.iconClass}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search articles..."
                className="search-input w-full md:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400"
                aria-label="Search"
              >
                <i className="fas fa-search" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  type="button"
                  key={filter.value}
                  className={`px-3 py-1 rounded-full ${
                    category === filter.value ? "bg-indigo-600 text-white" : filter.className
                  }`}
                  onClick={() => setCategory(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900" id="articles-section">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">
              Featured <span className="gradient-text">Articles</span>
            </h2>
            <a
              href={toPublicPath("/articles/")}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              onClick={(event) => {
                event.preventDefault();
                onNavigate("/articles/");
              }}
            >
              View All
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <ArticleCard article={article} key={article.id} showReadMore onNavigate={onNavigate} />
            ))}
          </div>
          {filteredArticles.length === 0 && (
            <p className="text-center text-gray-600 dark:text-gray-400">No articles match your filters.</p>
          )}
        </div>
      </section>

      <section
        id="newsletter-section"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with Thoughts & Notes</h2>
          <p className="text-lg mb-8 opacity-90">
            Subscribe to our newsletter and never miss a new article or update.
          </p>
          <NewsletterForm />
          <p className="text-sm mt-4 opacity-70">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Popular <span className="gradient-text">Tags</span>
          </h2>
          <TagCloud tags={allTags.slice(0, 15)} centered onNavigate={onNavigate} />
        </div>
      </section>
    </>
  );
}
