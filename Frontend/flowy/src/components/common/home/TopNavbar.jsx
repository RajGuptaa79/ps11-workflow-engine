import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle.jsx";
import { useUser } from "../../../context/UserContext.jsx";

export default function TopNavbar() {
  const navLinkClass = ({ isActive }) => (isActive ? "p-8 is-active" : "p-8");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { user, clearUser } = useUser();

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!profileRef.current?.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = () => {
    clearUser();
    setIsProfileOpen(false);
    navigate("/logout");
  };

  return (
    <header className="top-navbar">
      <NavLink to="/" className="p-8">
        <div className="top-navbar__brand">Flowy</div>
      </NavLink>

      <nav className="top-navbar__nav">
        <NavLink to="/about" className={navLinkClass}>
          About us
        </NavLink>
      </nav>

      <div className="top-navbar__actions">
        <NavLink to="/pricing" className={navLinkClass}>
          Pricing
        </NavLink>

        <NavLink to="/signin" className={navLinkClass}>
          Sign in
        </NavLink>

        <NavLink to="/signup" className={navLinkClass}>
          Sign up
        </NavLink>

        <ThemeToggle />

        <div className="profile-menu" ref={profileRef}>
          <button
            className={`icon-button profile-menu__trigger${
              isProfileOpen ? " profile-menu__trigger--open" : ""
            }`}
            aria-label="Profile options"
            aria-haspopup="menu"
            aria-expanded={isProfileOpen}
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {isProfileOpen && (
            <div className="profile-menu__dropdown" role="menu">
              <div className="profile-menu__panel">
                <div className="profile-menu__label">Signed in as</div>
                <div
                  className="profile-menu__user-id"
                  title={user?.id || "No user id available"}
                >
                  {user?.id || "No user id available"}
                </div>

                <button
                  type="button"
                  className="profile-menu__logout"
                  onClick={handleLogout}
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
