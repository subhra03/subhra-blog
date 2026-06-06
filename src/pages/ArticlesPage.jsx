import { ArticleCard } from "../components/ArticleCard.jsx";
import { TagCloud } from "../components/TagCloud.jsx";
import {
  allTags,
  articlePageCount,
  articlePagePath,
  postsForArticlePage,
} from "../data/posts.js";
import { toPublicPath } from "../routes.js";

export function ArticlesPage({ pageNumber = 1, onNavigate }) {
  const articles = postsForArticlePage(pageNumber);

  return (
    <>
      <PageHeader
        titleStart={pageNumber > 1 ? `Articles Page ${pageNumber}` : "All"}
        titleHighlight={pageNumber > 1 ? "" : "Articles"}
        text="Browse the complete collection of essays, notes, and analysis."
      />
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold mb-1">Looking for something specific?</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Search by title, topic, author, category, tag, or article content.
                </p>
              </div>
              <a
                href={toPublicPath("/search/")}
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate("/search/");
                }}
              >
                <i className="fas fa-search mr-2" />
                Search Articles
              </a>
            </div>
          </div>

          <div className="article-grid mb-12">
            {articles.map((article) => (
              <ArticleCard
                article={article}
                key={article.id}
                showReadMore
                onNavigate={onNavigate}
              />
            ))}
          </div>

          <Pagination currentPage={pageNumber} onNavigate={onNavigate} />

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
          {titleStart} {titleHighlight && <span className="gradient-text">{titleHighlight}</span>}
        </h1>
        <p className="text-xl max-w-3xl mx-auto opacity-90">{text}</p>
      </div>
    </header>
  );
}

function Pagination({ currentPage, onNavigate }) {
  if (articlePageCount <= 1) return null;

  return (
    <nav className="pagination mb-12" aria-label="Article pagination">
      <PageLink
        pageNumber={currentPage - 1}
        disabled={currentPage === 1}
        label={<i className="fas fa-chevron-left" />}
        ariaLabel="Previous page"
        onNavigate={onNavigate}
      />
      {Array.from({ length: articlePageCount }, (_, index) => index + 1).map((pageNumber) =>
        pageNumber === currentPage ? (
          <span className="current" key={pageNumber} aria-current="page">
            {pageNumber}
          </span>
        ) : (
          <PageLink
            key={pageNumber}
            pageNumber={pageNumber}
            label={pageNumber}
            ariaLabel={`Page ${pageNumber}`}
            onNavigate={onNavigate}
          />
        )
      )}
      <PageLink
        pageNumber={currentPage + 1}
        disabled={currentPage === articlePageCount}
        label={<i className="fas fa-chevron-right" />}
        ariaLabel="Next page"
        onNavigate={onNavigate}
      />
    </nav>
  );
}

function PageLink({ pageNumber, label, ariaLabel, disabled = false, onNavigate }) {
  const path = articlePagePath(pageNumber);

  if (disabled) {
    return (
      <span className="opacity-40 cursor-not-allowed" aria-label={ariaLabel}>
        {label}
      </span>
    );
  }

  return (
    <a
      href={toPublicPath(path)}
      aria-label={ariaLabel}
      onClick={(event) => {
        event.preventDefault();
        onNavigate(path);
      }}
    >
      {label}
    </a>
  );
}
