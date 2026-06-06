import { aboutReasons, aboutTopics } from "../data/siteData.js";
import { toPublicPath } from "../routes.js";

export function AboutPage() {
  return (
    <>
      <header className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="gradient-text">Me</span>
          </h1>
          <p className="text-xl opacity-90">
            Welcome to my personal corner of the internet where I share my thoughts and explorations.
          </p>
        </div>
      </header>

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <section className="mb-16">
            <div className="grid grid-cols-1 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  My <span className="gradient-text">Journey</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  I started this blog as a way to document my learning and share my passion for [your topics].
                  What began as a personal notebook has grown into a space where I explore ideas that fascinate me.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Through writing, I&apos;ve discovered that the best way to understand something is to explain it
                  to others. This blog represents my ongoing journey of discovery.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  When I&apos;m not writing, you can find me [your hobbies/interests]. I believe that [your
                  personal philosophy or approach to your topics].
                </p>
              </div>
              <div className="flex justify-center">
                <img
                  src={toPublicPath("/assets/my photo.png")}
                  alt="My photo"
                  className="w-64 h-64 rounded-full object-cover shadow-xl floating border-4 border-white dark:border-slate-800"
                />
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">
              Why I <span className="gradient-text">Write</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {aboutReasons.map((reason) => (
                <div className="card p-6 rounded-xl" key={reason.title}>
                  <div className={`w-12 h-12 ${reason.bgClass} rounded-lg flex items-center justify-center mb-4`}>
                    <i className={`fas ${reason.icon} ${reason.iconClass}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{reason.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{reason.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">
              What I <span className="gradient-text">Write About</span>
            </h2>
            <div className="space-y-4">
              {aboutTopics.map((topic) => (
                <div className="card p-6 rounded-xl" key={topic.title}>
                  <h3 className="text-xl font-bold mb-2 flex items-center">
                    <span className={`w-4 h-4 ${topic.colorClass} rounded-full mr-3`} />
                    {topic.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{topic.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold mb-6">
              Let&apos;s <span className="gradient-text">Connect</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              I&apos;d love to hear your thoughts, questions, or just say hello!
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <i className="fab fa-twitter mr-2" />
                Twitter
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <i className="fab fa-github mr-2" />
                GitHub
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <i className="fas fa-envelope mr-2" />
                Email
              </button>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              I try to respond to all messages, but please be patient as this is a solo project.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
