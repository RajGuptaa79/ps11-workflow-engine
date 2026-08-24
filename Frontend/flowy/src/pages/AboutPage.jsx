import TopNavbar from "../components/common/home/TopNavbar.jsx";
import SideNavbar from "../components/common/home/SideNavbar.jsx";
import PolkaField from "../components/common/home/PolkaField.jsx";
import "./aboutPage.css";

export default function AboutPage() {
  return (
    <div className="about-page-main">
      <TopNavbar />

      <div className="about-page-shell">
        <SideNavbar />

        <main className="about-page-workspace">
          <PolkaField />

          <section className="about-page-stage">
            <div className="about-page-panel">
              <div className="about-page-eyebrow">About Flowy Pro</div>

              <div className="about-page-hero">
                <h1>
                  We built Flowy Pro to make business workflows easier to
                  understand, easier to run, and easier to improve.
                </h1>

                <p className="about-page-lead">
                  In a lot of teams, the real process lives in scattered notes,
                  chats, spreadsheets, and in the heads of the people doing the
                  work. That usually means confusion, repeated follow-ups, and a
                  lot of manual effort just to keep things moving.
                </p>
              </div>

              <div className="about-page-grid">
                <article className="about-card about-card--wide">
                  <h2>What Flowy Pro actually does</h2>
                  <p>
                    Flowy Pro takes business logic written in natural language
                    and turns it into a structured workflow that people can read
                    clearly and follow with confidence. It can show that logic
                    in diagram form, but the goal is bigger than just drawing a
                    process.
                  </p>
                  <p>
                    We want the platform to help teams move from “this is how we
                    think work happens” to “this is the exact flow, this is what
                    happens next, and this is what the system can already
                    handle.”
                  </p>
                </article>

                <article className="about-card">
                  <h2>Execution, not just visuals</h2>
                  <p>
                    Our project does not stop at showing a workflow. If a step
                    can be carried out by the system, Flowy Pro is designed to
                    execute that step as part of the process instead of leaving
                    the diagram as a static reference.
                  </p>
                </article>

                <article className="about-card">
                  <h2>Team coordination</h2>
                  <p>
                    Through the collaborators side of the platform, the system
                    can notify vendors and employers whenever a workflow needs
                    people outside the immediate user session to take action or
                    stay informed.
                  </p>
                </article>

                <article className="about-card">
                  <h2>Inventory updates</h2>
                  <p>
                    When users add inventory data into the database, Flowy Pro
                    can use that information to keep inventory aligned with the
                    workflow and update records based on the actions happening
                    in the process.
                  </p>
                </article>

                <article className="about-card">
                  <h2>Upgraded plan features</h2>
                  <p>
                    We have also included invoice generation as part of the
                    upgraded plan, so businesses that need a more complete
                    operational layer can go beyond workflow handling and use
                    the platform for higher-value process support.
                  </p>
                </article>

                <article className="about-card about-card--wide">
                  <h2>Why we made it</h2>
                  <p>
                    We built this project with the belief that automation should
                    begin with understanding. Before a business can automate a
                    system properly, it has to see the process clearly, identify
                    where decisions happen, understand who needs to be involved,
                    and know which parts can be handled automatically.
                  </p>
                  <p>
                    That is what Flowy Pro is meant to do. It helps teams
                    convert unclear working methods into visible workflows,
                    actionable steps, and a system that supports both
                    collaboration and execution.
                  </p>
                </article>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
