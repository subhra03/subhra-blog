import { useState } from "react";

export function NewsletterForm({ compact = false }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("Saving your subscription...");

    window.setTimeout(() => {
      const storedEmails = JSON.parse(localStorage.getItem("newsletterSubscribers") ?? "[]");
      const nextEmails = Array.from(new Set([...storedEmails, normalizedEmail]));
      localStorage.setItem("newsletterSubscribers", JSON.stringify(nextEmails));
      setEmail("");
      setStatus("success");
      setMessage("Thanks for subscribing. Your email was saved locally for now.");
    }, 400);
  };

  return (
    <form className={compact ? "max-w-md mx-auto" : ""} onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== "loading") {
              setStatus("idle");
              setMessage("");
            }
          }}
          placeholder="Your email address"
          className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 bg-white/10 backdrop-blur-sm placeholder-white/70"
          aria-invalid={status === "error"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "Saving..." : "Subscribe"}
        </button>
      </div>
      {message && (
        <p
          className={`mt-3 text-sm ${
            status === "error" ? "text-red-100" : "text-white/80"
          }`}
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </form>
  );
}
