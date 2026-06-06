import { navItems } from "../data/siteData.js";
import { resolvePage, toPublicPath } from "../routes.js";

export function Navigation({
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
              <a
                href={toPublicPath("/")}
                className="flex items-center"
                onClick={(event) => handleNavigate(event, "/", onNavigate)}
                aria-label="Go to home"
              >
                <img src={toPublicPath("/assets/logo.png")} alt="Cosmic Blog Logo" className="h-8" />
              </a>
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
              <ThemeButton onToggleTheme={onToggleTheme} />
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
              <a
                href={toPublicPath(item.path)}
                key={item.path}
                className={`text-xl font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 ${
                  resolvePage(item.path) === currentPage ? activeClass : ""
                }`}
                onClick={(event) => handleNavigate(event, item.path, onNavigate)}
              >
                {item.label}
              </a>
            ))}
            <ThemeButton onToggleTheme={onToggleTheme} mobile />
          </div>
        </div>
      )}
    </>
  );
}

function NavButton({ item, currentPage, activeClass, onNavigate }) {
  return (
    <a
      href={toPublicPath(item.path)}
      className={`nav-link text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 ${
        resolvePage(item.path) === currentPage ? activeClass : ""
      }`}
      onClick={(event) => handleNavigate(event, item.path, onNavigate)}
    >
      {item.label}
    </a>
  );
}

function ThemeButton({ onToggleTheme, mobile = false }) {
  return (
    <button
      type="button"
      className={`${mobile ? "p-3" : "theme-toggle p-2"} rounded-full hover:bg-gray-100 dark:hover:bg-slate-700`}
      onClick={onToggleTheme}
      aria-label="Toggle theme"
    >
      <i className={`fas fa-moon dark:hidden ${mobile ? "text-xl" : ""}`} />
      <i className={`fas fa-sun hidden dark:block ${mobile ? "text-xl" : ""}`} />
    </button>
  );
}

function handleNavigate(event, path, onNavigate) {
  event.preventDefault();
  onNavigate(path);
}
