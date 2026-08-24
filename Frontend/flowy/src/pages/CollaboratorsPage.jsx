import { useState } from "react";
import TopNavbar from "../components/common/home/TopNavbar.jsx";
import SideNavbar from "../components/common/home/SideNavbar.jsx";
import PolkaField from "../components/common/home/PolkaField.jsx";
import "./diagramPage.css";
import "./collaboratorsPage.css";

export default function CollaboratorsPage() {
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleAddClick = () => {
    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) {
      setEmailError("Please enter an email address.");
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError("");
    setIsSuccessOpen(true);
  };

  return (
    <div className="diagram-blank-main collaborators-page">
      <TopNavbar />

      <div className="diagram-blank-shell">
        <SideNavbar />

        <main className="diagram-blank-workspace">
          <PolkaField />

          <div
            className={`diagram-blank-stage collaborators-stage${
              isSuccessOpen ? " collaborators-stage--modal-open" : ""
            }`}
          >
            <section className="collaborator-card">
              <h1 className="collaborator-card__title">Add a Collaborator</h1>

              <p className="collaborator-card__subtitle">
                Provide the Email of the Collaborator.
              </p>

              <div className="collaborator-card__field">
                <label
                  className="collaborator-card__label"
                  htmlFor="collaborator-email"
                >
                  Business Email / Personal Email
                </label>

                <input
                  id="collaborator-email"
                  className={`collaborator-card__input${
                    emailError ? " collaborator-card__input--error" : ""
                  }`}
                  type="email"
                  placeholder="Enter a valid Email Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) {
                      setEmailError("");
                    }
                  }}
                  aria-invalid={emailError ? "true" : "false"}
                  aria-describedby={
                    emailError ? "collaborator-email-error" : undefined
                  }
                />

                {emailError && (
                  <p
                    id="collaborator-email-error"
                    className="collaborator-card__error"
                  >
                    {emailError}
                  </p>
                )}
              </div>

              <button
                type="button"
                className="collaborator-card__button"
                onClick={handleAddClick}
              >
                Add
              </button>
            </section>

            {isSuccessOpen && (
              <div
                className="collaborator-success-overlay"
                role="dialog"
                aria-modal="true"
                aria-labelledby="collaborator-success-title"
              >
                <div className="collaborator-success-modal">
                  <div
                    className="collaborator-success-modal__icon"
                    aria-hidden="true"
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="m8.7 12 2.2 2.2 4.6-5" />
                    </svg>
                  </div>

                  <h2
                    id="collaborator-success-title"
                    className="collaborator-success-modal__title"
                  >
                    Collaborator Added
                  </h2>

                  <p className="collaborator-success-modal__text">
                    we&apos;ll notify the further updates
                  </p>

                  <button
                    type="button"
                    className="collaborator-success-modal__button"
                    onClick={() => setIsSuccessOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
