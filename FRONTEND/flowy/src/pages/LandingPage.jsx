import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TopNavbar from "../components/common/home/TopNavbar.jsx";
import SideNavbar from "../components/common/home/SideNavbar.jsx";
import PolkaField from "../components/common/home/PolkaField.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import libraryShot from "../assets/library_image.png";
import collaboratorShot from "../assets/collaborator_image.png";
import inventoryShot from "../assets/inventory_image.png";
import "./landingPage.css";

const landingLinks = [
  { label: "Overview", target: "landing-overview" },
  { label: "Inventory", target: "landing-inventory" },
  { label: "Library", target: "landing-library" },
  { label: "Collaborators", target: "landing-collaborators" },
  { label: "Pricing", target: "landing-pricing" },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$0",
    subtitle: "For testing the workflow and exploring the product.",
    features: [
      "Single workspace",
      "Basic prompt history",
      "Limited inventory rows",
      "Standard collaboration access",
    ],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$19",
    subtitle: "For active builders who need better control and speed.",
    features: [
      "Expanded inventory management",
      "Reusable prompt library",
      "Collaborator invites",
      "Advanced workflow organization",
    ],
    cta: "Choose Pro",
    featured: false,
  },
  {
    name: "Scale",
    price: "$49",
    subtitle:
      "For teams running inventory, prompts, and collaboration together.",
    features: [
      "Priority team collaboration",
      "High-volume inventory operations",
      "Shared library visibility",
      "Best overall value for growing teams",
    ],
    cta: "Get started",
    featured: true,
  },
];

