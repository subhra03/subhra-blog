import { useState } from "react";

export function NewsletterForm({ compact = false }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage(email.trim() ? "Thanks for subscribing." : "Enter an email address to subscribe.");
  };

  return (
    <form
      className={`flex flex-col sm:flex-row gap-4 ${compact ? "max-w-md mx-auto" : ""}`}
      onSubmit={handleSubmit}
    >
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Your email address"
        className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 bg-white/10 backdrop-blur-sm placeholder-white/70"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
      >
        Subscribe
      </button>
      {message && <span className="sr-only" aria-live="polite">{message}</span>}
    </form>
  );
}
