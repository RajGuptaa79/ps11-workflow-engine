import { useState } from "react";
import TopNavbar from "../components/common/home/TopNavbar.jsx";
import SideNavbar from "../components/common/home/SideNavbar.jsx";
import PolkaField from "../components/common/home/PolkaField.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import "./settingsPage.css";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  const [settings, setSettings] = useState({
    compactMode: false,
    reducedMotion: false,
    showPolka: true,
    roundedCards: true,
    emailUpdates: true,
    productTips: false,
    publicProfile: false,
    analyticsSharing: true,
    displayName: "Mayank Saini",
    email: "mayank@example.com",
  });

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const shellClasses = [
    "settings-preview-shell",
    settings.compactMode ? "settings-preview-shell--compact" : "",
    settings.reducedMotion ? "settings-preview-shell--reduced-motion" : "",
    !settings.roundedCards ? "settings-preview-shell--sharp" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="home-main settings-main">
      <TopNavbar />

      <div className="home-shell">
        <SideNavbar />

        <main className="home-workspace settings-workspace">
          {settings.showPolka && <PolkaField />}

          <section className="settings-board">
            <div className="settings-board__surface">
              <div className="settings-board__header">
                <div>
                  <p className="settings-board__eyebrow">
                    Workspace preferences
                  </p>
                  <h1 className="settings-board__title">Settings</h1>
                  <p className="settings-board__subtitle">
                    Manage appearance, workspace behavior, notifications, and
                    privacy in one place.
                  </p>
                </div>

                <button
                  type="button"
                  className="settings-theme-button"
                  onClick={toggleTheme}
                >
                  Switch to {theme === "dark" ? "light" : "dark"} mode
                </button>
              </div>

              <div className="settings-layout">
                <div className="settings-layout__scroll">
                  <div className="settings-layout__grid">
                    <div className="settings-grid">
                      <section className="settings-card">
                        <h2 className="settings-card__title">Appearance</h2>

                        <label className="settings-row">
                          <div>
                            <span className="settings-row__label">
                              Compact mode
                            </span>
                            <span className="settings-row__hint">
                              Reduce spacing across cards and controls.
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.compactMode}
                            onChange={(e) =>
                              updateSetting("compactMode", e.target.checked)
                            }
                          />
                        </label>

                        <label className="settings-row">
                          <div>
                            <span className="settings-row__label">
                              Reduced motion
                            </span>
                            <span className="settings-row__hint">
                              Minimize transitions and animated movement.
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.reducedMotion}
                            onChange={(e) =>
                              updateSetting("reducedMotion", e.target.checked)
                            }
                          />
                        </label>

                        <label className="settings-row">
                          <div>
                            <span className="settings-row__label">
                              Rounded cards
                            </span>
                            <span className="settings-row__hint">
                              Use softer corners throughout the interface.
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.roundedCards}
                            onChange={(e) =>
                              updateSetting("roundedCards", e.target.checked)
                            }
                          />
                        </label>
                      </section>

                      <section className="settings-card">
                        <h2 className="settings-card__title">Workspace</h2>

                        <label className="settings-row">
                          <div>
                            <span className="settings-row__label">
                              Show polka background
                            </span>
                            <span className="settings-row__hint">
                              Toggle the animated workspace backdrop.
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.showPolka}
                            onChange={(e) =>
                              updateSetting("showPolka", e.target.checked)
                            }
                          />
                        </label>

                        <div className="settings-field">
                          <label
                            className="settings-field__label"
                            htmlFor="displayName"
                          >
                            Display name
                          </label>
                          <input
                            id="displayName"
                            className="settings-input"
                            type="text"
                            value={settings.displayName}
                            onChange={(e) =>
                              updateSetting("displayName", e.target.value)
                            }
                          />
                        </div>

                        <div className="settings-field">
                          <label
                            className="settings-field__label"
                            htmlFor="email"
                          >
                            Email
                          </label>
                          <input
                            id="email"
                            className="settings-input"
                            type="email"
                            value={settings.email}
                            onChange={(e) =>
                              updateSetting("email", e.target.value)
                            }
                          />
                        </div>
                      </section>

                      <section className="settings-card">
                        <h2 className="settings-card__title">Notifications</h2>

                        <label className="settings-row">
                          <div>
                            <span className="settings-row__label">
                              Email updates
                            </span>
                            <span className="settings-row__hint">
                              Receive account and workflow updates.
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.emailUpdates}
                            onChange={(e) =>
                              updateSetting("emailUpdates", e.target.checked)
                            }
                          />
                        </label>

                        <label className="settings-row">
                          <div>
                            <span className="settings-row__label">
                              Product tips
                            </span>
                            <span className="settings-row__hint">
                              Get suggestions about new features.
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.productTips}
                            onChange={(e) =>
                              updateSetting("productTips", e.target.checked)
                            }
                          />
                        </label>
                      </section>

                      <section className="settings-card">
                        <h2 className="settings-card__title">Privacy</h2>

                        <label className="settings-row">
                          <div>
                            <span className="settings-row__label">
                              Public profile
                            </span>
                            <span className="settings-row__hint">
                              Let collaborators view your profile details.
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.publicProfile}
                            onChange={(e) =>
                              updateSetting("publicProfile", e.target.checked)
                            }
                          />
                        </label>

                        <label className="settings-row">
                          <div>
                            <span className="settings-row__label">
                              Analytics sharing
                            </span>
                            <span className="settings-row__hint">
                              Help improve the product with usage insights.
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.analyticsSharing}
                            onChange={(e) =>
                              updateSetting(
                                "analyticsSharing",
                                e.target.checked,
                              )
                            }
                          />
                        </label>
                      </section>
                    </div>

                    <aside className="settings-preview">
                      <h2 className="settings-card__title">Live preview</h2>
                      <div className={shellClasses}>
                        <div className="settings-preview-shell__topbar" />
                        <div className="settings-preview-shell__body">
                          <div className="settings-preview-shell__sidebar" />
                          <div className="settings-preview-shell__content">
                            <div className="settings-preview-shell__panel settings-preview-shell__panel--hero">
                              <span>
                                {theme === "dark" ? "Dark" : "Light"} theme
                              </span>
                            </div>
                            <div className="settings-preview-shell__panel" />
                            <div className="settings-preview-shell__panel" />
                          </div>
                        </div>
                      </div>

                      <div className="settings-summary">
                        <p>
                          <strong>Name:</strong>{" "}
                          {settings.displayName || "Not set"}
                        </p>
                        <p>
                          <strong>Email:</strong> {settings.email || "Not set"}
                        </p>
                        <p>
                          <strong>Background:</strong>{" "}
                          {settings.showPolka
                            ? "Polka visible"
                            : "Polka hidden"}
                        </p>
                      </div>
                    </aside>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
