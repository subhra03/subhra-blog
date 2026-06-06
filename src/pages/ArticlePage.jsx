import { ArticleCard } from "../components/ArticleCard.jsx";
import { categoryMeta } from "../data/articles.js";
import { relatedPostsFor } from "../data/posts.js";
import { toPublicPath } from "../routes.js";

export function ArticlePage({ post, onNavigate }) {
  const category = categoryMeta[post.category];
  const relatedPosts = relatedPostsFor(post);
  const PostContent = post.Component;

  return (
    <>
      <header className="px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto py-16">
          <a
            href={toPublicPath("/articles/")}
            className="mb-8 text-white/90 hover:text-white font-medium"
            onClick={(event) => {
              event.preventDefault();
              onNavigate("/articles/");
            }}
          >
            <i className="fas fa-arrow-left mr-2" />
            Articles
          </a>
          <div className="mb-5">
            <span
              className={`inline-block px-3 py-1 ${
                category?.badgeClass ?? "bg-indigo-600"
              } text-white text-xs font-medium rounded-full`}
            >
              {category?.label ?? post.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
          <p className="text-xl opacity-90 mb-8">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 text-white/90">
            <div className="flex items-center">
              <img src={post.authorImage} alt={post.author} className="w-10 h-10 rounded-full mr-3" />
              <span className="font-medium">{post.author}</span>
            </div>
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </header>

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <article className="max-w-4xl mx-auto">
          <img
            src={post.image}
            alt={post.imageAlt}
            className="w-full h-72 md:h-96 object-cover rounded-xl shadow-sm mb-10"
          />
          <div className="article-prose">
            <PostContent />
          </div>
          {post.tags?.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3">
              {post.tags.map((tag) => (
                <a
                  href={toPublicPath(`/tags/${encodeURIComponent(tag)}/`)}
                  key={tag}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors"
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate(`/tags/${encodeURIComponent(tag)}/`);
                  }}
                >
                  #{tag}
                </a>
              ))}
            </div>
          )}
        </article>

        {relatedPosts.length > 0 && (
          <section className="max-w-7xl mx-auto mt-16">
            <h2 className="text-3xl font-bold mb-8">
              Related <span className="gradient-text">Articles</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <ArticleCard
                  key={relatedPost.slug}
                  article={relatedPost}
                  showReadMore
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
