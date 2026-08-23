import { useEffect, useState } from "react";
import "./authPage.css";

const SunIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.5v2.4M12 19.1v2.4M21.5 12h-2.4M4.9 12H2.5M18.72 5.28l-1.7 1.7M6.98 17.02l-1.7 1.7M18.72 18.72l-1.7-1.7M6.98 6.98l-1.7-1.7" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.2 14.2A8.7 8.7 0 1 1 9.8 3.8a7.3 7.3 0 0 0 10.4 10.4Z" />
  </svg>
);

export default function AuthPage() {
  const [mode, setMode] = useState("signin");
  const [theme, setTheme] = useState("light");

  const isSignIn = mode === "signin";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isSignIn) {
      // TODO: connect auth logic here
      // Future redirect target after successful sign in:
      // window.location.href = "http://localhost:5173/home";
    } else {
      // TODO: connect sign up logic here
      // Future redirect target after successful sign up:
      // window.location.href = "http://localhost:5173/home";
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__ambient auth-page__ambient--one" />
      <div className="auth-page__ambient auth-page__ambient--two" />

      <header className="auth-topbar">
        <div className="auth-brand-block">
          <div className="auth-brand">Flowy</div>
          <p className="auth-brand-copy">
            A calmer workflow layer for teams building operational clarity.
          </p>
        </div>

        <div className="auth-topbar__actions">
          <button
            type="button"
            className="auth-theme-toggle"
            onClick={handleThemeToggle}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            <span className="auth-theme-toggle__icon">
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
            </span>
            <span className="auth-theme-toggle__text">
              {theme === "light" ? "Dark mode" : "Light mode"}
            </span>
          </button>

          <a href="/" className="auth-back-link">
            Back to Platform
          </a>
        </div>
      </header>

      <main className="auth-main">
        <section className="auth-stage">
          <div className="auth-stage__intro">
            <h1>
              {isSignIn
                ? "Sign in to continue your workflow"
                : "Create an account for your workspace"}
            </h1>
            <p>
              {isSignIn
                ? "Use your credentials to open the workflow dashboard and continue from the query panel."
                : "Set up a simple account structure now. You can connect the actual authentication and redirect logic later."}
            </p>
          </div>

          <section className="auth-card">
            <div className="auth-switch">
              <button
                type="button"
                className={`auth-switch__tab ${isSignIn ? "is-active" : ""}`}
                onClick={() => setMode("signin")}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-switch__tab ${!isSignIn ? "is-active" : ""}`}
                onClick={() => setMode("signup")}
              >
                Create Account
              </button>
            </div>

            <div className="auth-card__body">
              <div className="auth-copy">
                <h2>{isSignIn ? "Welcome back" : "Create your workspace"}</h2>
                <p>
                  {isSignIn
                    ? "Enter your credentials to access your workflow workspace."
                    : "Set up your account and start turning business workflows into clear, usable systems."}
                </p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                {!isSignIn && (
                  <div className="auth-field-grid">
                    <label className="auth-field">
                      <span>Full Name</span>
                      <input type="text" placeholder="Your full name" />
                    </label>

                    <label className="auth-field">
                      <span>Company Name</span>
                      <input type="text" placeholder="Your company" />
                    </label>
                  </div>
                )}

                <label className="auth-field">
                  <span>Email Address</span>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">✉</span>
                    <input type="email" placeholder="name@company.com" />
                  </div>
                </label>

                {!isSignIn && (
                  <label className="auth-field">
                    <span>Business Type</span>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">▣</span>
                      <input
                        type="text"
                        placeholder="Retail, Manufacturing, Services..."
                      />
                    </div>
                  </label>
                )}

                <label className="auth-field">
                  <div className="auth-field__row">
                    <span>Password</span>
                    {isSignIn && (
                      <button type="button" className="auth-inline-link">
                        Forgot Password?
                      </button>
                    )}
                  </div>

                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">⌘</span>
                    <input type="password" placeholder="••••••••" />
                    <button
                      type="button"
                      className="auth-ghost-icon"
                      aria-label="Toggle password visibility"
                    >
                      ◉
                    </button>
                  </div>
                </label>

                {!isSignIn && (
                  <label className="auth-field">
                    <span>Confirm Password</span>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">⌘</span>
                      <input type="password" placeholder="••••••••" />
                    </div>
                  </label>
                )}

                <button type="submit" className="auth-submit">
                  {isSignIn ? "Sign In" : "Create Account"}
                  <span aria-hidden="true">→</span>
                </button>

                <div className="auth-divider">
                  <span>Or continue with</span>
                </div>

                <div className="auth-socials">
                  <button type="button" className="auth-social">
                    <span>G</span>
                    Google
                  </button>
                  <button type="button" className="auth-social">
                    <span>⌘</span>
                    GitHub
                  </button>
                </div>
              </form>
            </div>
          </section>
        </section>
      </main>

      <footer className="auth-footer">
        © 2026 Flowy Inc. Technical Excellence in Workflow Detection.
      </footer>
    </div>
  );
}
