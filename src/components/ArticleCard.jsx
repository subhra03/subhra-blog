import { categoryMeta } from "../data/articles.js";
import { toPublicPath } from "../routes.js";

export function ArticleCard({ article, featured = false, showReadMore = false, onNavigate }) {
  const category = categoryMeta[article.category];
  const badgeClass = category?.badgeClass ?? "bg-indigo-600";
  const label = category?.label ?? article.category;

  if (featured) {
    return (
      <article className="card featured-article rounded-xl overflow-hidden">
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={article.image}
            alt={article.imageAlt}
            className="w-full h-full object-cover article-image"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <span className={`inline-block px-3 py-1 ${badgeClass} text-white text-xs font-medium rounded-full mb-2`}>
              {label}
            </span>
            <h3 className="text-2xl font-bold text-white mb-2">{article.title}</h3>
            <ArticleMeta article={article} light />
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">{article.excerpt}</p>
          <div className="flex items-center justify-between">
            <Author article={article} onNavigate={onNavigate} />
            {showReadMore && <ReadMoreButton article={article} onNavigate={onNavigate} />}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="card rounded-xl overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.image}
          alt={article.imageAlt}
          className="w-full h-full object-cover article-image"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <span className={`inline-block px-3 py-1 ${badgeClass} text-white text-xs font-medium rounded-full`}>
            {label}
          </span>
        </div>
      </div>
      <div className="p-6">
        <ArticleMeta article={article} />
        <h3 className="text-xl font-bold mb-3">{article.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{article.excerpt}</p>
        <div className="flex items-center justify-between">
          <Author article={article} onNavigate={onNavigate} />
          {showReadMore && <ReadMoreButton article={article} onNavigate={onNavigate} />}
        </div>
      </div>
    </article>
  );
}

function ArticleMeta({ article, light = false }) {
  const colorClass = light ? "text-white/90" : "text-gray-500 dark:text-gray-400";

  return (
    <div className={`flex items-center text-sm ${colorClass} mb-2`}>
      <span>{article.date}</span>
      <span className="mx-2">•</span>
      <span>{article.readTime}</span>
    </div>
  );
}

function Author({ article, onNavigate }) {
  return (
    <a
      href={toPublicPath(article.authorPath)}
      className="flex items-center text-left hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      onClick={(event) => {
        if (!onNavigate) return;
        event.preventDefault();
        onNavigate(article.authorPath);
      }}
    >
      <img src={article.authorImage} alt={article.author} className="w-8 h-8 rounded-full mr-2" />
      <span className="text-sm font-medium">{article.author}</span>
    </a>
  );
}

function ReadMoreButton({ article, onNavigate }) {
  return (
    <a
      href={toPublicPath(article.path)}
      className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
      onClick={(event) => {
        if (!onNavigate) return;
        event.preventDefault();
        onNavigate(article.path);
      }}
    >
      Read More
    </a>
  );
}
