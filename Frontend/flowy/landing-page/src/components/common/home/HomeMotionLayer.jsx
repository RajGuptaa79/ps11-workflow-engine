export default function HomeMotionLayer({ isVisible }) {
  return (
    <div
      className={`home-motion-layer ${isVisible ? "home-motion-layer--visible" : ""}`}
      aria-hidden="true"
    >
      <span className="home-motion-orb home-motion-orb--one" />
      <span className="home-motion-orb home-motion-orb--two" />
      <span className="home-motion-grid" />
    </div>
  );
}
