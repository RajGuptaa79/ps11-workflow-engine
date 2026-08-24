import { useState } from "react";
import TopNavbar from "../components/common/home/TopNavbar.jsx";
import SideNavbar from "../components/common/home/SideNavbar.jsx";
import PolkaField from "../components/common/home/PolkaField.jsx";
import "./helpPage.css";

const faqItems = [
  {
    question: "What does this workflow engine do?",
    answer:
      "It helps teams describe workflow logic in natural language and organize it into structured automation flows, diagrams, and system-ready process steps.",
  },
  {
    question: "How do I start using the dashboard?",
    answer:
      "Go to the Dashboard, type your workflow prompt, and generate the structure. Your prompt history is then available in the Library page for later review.",
  },
  {
    question: "What is the Library page for?",
    answer:
      "The Library keeps track of prompt history from the dashboard. You can expand each item to review the saved prompt and later the linked engine response.",
  },
  {
    question: "Can I use light mode and dark mode safely?",
    answer:
      "Yes. The interface is designed to work in both themes using the shared site color system, with readable text, borders, cards, and controls in each mode.",
  },
  {
    question: "How do collaborators fit into this app?",
    answer:
      "The collaborators flow is meant to help invite and manage teammates who contribute across design, workflow planning, automation logic, and platform operations.",
  },
  {
    question: "Why is my output placeholder still empty?",
    answer:
      "The interface can already store prompts and prepare result sections, but the final engine response needs to be linked into the page flow to display the generated output.",
  },
];

const contacts = [
  {
    name: "Raj Gupta",
    role: "Team lead",
    email: "raj.gupta@bitsnbytes.team",
  },
  {
    name: "Janjhri Soni",
    role: "UI/UX",
    email: "janjhri.soni@bitsnbytes.team",
  },
  {
    name: "Viddhi Mehra",
    role: "Database",
    email: "viddhi.mehra@bitsnbytes.team",
  },
  {
    name: "Meghan Khatu",
    role: "Backend",
    email: "meghan.khatu@bitsnbytes.team",
  },
  {
    name: "Satyam Nishad",
    role: "AI/Automation",
    email: "satyam.nishad@bitsnbytes.team",
  },
  {
    name: "Mayank Saini",
    role: "Frontend",
    email: "mayank.saini.tech@gmail.com",
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <div className="home-main help-main">
      <TopNavbar />

      <div className="home-shell">
        <SideNavbar />

        <main className="home-workspace help-workspace">
          <PolkaField />

          <section className="help-board">
            <div className="help-board__surface">
              <div className="help-board__header">
                <div>
                  <p className="help-board__eyebrow">Support and guidance</p>
                  <h1 className="help-board__title">Help</h1>
                  <p className="help-board__subtitle">
                    Find answers to common workflow-engine questions and contact
                    the Bits N Bytes team for support.
                  </p>
                </div>
              </div>

              <div className="help-layout">
                <div className="help-layout__scroll">
                  <div className="help-layout__grid">
                    <section className="help-card">
                      <h2 className="help-card__title">
                        Frequently asked questions
                      </h2>

                      <div className="help-faq">
                        {faqItems.map((item, index) => {
                          const isOpen = openIndex === index;

                          return (
                            <article
                              key={item.question}
                              className={`help-faq__item ${
                                isOpen ? "help-faq__item--open" : ""
                              }`}
                            >
                              <button
                                type="button"
                                className="help-faq__button"
                                onClick={() => toggleFaq(index)}
                                aria-expanded={isOpen}
                              >
                                <span className="help-faq__question">
                                  {item.question}
                                </span>
                                <span className="help-faq__icon">
                                  {isOpen ? "−" : "+"}
                                </span>
                              </button>

                              {isOpen && (
                                <div className="help-faq__answer">
                                  <p>{item.answer}</p>
                                </div>
                              )}
                            </article>
                          );
                        })}
                      </div>
                    </section>

                    <aside className="help-sidebar">
                      <section className="help-card">
                        <h2 className="help-card__title">Contact team</h2>
                        <p className="help-card__text">
                          Reach out to <strong>Bits N Bytes</strong> for
                          product, design, technical, or implementation support.
                        </p>

                        <div className="help-contact-list">
                          {contacts.map((member) => (
                            <div className="help-contact" key={member.email}>
                              <div>
                                <h3 className="help-contact__name">
                                  {member.name}
                                </h3>
                                <p className="help-contact__role">
                                  {member.role}
                                </p>
                              </div>

                              <a
                                className="help-contact__email"
                                href={`mailto:${member.email}`}
                              >
                                {member.email}
                              </a>
                            </div>
                          ))}
                        </div>
                      </section>

                      <section className="help-card">
                        <h2 className="help-card__title">Support scope</h2>
                        <ul className="help-points">
                          <li>Workflow prompt structure guidance.</li>
                          <li>UI behavior and collaboration support.</li>
                          <li>Automation, backend, and data questions.</li>
                          <li>Theme consistency and frontend help.</li>
                        </ul>
                      </section>
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
