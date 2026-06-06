import { CategoryCard } from "../components/CategoryCard.jsx";
import { ColorTagCloud } from "../components/TagCloud.jsx";
import { NewsletterForm } from "../components/NewsletterForm.jsx";
import { allTags, postCountByCategory } from "../data/posts.js";
import { categories, categoryTags } from "../data/siteData.js";

export function CategoriesPage({ onNavigate }) {
  return (
    <>
      <header className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore <span className="gradient-text">Categories</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Dive deep into topics that matter most to you. Browse focused collections of ideas and notes.
          </p>
        </div>
      </header>

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {categories.map((category) => (
              <CategoryCard
                category={category}
                count={postCountByCategory(category.id)}
                key={category.id}
                onNavigate={onNavigate}
              />
            ))}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm mb-12">
            <h3 className="text-xl font-bold mb-6">
              Browse by <span className="gradient-text">Tags</span>
            </h3>
            <ColorTagCloud
              tags={categoryTags.filter((tag) => allTags.includes(tag.label))}
              onNavigate={onNavigate}
            />
          </div>

          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 md:p-12 text-center text-white mb-12">
            <h3 className="text-2xl font-bold mb-4">Never Miss an Article</h3>
            <p className="max-w-2xl mx-auto mb-6 opacity-90">
              Subscribe to our newsletter and get the latest thoughts and notes delivered straight to your inbox.
            </p>
            <NewsletterForm compact />
          </div>
        </div>
      </main>
    </>
  );
}
