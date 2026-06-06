import { ArticleCard } from "../components/ArticleCard.jsx";
import { categoryMeta } from "../data/articles.js";
import { findCategoryById } from "../data/siteData.js";
import { toPublicPath } from "../routes.js";

export function CategoryPostsPage({ categoryId, posts, onNavigate }) {
  const category = findCategoryById(categoryId);
  const title = category?.title ?? categoryMeta[categoryId]?.label ?? categoryId;

  return (
    <PostListLayout
      eyebrow="Category"
      title={title}
      description={`Browse every Cosmic Blog article filed under ${title}.`}
      posts={posts}
      emptyText={`No articles are currently published in ${title}.`}
      onNavigate={onNavigate}
    />
  );
}

export function TagPostsPage({ tag, posts, onNavigate }) {
  return (
    <PostListLayout
      eyebrow="Tag"
      title={`#${tag}`}
      description={`Browse every Cosmic Blog article tagged with #${tag}.`}
      posts={posts}
      emptyText={`No articles are currently tagged with #${tag}.`}
      onNavigate={onNavigate}
    />
  );
}

function PostListLayout({ eyebrow, title, description, posts, emptyText, onNavigate }) {
  return (
    <>
      <header className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-wide opacity-90 mb-3">{eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">{description}</p>
        </div>
      </header>

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
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
                  key={post.slug}
                  article={post}
                  showReadMore
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">{emptyText}</p>
          )}
        </div>
      </main>
    </>
  );
}
