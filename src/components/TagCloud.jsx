import { toPublicPath } from "../routes.js";

export function TagCloud({ tags, centered = false, onNavigate }) {
  return (
    <div className={`tag-cloud ${centered ? "justify-center" : ""}`}>
      {tags.map((tag) => (
        <a
          href={toPublicPath(`/tags/${encodeURIComponent(tag)}/`)}
          className="tag"
          key={tag}
          onClick={(event) => handleNavigate(event, `/tags/${encodeURIComponent(tag)}/`, onNavigate)}
        >
          #{tag}
        </a>
      ))}
    </div>
  );
}

export function ColorTagCloud({ tags, onNavigate }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {tags.map((tag) => (
        <a
          href={toPublicPath(`/tags/${encodeURIComponent(tag.label)}/`)}
          key={tag.label}
          className={`px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium transition-colors ${tag.className}`}
          onClick={(event) =>
            handleNavigate(event, `/tags/${encodeURIComponent(tag.label)}/`, onNavigate)
          }
        >
          #{tag.label}
        </a>
      ))}
    </div>
  );
}

function handleNavigate(event, path, onNavigate) {
  if (!onNavigate) return;
  event.preventDefault();
  onNavigate(path);
}
