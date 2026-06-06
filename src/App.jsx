import { useCallback, useEffect, useState } from "react";
import { BackToTop } from "./components/BackToTop.jsx";
import { Footer } from "./components/Footer.jsx";
import { Navigation } from "./components/Navigation.jsx";
import { ReadingProgress } from "./components/ReadingProgress.jsx";
import { AboutPage } from "./pages/AboutPage.jsx";
import { AuthorPage } from "./pages/AuthorPage.jsx";
import { ArticlesPage } from "./pages/ArticlesPage.jsx";
import { CategoriesPage } from "./pages/CategoriesPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { ArticlePage } from "./pages/ArticlePage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
import { findCategoryById } from "./data/siteData.js";
import {
  allTags,
  findAuthorBySlug,
  findPostBySlug,
  isValidArticlePage,
  postsByAuthor,
  postsByCategory,
  postsByTag,
} from "./data/posts.js";
import { CategoryPostsPage, TagPostsPage } from "./pages/PostListPage.jsx";
import { SearchPage } from "./pages/SearchPage.jsx";
import { parseRoute, stripBasePath, toPublicPath } from "./routes.js";
import { applySeo, seoForPath } from "./seo.js";

function currentPath() {
  if (typeof window === "undefined") return "/";
  return stripBasePath(`${window.location.pathname || "/"}${window.location.search || ""}`);
}

function App({ initialPath }) {
  const [path, setPath] = useState(initialPath ?? currentPath);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    return saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const route = parseRoute(path);
  const post = route.page === "article" ? findPostBySlug(route.slug) : null;
  const category = route.page === "category" ? findCategoryById(route.categoryId) : null;
  const author = route.page === "author" ? findAuthorBySlug(route.authorSlug) : null;
  const tagExists = route.page === "tag" ? allTags.includes(route.tag) : false;
  const page = resolveValidPage(route, { post, category, author, tagExists });
  const activePage = ["article", "tag", "author"].includes(page)
    ? "articles"
    : page === "search"
      ? "search"
    : page === "category"
      ? "categories"
      : page;

  useEffect(() => {
    const onPopState = () => setPath(currentPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.body.classList.toggle("dark-mode", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    setIsMenuOpen(false);
    applySeo(seoForPath(path));
    window.scrollTo({ top: 0 });
  }, [path]);

  const navigate = useCallback(
    (target) => {
      const nextPath = stripBasePath(target);
      if (nextPath === path) return;
      window.history.pushState({}, "", toPublicPath(nextPath));
      setPath(nextPath);
    },
    [path]
  );

  return (
    <>
      <ReadingProgress />
      <BackToTop />
      <Navigation
        currentPage={activePage}
        isMenuOpen={isMenuOpen}
        onNavigate={navigate}
        onToggleMenu={() => setIsMenuOpen((open) => !open)}
        onCloseMenu={() => setIsMenuOpen(false)}
        onToggleTheme={() => setIsDark((dark) => !dark)}
      />
      <CurrentPage
        page={page}
        post={post}
        categoryId={route.categoryId}
        author={author}
        authorSlug={route.authorSlug}
        pageNumber={route.pageNumber}
        search={route.search}
        tag={route.tag}
        onNavigate={navigate}
      />
      <Footer currentPage={activePage} onNavigate={navigate} />
    </>
  );
}

function CurrentPage({ page, post, categoryId, author, authorSlug, pageNumber, search, tag, onNavigate }) {
  switch (page) {
    case "article":
      return <ArticlePage post={post} onNavigate={onNavigate} />;
    case "articles":
      return <ArticlesPage pageNumber={pageNumber ?? 1} onNavigate={onNavigate} />;
    case "search":
      return <SearchPage search={search} onNavigate={onNavigate} />;
    case "categories":
      return <CategoriesPage onNavigate={onNavigate} />;
    case "category":
      return (
        <CategoryPostsPage
          categoryId={categoryId}
          posts={postsByCategory(categoryId)}
          onNavigate={onNavigate}
        />
      );
    case "tag":
      return <TagPostsPage tag={tag} posts={postsByTag(tag)} onNavigate={onNavigate} />;
    case "author":
      return (
        <AuthorPage
          author={author}
          posts={postsByAuthor(authorSlug)}
          onNavigate={onNavigate}
        />
      );
    case "about":
      return <AboutPage />;
    case "notFound":
      return <NotFoundPage onNavigate={onNavigate} />;
    default:
      return <HomePage onNavigate={onNavigate} />;
  }
}

function resolveValidPage(route, { post, category, author, tagExists }) {
  if (route.page === "articles" && !isValidArticlePage(route.pageNumber ?? 1)) return "notFound";
  if (route.page === "article" && !post) return "notFound";
  if (route.page === "category" && !category) return "notFound";
  if (route.page === "author" && !author) return "notFound";
  if (route.page === "tag" && !tagExists) return "notFound";
  return route.page;
}

export default App;
