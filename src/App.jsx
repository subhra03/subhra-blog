import { useEffect, useMemo, useState } from "react";
import { pageContent } from "./pageContent.js";

const routes = {
  "/": "home",
  "/index.html": "home",
  "/articles": "articles",
  "/articles.html": "articles",
  "/categories": "categories",
  "/categories.html": "categories",
  "/about": "about",
  "/about.html": "about",
};

const navItems = [
  { label: "Home", path: "/" },
  { label: "Articles", path: "/articles" },
  { label: "Categories", path: "/categories" },
  { label: "About", path: "/about" },
];

function currentPath() {
  return window.location.pathname || "/";
}

function resolvePage(pathname) {
  return routes[pathname] ?? "home";
}

function App() {
  const [path, setPath] = useState(currentPath);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const page = resolvePage(path);

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
    window.scrollTo({ top: 0 });
  }, [path]);

  const navigate = (target) => {
    if (target === path) return;
    window.history.pushState({}, "", target);
    setPath(target);
  };

  return (
    <>
      <ReadingProgress />
      <BackToTop />
      <Navigation
        currentPage={page}
        isMenuOpen={isMenuOpen}
        onNavigate={navigate}
        onToggleMenu={() => setIsMenuOpen((open) => !open)}
        onCloseMenu={() => setIsMenuOpen(false)}
        onToggleTheme={() => setIsDark((dark) => !dark)}
      />
      <PageContent page={page} onNavigate={navigate} />
      <Footer currentPage={page} onNavigate={navigate} />
    </>
  );
}

