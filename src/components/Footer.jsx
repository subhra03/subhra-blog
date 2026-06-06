import { navItems } from "../data/siteData.js";
import { resolvePage, toPublicPath } from "../routes.js";

const footerGroups = [
  ["Navigation", navItems],
  [
    "Categories",
    [
      { label: "Technology", path: "/categories/technology/" },
      { label: "Environment", path: "/categories/environment/" },
      { label: "Science", path: "/categories/science/" },
      { label: "Literature", path: "/categories/literature/" },
    ],
  ],
  [
    "Legal",
    [
      { label: "Privacy Policy", path: "#" },
      { label: "Terms of Service", path: "#" },
      { label: "Cookie Policy", path: "#" },
      { label: "Contact", path: "/about/" },
    ],
  ],
];

export function Footer({ currentPage, onNavigate }) {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <a
              href={toPublicPath("/")}
              className="text-2xl font-bold gradient-text mb-4 inline-block"
              onClick={(event) => handleNavigate(event, "/", onNavigate)}
            >
              Thoughts & Notes
            </a>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Exploring ideas that shape how we think, build, and live.
            </p>
            <div className="flex space-x-4">
              {["twitter", "instagram", "linkedin", "github"].map((icon) => (
                <button
                  type="button"
                  key={icon}
                  className="text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400"
                  aria-label={icon}
                >
                  <i className={`fab fa-${icon}`} />
                </button>
              ))}
            </div>
          </div>

          {footerGroups.map(([title, links]) => (
            <div key={title}>
              <h3 className="text-lg font-semibold mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={`${title}-${link.label}`}>
                    {link.path === "#" ? (
                      <button
                        type="button"
                        className="text-left text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        href={toPublicPath(link.path)}
                        className={`text-left text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 ${
                          resolvePage(link.path) === currentPage ||
                          (resolvePage(link.path) === "category" && currentPage === "categories")
                            ? "font-semibold text-indigo-600 dark:text-indigo-400"
                            : ""
                        }`}
                        onClick={(event) => handleNavigate(event, link.path, onNavigate)}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 dark:border-slate-700 mt-12 pt-8 text-center text-gray-500 dark:text-gray-400">
          <p>&copy; 2023 Thoughts & Notes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function handleNavigate(event, path, onNavigate) {
  event.preventDefault();
  onNavigate(path);
}
