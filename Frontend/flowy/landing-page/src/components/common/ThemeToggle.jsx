import { useTheme } from "../../context/ThemeContext.jsx";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      type="button"
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {isDark ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2.2M12 19.3v2.2M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2.5 12h2.2M19.3 12h2.2M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M20.2 14.1A8.7 8.7 0 0 1 9.9 3.8a.55.55 0 0 0-.74-.66A10.2 10.2 0 1 0 20.86 14.84a.55.55 0 0 0-.66-.74Z" />
          </svg>
        )}
      </span>

      <span className="theme-toggle__label">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