function Navigation({
  currentPage,
  isMenuOpen,
  onNavigate,
  onToggleMenu,
  onCloseMenu,
  onToggleTheme,
}) {
  const activeClass = "font-semibold text-indigo-600 dark:text-indigo-400";

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                type="button"
                className="flex items-center"
                onClick={() => onNavigate("/")}
                aria-label="Go to home"
              >
                <img src="/assets/logo.png" alt="Cosmic Blog Logo" className="h-8" />
              </button>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <NavButton
                  key={item.path}
                  item={item}
                  currentPage={currentPage}
                  activeClass={activeClass}
                  onNavigate={onNavigate}
                />
              ))}
              <button
                type="button"
                className="theme-toggle p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
                onClick={onToggleTheme}
                aria-label="Toggle theme"
              >
                <i className="fas fa-moon dark:hidden" />
                <i className="fas fa-sun hidden dark:block" />
              </button>
            </div>
            <div className="md:hidden flex items-center">
              <button
                type="button"
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700"
                onClick={onToggleMenu}
                aria-label="Open menu"
              >
                <i className="fas fa-bars" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white dark:bg-slate-900 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <button
              type="button"
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
              onClick={onCloseMenu}
              aria-label="Close menu"
            >
              <i className="fas fa-times" />
            </button>
            {navItems.map((item) => (
              <button
                type="button"
                key={item.path}
                className={`text-xl font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 ${
                  resolvePage(item.path) === currentPage ? activeClass : ""
                }`}
                onClick={() => onNavigate(item.path)}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
              onClick={onToggleTheme}
              aria-label="Toggle theme"
            >
              <i className="fas fa-moon dark:hidden text-xl" />
              <i className="fas fa-sun hidden dark:block text-xl" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function NavButton({ item, currentPage, activeClass, onNavigate }) {
  return (
    <button
      type="button"
      className={`nav-link text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 ${
        resolvePage(item.path) === currentPage ? activeClass : ""
      }`}
      onClick={() => onNavigate(item.path)}
    >
      {item.label}
    </button>
  );
}

function PageContent({ page, onNavigate }) {
  const html = useMemo(() => pageContent[page] ?? pageContent.home, [page]);

  usePageInteractions(page, onNavigate);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function Footer({ currentPage, onNavigate }) {
  const footerLinks = [
    ["Navigation", navItems],
    [
      "Categories",
      [
        { label: "Technology", path: "/categories" },
        { label: "Environment", path: "/categories" },
        { label: "Science", path: "/categories" },
        { label: "Literature", path: "/categories" },
      ],
    ],
    [
      "Legal",
      [
        { label: "Privacy Policy", path: "#" },
        { label: "Terms of Service", path: "#" },
        { label: "Cookie Policy", path: "#" },
        { label: "Contact", path: "/about" },
      ],
    ],
  ];

  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <button
              type="button"
              className="text-2xl font-bold gradient-text mb-4 inline-block"
              onClick={() => onNavigate("/")}
            >
              Cosmic
            </button>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Exploring ideas that shape our world and beyond.
            </p>
            <div className="flex space-x-4">
              {["twitter", "instagram", "linkedin", "github"].map((icon) => (
                <a
                  href="#"
                  key={icon}
                  className="text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400"
                  aria-label={icon}
                >
                  <i className={`fab fa-${icon}`} />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map(([title, links]) => (
            <div key={title}>
              <h3 className="text-lg font-semibold mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={`${title}-${link.label}`}>
                    <button
                      type="button"
                      className={`text-left text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 ${
                        resolvePage(link.path) === currentPage
                          ? "font-semibold text-indigo-600 dark:text-indigo-400"
                          : ""
                      }`}
                      onClick={() => link.path !== "#" && onNavigate(link.path)}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 dark:border-slate-700 mt-12 pt-8 text-center text-gray-500 dark:text-gray-400">
          <p>&copy; 2023 Cosmic Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function ReadingProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setWidth(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };

    update();
    window.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return <div id="reading-progress" style={{ width: `${width}%` }} />;
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.pageYOffset > 300);
    update();
    window.addEventListener("scroll", update);
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <button
      type="button"
      id="back-to-top"
      className={visible ? "visible" : ""}
      title="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
    >
      <i className="fas fa-arrow-up" />
    </button>
  );
}

function usePageInteractions(page, onNavigate) {
  useEffect(() => {
    const cleanup = [];

    const preventEmptyLinks = (event) => {
      const anchor = event.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (href === "#") {
        event.preventDefault();
        if (anchor.textContent.trim() === "View All") {
          onNavigate("/articles");
        }
      }
    };

    document.addEventListener("click", preventEmptyLinks);
    cleanup.push(() => document.removeEventListener("click", preventEmptyLinks));

    document.querySelectorAll("form").forEach((form) => {
      const onSubmit = (event) => event.preventDefault();
      form.addEventListener("submit", onSubmit);
      cleanup.push(() => form.removeEventListener("submit", onSubmit));
    });

    if (page === "home") {
      setupHomeFilters(cleanup);
      setupHeroButtons(cleanup, onNavigate);
    }

    if (page === "articles") {
      setupArticleControls(cleanup);
    }

    if (page === "categories") {
      setupCategoryTilt(cleanup);
    }

    return () => cleanup.forEach((dispose) => dispose());
  }, [page, onNavigate]);
}

function setupHeroButtons(cleanup, onNavigate) {
  const buttons = Array.from(document.querySelectorAll("section:first-of-type button"));
  const [startReading, subscribe] = buttons;

  if (startReading) {
    const click = () =>
      document.getElementById("articles-section")?.scrollIntoView({ behavior: "smooth" });
    startReading.addEventListener("click", click);
    cleanup.push(() => startReading.removeEventListener("click", click));
  }

  if (subscribe) {
    const click = () => {
      const emailInput = document.querySelector('input[type="email"]');
      emailInput?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => emailInput?.focus(), 300);
    };
    subscribe.addEventListener("click", click);
    cleanup.push(() => subscribe.removeEventListener("click", click));
  }
}

function setupHomeFilters(cleanup) {
  const categoryFilters = Array.from(document.querySelectorAll(".category-filter"));
  const articles = Array.from(document.querySelectorAll("#articles-container .card"));
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  let activeCategory = "all";

  const update = () => {
    const query = searchInput?.value.toLowerCase().trim() ?? "";

    articles.forEach((article) => {
      const matchesCategory =
        activeCategory === "all" || article.dataset.category === activeCategory;
      const title = article.querySelector("h3")?.textContent.toLowerCase() ?? "";
      const excerpt = article.querySelector("p")?.textContent.toLowerCase() ?? "";
      const matchesSearch = !query || title.includes(query) || excerpt.includes(query);
      article.style.display = matchesCategory && matchesSearch ? "block" : "none";
    });
  };

  categoryFilters.forEach((filter) => {
    const click = () => {
      activeCategory = filter.dataset.category;
      categoryFilters.forEach((item) => {
        item.classList.remove("bg-indigo-600", "text-white");
      });
      filter.classList.add("bg-indigo-600", "text-white");
      update();
    };
    filter.addEventListener("click", click);
    cleanup.push(() => filter.removeEventListener("click", click));
  });

  const search = () => update();
  const keyup = (event) => event.key === "Enter" && update();

  searchButton?.addEventListener("click", search);
  searchInput?.addEventListener("keyup", keyup);
  cleanup.push(() => {
    searchButton?.removeEventListener("click", search);
    searchInput?.removeEventListener("keyup", keyup);
  });
}

function setupArticleControls(cleanup) {
  const sortBy = document.getElementById("sort-by");
  const filterCategory = document.getElementById("filter-category");
  const searchInput = document.getElementById("articles-search");
  const searchButton = document.getElementById("articles-search-button");
  const grid = document.querySelector(".article-grid");

  if (!grid) return;

  const articles = Array.from(grid.querySelectorAll(".card"));
  const featured = articles.find((article) => article.classList.contains("featured-article"));
  const regularArticles = articles.filter((article) => article !== featured);

  const articleDate = (article) => {
    const text = article.querySelector(".text-sm span")?.textContent ?? "";
    return Number.isNaN(Date.parse(text)) ? 0 : Date.parse(text);
  };

  const update = () => {
    const category = filterCategory?.value ?? "all";
    const sort = sortBy?.value ?? "newest";
    const query = searchInput?.value.toLowerCase().trim() ?? "";

    const sorted = [...regularArticles].sort((a, b) => {
      if (sort === "oldest") return articleDate(a) - articleDate(b);
      if (sort === "popular") return 0;
      return articleDate(b) - articleDate(a);
    });

    grid.innerHTML = "";
    if (featured && (!query || featured.textContent.toLowerCase().includes(query))) {
      grid.appendChild(featured);
    }

    sorted.forEach((article) => {
      const matchesCategory = category === "all" || article.dataset.category === category;
      const matchesSearch = !query || article.textContent.toLowerCase().includes(query);
      if (matchesCategory && matchesSearch) {
        article.style.display = "block";
        grid.appendChild(article);
      }
    });
  };

  const search = () => update();
  const keyup = (event) => event.key === "Enter" && update();

  sortBy?.addEventListener("change", update);
  filterCategory?.addEventListener("change", update);
  searchButton?.addEventListener("click", search);
  searchInput?.addEventListener("keyup", keyup);

  cleanup.push(() => {
    sortBy?.removeEventListener("change", update);
    filterCategory?.removeEventListener("change", update);
    searchButton?.removeEventListener("click", search);
    searchInput?.removeEventListener("keyup", keyup);
  });
}

function setupCategoryTilt(cleanup) {
  Array.from(document.querySelectorAll(".category-card")).forEach((card) => {
    const move = (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const angleX = (y - rect.height / 2) / 20;
      const angleY = (rect.width / 2 - x) / 20;
      card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-5px)`;
    };
    const leave = () => {
      card.style.transform = "translateY(-5px)";
    };

    card.addEventListener("mousemove", move);
    card.addEventListener("mouseleave", leave);
    cleanup.push(() => {
      card.removeEventListener("mousemove", move);
      card.removeEventListener("mouseleave", leave);
    });
  });
}

export default App;
