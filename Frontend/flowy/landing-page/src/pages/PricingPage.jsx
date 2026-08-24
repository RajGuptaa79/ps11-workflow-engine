import TopNavbar from "../components/common/home/TopNavbar.jsx";
import SideNavbar from "../components/common/home/SideNavbar.jsx";
import PolkaField from "../components/common/home/PolkaField.jsx";
import "./pricingPage.css";

export default function PricingPage() {
  return (
    <div className="pricing-page-main">
      <TopNavbar />

      <div className="pricing-page-shell">
        <SideNavbar />

        <main className="pricing-page-workspace">
          <PolkaField />

          <section className="pricing-page-stage">
            <div className="pricing-page-panel">
              <div className="pricing-page-eyebrow">Pricing</div>

              <div className="pricing-page-hero">
                <h1>Plans that grow with the way a business operates.</h1>
                <p className="pricing-page-lead">
                  Every plan is billed monthly and built around the same core
                  idea: help teams understand their workflows, act on them, and
                  scale the parts of the process that should not stay manual for
                  long.
                </p>
              </div>

              <div className="pricing-cards">
                <article className="pricing-card pricing-card--basic">
                  <div className="pricing-card__top">
                    <div>
                      <div className="pricing-card__label">Basic / Free</div>
                      <h2>Start with workflow clarity</h2>
                    </div>

                    <div className="pricing-price-block">
                      <div className="pricing-price">₹0</div>
                      <div className="pricing-price-caption">per month</div>
                    </div>
                  </div>

                  <p className="pricing-card__summary">
                    Best for trying the platform and understanding how your
                    business process looks in a structured workflow format.
                  </p>

                  <ul className="pricing-feature-list">
                    <li>
                      Enter business details and generate workflow diagrams.
                    </li>
                    <li>Get the steps of the workflow in a structured form.</li>
                    <li>Use inventory management features.</li>
                    <li>Add collaborators who can be notified when needed.</li>
                    <li>1 account per user ID.</li>
                    <li>Up to 5 diagram flowcharts.</li>
                  </ul>
                </article>

                <article className="pricing-card pricing-card--mid">
                  <div className="pricing-card__top">
                    <div>
                      <div className="pricing-card__label">Mid-Cap Plan</div>
                      <h2>More control for growing operations</h2>
                    </div>

                    <div className="pricing-price-block">
                      <div className="pricing-price">₹499</div>
                      <div className="pricing-price-caption">per month</div>
                    </div>
                  </div>

                  <p className="pricing-card__summary">
                    Built for teams that need more than workflow generation and
                    want better operational support day to day.
                  </p>

                  <ul className="pricing-feature-list">
                    <li>Includes everything in the Basic / Free plan.</li>
                    <li>Invoice management.</li>
                    <li>Workflow history.</li>
                    <li>Up to 20 diagram flowcharts.</li>
                    <li>2 accounts per ID.</li>
                  </ul>
                </article>

                <article className="pricing-card pricing-card--premium">
                  <div className="pricing-card__accent" aria-hidden="true" />
                  <div className="pricing-card__top">
                    <div>
                      <div className="pricing-card__label">Large-Cap Plan</div>
                      <h2>For teams handling larger workflow volume</h2>
                    </div>

                    <div className="pricing-price-block">
                      <div className="pricing-price">₹1099</div>
                      <div className="pricing-price-caption">per month</div>
                    </div>
                  </div>

                  <p className="pricing-card__summary">
                    Designed for businesses that want broader access, more team
                    usage, and enough capacity for heavier workflow activity.
                  </p>

                  <ul className="pricing-feature-list">
                    <li>
                      Includes everything in the Basic / Free and Mid-Cap plans.
                    </li>
                    <li>Up to 50 diagram flowcharts.</li>
                    <li>4 accounts per ID.</li>
                    <li>Supports multi-person use under the same ID.</li>
                  </ul>
                </article>
              </div>

              <div className="pricing-footnote">
                <p>
                  All subscriptions are monthly. As usage grows, each plan adds
                  more working capacity and operational support without changing
                  the core experience of the platform.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
