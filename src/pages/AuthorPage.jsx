import { ArticleCard } from "../components/ArticleCard.jsx";
import { toPublicPath } from "../routes.js";

export function AuthorPage({ author, posts, onNavigate }) {
  return (
    <>
      <header className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-24 h-24 rounded-full object-cover mx-auto mb-5 border-4 border-white/70"
          />
          <p className="text-sm font-semibold uppercase tracking-wide opacity-90 mb-3">Author</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{author.name}</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">{author.bio}</p>
        </div>
      </header>

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">
                Articles by <span className="gradient-text">{author.name}</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {posts.length} published article{posts.length === 1 ? "" : "s"}.
              </p>
            </div>
            <a
              href={toPublicPath("/articles/")}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              onClick={(event) => {
                event.preventDefault();
                onNavigate("/articles/");
              }}
            >
              <i className="fas fa-arrow-left mr-2" />
              All Articles
            </a>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <ArticleCard
                  article={post}
                  key={post.slug}
                  showReadMore
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">
              No articles are currently published by this author.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