function scrollToSection(id) {
  const element = document.getElementById(id);
  if (!element) return;
  element.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const themeLabel = useMemo(
    () => (theme === "dark" ? "Light" : "Dark"),
    [theme],
  );

  return (
    <div className="home-main landing-main">
      <TopNavbar />

      <div className="home-shell">
        <SideNavbar />

        <main className="home-workspace landing-workspace">
          <PolkaField />

          <section className="landing-board">
            <header className="landing-topbar">
              <div className="landing-brand">
                <p className="landing-brand__eyebrow">Flowy Pro</p>
                <h1 className="landing-brand__title">
                  One automation workspace for inventory, prompts, and team
                  flow.
                </h1>
              </div>

              <div className="landing-actions">
                <button
                  type="button"
                  className="landing-theme-toggle"
                  onClick={toggleTheme}
                  aria-label={`Switch to ${themeLabel.toLowerCase()} mode`}
                >
                  {themeLabel}
                </button>

                <button
                  type="button"
                  className="landing-get-started"
                  onClick={() => navigate("/signup")}
                >
                  Get Started
                </button>
              </div>
            </header>

            <nav
              className="landing-anchor-nav"
              aria-label="Landing page sections"
            >
              {landingLinks.map((item) => (
                <button
                  key={item.target}
                  type="button"
                  className="landing-anchor-nav__link"
                  onClick={() => scrollToSection(item.target)}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="landing-content">
              <section
                id="landing-overview"
                className="landing-section landing-hero"
              >
                <div className="landing-hero__copy">
                  <p className="landing-kicker">
                    Built to match your workspace
                  </p>
                  <h2 className="landing-hero__title">
                    Run inventory, prompt history, and collaboration from one
                    clear dashboard.
                  </h2>
                  <p className="landing-hero__text">
                    Keep your product records structured, review saved prompt
                    history in one place, and add collaborators without leaving
                    the same interface. The whole page follows your existing
                    layout language so users feel like they are already inside
                    the app.
                  </p>

                  <div className="landing-hero__buttons">
                    <button
                      type="button"
                      className="landing-primary-btn"
                      onClick={() => navigate("/signup")}
                    >
                      Get Started
                    </button>

                    <button
                      type="button"
                      className="landing-secondary-btn"
                      onClick={() => scrollToSection("landing-pricing")}
                    >
                      View Pricing
                    </button>
                  </div>
                </div>

                <aside className="landing-hero__panel">
                  <div className="landing-hero__stat">
                    <span className="landing-hero__stat-label">
                      Focused workspace
                    </span>
                    <strong>Single-page flow</strong>
                  </div>
                  <div className="landing-hero__stat">
                    <span className="landing-hero__stat-label">
                      Consistent shell
                    </span>
                    <strong>Sidebar + nav + polka background</strong>
                  </div>
                  <div className="landing-hero__stat">
                    <span className="landing-hero__stat-label">Team-ready</span>
                    <strong>Inventory, library, collaborators</strong>
                  </div>
                </aside>
              </section>

              <section
                id="landing-inventory"
                className="landing-section landing-feature"
              >
                <div className="landing-feature__intro">
                  <p className="landing-kicker">Highlighted workspace</p>
                  <h2 className="landing-section__title">Inventory</h2>
                  <p className="landing-section__text">
                    Inventory stays front and center with the same highlighted
                    state your users see in the actual app. This section
                    communicates row and column control, editable product
                    entries, and a clean operational view for live
                    backend-driven stock data.
                  </p>

                  <ul className="landing-bullets">
                    <li>Add and remove rows fast.</li>
                    <li>Manage columns for flexible inventory structure.</li>
                    <li>
                      Keep product ID, product name, and quantity readable at a
                      glance.
                    </li>
                  </ul>
                </div>

                <div className="landing-feature__visual">
                  <img
                    src={inventoryShot}
                    alt="Inventory page interface with active sidebar highlight and inventory table"
                    loading="lazy"
                  />
                </div>
              </section>

              <section
                id="landing-library"
                className="landing-section landing-feature landing-feature--reverse"
              >
                <div className="landing-feature__visual">
                  <img
                    src={libraryShot}
                    alt="Library page showing prompt history and empty state panel"
                    loading="lazy"
                  />
                </div>

                <div className="landing-feature__intro">
                  <p className="landing-kicker">Prompt history</p>
                  <h2 className="landing-section__title">Library</h2>
                  <p className="landing-section__text">
                    The library gives users a dedicated place to review saved
                    prompts and inspect previous engine output whenever it is
                    available. It keeps history organized and makes prompt
                    recall feel like part of the main workflow instead of a
                    separate tool.
                  </p>

                  <ul className="landing-bullets">
                    <li>Review saved dashboard prompts in one location.</li>
                    <li>Expand items when engine responses are available.</li>
                    <li>
                      Preserve continuity for repeat tasks and experiments.
                    </li>
                  </ul>
                </div>
              </section>

              <section
                id="landing-collaborators"
                className="landing-section landing-feature"
              >
                <div className="landing-feature__intro">
                  <p className="landing-kicker">Shared work</p>
                  <h2 className="landing-section__title">Collaborators</h2>
                  <p className="landing-section__text">
                    Invite teammates with a simple email-based flow and keep
                    collaboration native to the workspace. The section mirrors
                    your current collaborator screen so the landing page sets
                    accurate expectations before sign in.
                  </p>

                  <ul className="landing-bullets">
                    <li>Invite with business or personal email.</li>
                    <li>Keep ownership and access setup simple.</li>
                    <li>Make teamwork feel built-in, not bolted on.</li>
                  </ul>
                </div>

                <div className="landing-feature__visual">
                  <img
                    src={collaboratorShot}
                    alt="Collaborators page with add collaborator email form"
                    loading="lazy"
                  />
                </div>
              </section>

              <section className="landing-section landing-stack">
                <div className="landing-stack__header">
                  <p className="landing-kicker">Why this flow works</p>
                  <h2 className="landing-section__title">
                    One continuous page
                  </h2>
                  <p className="landing-section__text">
                    Just like a product-first marketing page, every section sits
                    in one vertical flow. The top navigation scrolls users
                    directly to each section so they never leave the page while
                    learning what the platform does.
                  </p>
                </div>

                <div className="landing-stack__grid">
                  <article className="landing-mini-card">
                    <h3>Consistent look</h3>
                    <p>
                      The same shell, spacing, and surface treatment as the main
                      product keep the experience familiar in both light and
                      dark mode.
                    </p>
                  </article>

                  <article className="landing-mini-card">
                    <h3>Fast orientation</h3>
                    <p>
                      Visitors immediately see inventory, library, and
                      collaborators as the core pillars without clicking through
                      multiple pages.
                    </p>
                  </article>

                  <article className="landing-mini-card">
                    <h3>Direct conversion</h3>
                    <p>
                      The Get Started button can send users straight to your
                      existing sign in or sign up route and then into the main
                      product.
                    </p>
                  </article>
                </div>
              </section>

              <section
                id="landing-pricing"
                className="landing-section landing-pricing"
              >
                <div className="landing-pricing__header">
                  <p className="landing-kicker">Plans</p>
                  <h2 className="landing-section__title">Pricing</h2>
                  <p className="landing-section__text">
                    Structured for individual use first, then for growing teams,
                    with the final tier clearly emphasized as the best option.
                  </p>
                </div>

                <div className="landing-pricing__grid">
                  {pricingPlans.map((plan) => (
                    <article
                      key={plan.name}
                      className={`landing-price-card ${
                        plan.featured ? "landing-price-card--featured" : ""
                      }`}
                    >
                      {plan.featured && (
                        <span className="landing-price-card__badge">
                          Most sought after
                        </span>
                      )}

                      <div className="landing-price-card__top">
                        <h3>{plan.name}</h3>
                        <div className="landing-price-card__price">
                          <span>{plan.price}</span>
                          <small>/ month</small>
                        </div>
                        <p>{plan.subtitle}</p>
                      </div>

                      <ul className="landing-price-card__list">
                        {plan.features.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        className={`landing-price-card__cta ${
                          plan.featured
                            ? "landing-price-card__cta--featured"
                            : ""
                        }`}
                        onClick={() => navigate("/signup")}
                      >
                        {plan.cta}
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
