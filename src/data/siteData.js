export const navItems = [
  { label: "Home", path: "/" },
  { label: "Articles", path: "/articles/" },
  { label: "Categories", path: "/categories/" },
  { label: "About", path: "/about/" },
];

export const heroFeatures = [
  {
    icon: "fa-pen-nib",
    iconClass: "text-indigo-600 dark:text-indigo-400",
    iconBgClass: "bg-indigo-100 dark:bg-indigo-900",
    accentClass: "bg-indigo-100 dark:bg-indigo-900",
    title: "Thoughtful Articles",
    text: "Deep dives into topics that matter, written with care and insight.",
  },
  {
    icon: "fa-lightbulb",
    iconClass: "text-purple-600 dark:text-purple-400",
    iconBgClass: "bg-purple-100 dark:bg-purple-900",
    accentClass: "bg-purple-100 dark:bg-purple-900",
    title: "Fresh Perspectives",
    text: "Unique viewpoints that challenge conventional thinking.",
  },
  {
    icon: "fa-comments",
    iconClass: "text-pink-600 dark:text-pink-400",
    iconBgClass: "bg-pink-100 dark:bg-pink-900",
    accentClass: "bg-pink-100 dark:bg-pink-900",
    title: "Engaging Community",
    text: "Join thoughtful discussions with like-minded readers.",
  },
];

export const popularTags = [
  "technology",
  "environment",
  "science",
  "literature",
  "philosophy",
  "art",
  "culture",
  "history",
  "innovation",
  "sustainability",
  "psychology",
  "future",
  "creativity",
  "education",
  "health",
];

export const articleTags = [
  "quantumcomputing",
  "climatechange",
  "artificialintelligence",
  "spaceexploration",
  "literaryanalysis",
  "sustainability",
  "neuroscience",
  "webdevelopment",
  "biodiversity",
  "philosophy",
  "machinelearning",
  "renewableenergy",
  "creativewriting",
  "physics",
  "cybersecurity",
];

export const categoryTags = [
  { label: "artificial-intelligence", className: "hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-800 dark:hover:text-indigo-200" },
  { label: "sustainability", className: "hover:bg-green-100 dark:hover:bg-green-900 hover:text-green-800 dark:hover:text-green-200" },
  { label: "space", className: "hover:bg-yellow-100 dark:hover:bg-yellow-900 hover:text-yellow-800 dark:hover:text-yellow-200" },
  { label: "literary-analysis", className: "hover:bg-purple-100 dark:hover:bg-purple-900 hover:text-purple-800 dark:hover:text-purple-200" },
  { label: "physics", className: "hover:bg-pink-100 dark:hover:bg-pink-900 hover:text-pink-800 dark:hover:text-pink-200" },
  { label: "webassembly", className: "hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-800 dark:hover:text-blue-200" },
  { label: "creative-work", className: "hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-800 dark:hover:text-red-200" },
];

export const categories = [
  {
    id: "technology",
    title: "Technology",
    count: 42,
    icon: "fa-microchip",
    image: "https://source.unsplash.com/random/1200x800/?technology",
    featured: true,
  },
  {
    id: "science",
    title: "Science",
    count: 36,
    icon: "fa-atom",
    gradientClass: "category-science",
  },
  {
    id: "environment",
    title: "Environment",
    count: 28,
    icon: "fa-leaf",
    gradientClass: "category-environment",
  },
  {
    id: "literature",
    title: "Literature",
    count: 24,
    icon: "fa-book-open",
    gradientClass: "category-literature",
  },
  {
    id: "philosophy",
    title: "Philosophy",
    count: 18,
    icon: "fa-brain",
    gradientClass: "category-philosophy",
  },
  {
    id: "art",
    title: "Art & Culture",
    count: 15,
    icon: "fa-palette",
    gradientClass: "category-art",
  },
];

export function findCategoryById(categoryId) {
  return categories.find((category) => category.id === categoryId);
}

export const aboutReasons = [
  {
    icon: "fa-lightbulb",
    title: "Clarify My Thoughts",
    text: "Writing helps me organize and deepen my understanding of complex topics.",
    bgClass: "bg-indigo-100 dark:bg-indigo-900",
    iconClass: "text-indigo-600 dark:text-indigo-400",
  },
  {
    icon: "fa-users",
    title: "Connect With Others",
    text: "I hope my writing sparks conversations with like-minded curious people.",
    bgClass: "bg-purple-100 dark:bg-purple-900",
    iconClass: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: "fa-seedling",
    title: "Document Growth",
    text: "This blog serves as a record of my evolving perspectives over time.",
    bgClass: "bg-pink-100 dark:bg-pink-900",
    iconClass: "text-pink-600 dark:text-pink-400",
  },
  {
    icon: "fa-heart",
    title: "Share Passion",
    text: "I write about what excites me in hopes of inspiring others.",
    bgClass: "bg-yellow-100 dark:bg-yellow-900",
    iconClass: "text-yellow-600 dark:text-yellow-400",
  },
];

export const aboutTopics = [
  {
    colorClass: "bg-indigo-500",
    title: "Technology & Innovation",
    text: "Exploring how emerging technologies shape our world and daily lives.",
  },
  {
    colorClass: "bg-green-500",
    title: "Personal Growth",
    text: "Lessons learned from my journey of continuous learning and self-improvement.",
  },
  {
    colorClass: "bg-purple-500",
    title: "Creative Pursuits",
    text: "Sharing my experiments and projects in [your creative fields].",
  },
];
