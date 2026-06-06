import { useMemo, useState } from "react";
import { ArticleCard } from "../components/ArticleCard.jsx";
import { categoryMeta } from "../data/articles.js";
import { previousAndNextPosts, relatedPostsFor, slugify } from "../data/posts.js";
import { toPublicPath } from "../routes.js";

export function ArticlePage({ post, onNavigate }) {
  const category = categoryMeta[post.category];
  const relatedPosts = relatedPostsFor(post);
  const { previous, next } = previousAndNextPosts(post);
  const [copied, setCopied] = useState(false);
  const shareUrl = useMemo(() => getShareUrl(post.path), [post.path]);
  const PostContent = post.Component;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

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
            <a
              href={toPublicPath(post.authorPath)}
              className="flex items-center hover:text-white"
              onClick={(event) => {
                event.preventDefault();
                onNavigate(post.authorPath);
              }}
            >
              <img src={post.authorImage} alt={post.author} className="w-10 h-10 rounded-full mr-3" />
              <span className="font-medium">{post.author}</span>
            </a>
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
          <ArticleToolbar post={post} shareUrl={shareUrl} copied={copied} onCopyLink={copyLink} />
          {post.toc?.length > 0 && <TableOfContents items={post.toc} />}
          <div className="article-prose">
            <PostContent components={mdxComponents} />
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

        <PreviousNext previous={previous} next={next} onNavigate={onNavigate} />

        <CommentsPlaceholder />

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

function ArticleToolbar({ post, shareUrl, copied, onCopyLink }) {
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(post.title);

  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Share this article or save it for later.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          X/Twitter
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          LinkedIn
        </a>
        <button
          type="button"
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          onClick={onCopyLink}
        >
          {copied ? "Copied" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}

function TableOfContents({ items }) {
  return (
    <aside className="mb-10 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-5">
      <h2 className="text-lg font-bold mb-3">Table of contents</h2>
      <ol className="space-y-2 text-sm">
        {items.map((item) => (
          <li className={item.level === 3 ? "ml-4" : ""} key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function PreviousNext({ previous, next, onNavigate }) {
  if (!previous && !next) return null;

  return (
    <nav className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-4" aria-label="Article navigation">
      <ArticleNavLink label="Previous Article" article={previous} onNavigate={onNavigate} />
      <ArticleNavLink label="Next Article" article={next} onNavigate={onNavigate} alignRight />
    </nav>
  );
}

function ArticleNavLink({ label, article, onNavigate, alignRight = false }) {
  if (!article) {
    return <div className="hidden md:block" />;
  }

  return (
    <a
      href={toPublicPath(article.path)}
      className={`card rounded-xl p-5 block ${alignRight ? "md:text-right" : ""}`}
      onClick={(event) => {
        event.preventDefault();
        onNavigate(article.path);
      }}
    >
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <h3 className="text-lg font-bold mt-1">{article.title}</h3>
    </a>
  );
}

function CommentsPlaceholder() {
  return (
    <section className="max-w-4xl mx-auto mt-12 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6">
      <h2 className="text-2xl font-bold mb-3">Comments</h2>
      <p className="text-gray-600 dark:text-gray-400">
        Comments can be connected with Giscus when you are ready to use GitHub Discussions for reader feedback.
      </p>
    </section>
  );
}

const mdxComponents = {
  h2: Heading2,
  h3: Heading3,
};

function Heading2({ children }) {
  return <h2 id={slugify(textFromChildren(children))}>{children}</h2>;
}

function Heading3({ children }) {
  return <h3 id={slugify(textFromChildren(children))}>{children}</h3>;
}

function textFromChildren(children) {
  if (Array.isArray(children)) return children.map(textFromChildren).join("");
  return String(children ?? "");
}

function getShareUrl(path) {
  if (typeof window !== "undefined") return window.location.href;
  return `https://subhra03.github.io/subhra-blog${path}`;
}
