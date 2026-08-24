import { NavLink } from "react-router-dom";

export default function SideNavbar() {
  const navItemClass = ({ isActive }) =>
    `side-navbar__item${isActive ? " side-navbar__item--active" : ""}`;

  return (
    <aside className="side-navbar">
      <div className="side-navbar__top">
        <div className="side-navbar__product">
          <div className="side-navbar__avatar" />
          <div>
            <div className="side-navbar__product-title">Flowy Pro</div>
            <div className="side-navbar__product-subtitle">
              Automation Engine
            </div>
          </div>
        </div>

        <nav className="side-navbar__nav">
          <NavLink to="/home" end className={navItemClass}>
            <span className="side-navbar__icon">⊞</span>
            <span>Dashboard</span>
          </NavLink>

          <button className="side-navbar__item" type="button">
            <span className="side-navbar__icon">⌘</span>
            <span>Workflows</span>
          </button>

          <NavLink to="/diagram" className={navItemClass}>
            <span className="side-navbar__icon">⌘</span>
            <span>Diagrams</span>
          </NavLink>

          <NavLink to="/landing" className={navItemClass}>
            <span className="side-navbar__icon">⌘</span>
            <span>Landing</span>
          </NavLink>

          <NavLink to="/inventory" className={navItemClass}>
            <span className="side-navbar__icon">⌘</span>
            <span>Inventory</span>
          </NavLink>

          <NavLink to="/collaborators" className={navItemClass}>
            <span className="side-navbar__icon">⌘</span>
            <span>Collaborators</span>
          </NavLink>

          <button className="side-navbar__item" type="button">
            <NavLink to="/library" className={navItemClass}>
              <span className="side-navbar__icon">▱</span>
              <span>Library</span>
            </NavLink>
          </button>

          <NavLink to="/settings" className={navItemClass}>
            <span className="side-navbar__icon">⚙</span>
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>

      <div className="side-navbar__bottom">
        <button className="side-navbar__item" type="button">
          <NavLink to="/help" className={navItemClass}>
            <span className="side-navbar__icon">?</span>
            <span>Help</span>
          </NavLink>
        </button>

        <button className="side-navbar__item" type="button">
          <span className="side-navbar__icon">↪</span>
          <NavLink to="/logout" className="p-8">
            <span>Logout</span>
          </NavLink>
        </button>
      </div>
    </aside>
  );
}
