import { useState } from "react";
import ThemeToggle from "../components/common/ThemeToggle";
import "./logoutPage.css";

export default function LogoutPage() {
  const [loggedOut, setLoggedOut] = useState(false);

  const handleLogout = () => {
    setLoggedOut(true);
  };

  return (
    <main className="logout-page">
      <div className="logout-page__toggle">
        <ThemeToggle />
      </div>

      <section className="logout-panel" aria-live="polite">
        {!loggedOut ? (
          <>
            <p className="logout-panel__eyebrow">Authorization</p>
            <h1 className="logout-panel__title">Log out of your account</h1>
            <p className="logout-panel__text">
              You are about to end your current session. This action will log
              you out of the workflow engine securely.
            </p>

            <div className="logout-panel__actions">
              <button
                type="button"
                className="logout-panel__button logout-panel__button--danger"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          </>
        ) : (
          <div className="logout-success">
            <div className="logout-success__icon">✓</div>
            <p className="logout-panel__eyebrow">Authorization</p>
            <h1 className="logout-panel__title">Successfully logged out</h1>
            <p className="logout-panel__text">
              Your session has been closed safely. You can sign in again any
              time.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
