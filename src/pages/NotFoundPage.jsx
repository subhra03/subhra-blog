import { toPublicPath } from "../routes.js";

export function NotFoundPage({ onNavigate }) {
  return (
    <main className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-4">404</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Page <span className="gradient-text">Not Found</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          The page you are looking for does not exist or has moved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={toPublicPath("/")}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-medium hover:opacity-90 transition-opacity"
            onClick={(event) => {
              event.preventDefault();
              onNavigate("/");
            }}
          >
            Go Home
          </a>
          <a
            href={toPublicPath("/articles/")}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            onClick={(event) => {
              event.preventDefault();
              onNavigate("/articles/");
            }}
          >
            Browse Articles
          </a>
        </div>
      </div>
    </main>
  );
}
