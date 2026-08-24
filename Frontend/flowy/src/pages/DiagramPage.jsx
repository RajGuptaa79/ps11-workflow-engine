import TopNavbar from "../components/common/home/TopNavbar.jsx";
import SideNavbar from "../components/common/home/SideNavbar.jsx";
import PolkaField from "../components/common/home/PolkaField.jsx";
import "./diagramPage.css";

export default function DiagramBlankPage() {
  return (
    <div className="diagram-blank-main">
      <TopNavbar />

      <div className="diagram-blank-shell">
        <SideNavbar />

        <main className="diagram-blank-workspace">
          <PolkaField />
          <div className="diagram-blank-stage" />
        </main>
      </div>
    </div>
  );
}
