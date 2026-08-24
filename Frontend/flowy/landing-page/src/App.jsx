import "./App.css";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage.jsx";
import DiagramBlankPage from "./pages/DiagramPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import CollaboratorsPage from "./pages/CollaboratorsPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import PricingPage from "./pages/PricingPage.jsx";
import PageTransition from "./components/common/PageTransition.jsx";
import LogoutPage from "./pages/logOutPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import LibraryPage from "./pages/LibraryPage.jsx";
import { LibraryProvider } from "./context/LibraryContext.jsx";
import HelpPage from "./pages/HelpPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { DashboardProvider } from "./context/DashboardContext.jsx";

function AnimatedRoutes() {
  const location = useLocation();
  const transitionMode = location.state?.transition ?? "default";

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition mode="default">
              <HomePage />
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition mode="default">
              <AboutPage />
            </PageTransition>
          }
        />
        <Route
          path="/pricing"
          element={
            <PageTransition mode="default">
              <PricingPage />
            </PageTransition>
          }
        />
        <Route
          path="/signin"
          element={
            <PageTransition mode="default">
              <AuthPage initialMode="signin" />
            </PageTransition>
          }
        />
        <Route
          path="/signup"
          element={
            <PageTransition mode="default">
              <AuthPage initialMode="signup" />
            </PageTransition>
          }
        />
        <Route
          path="/auth"
          element={
            <PageTransition mode="default">
              <AuthPage />
            </PageTransition>
          }
        />
        <Route
          path="/diagram"
          element={
            <PageTransition mode={transitionMode}>
              <DiagramBlankPage />
            </PageTransition>
          }
        />
        <Route
          path="/inventory"
          element={
            <PageTransition mode="default">
              <InventoryPage />
            </PageTransition>
          }
        />
        <Route
          path="/collaborators"
          element={
            <PageTransition mode="default">
              <CollaboratorsPage />
            </PageTransition>
          }
        />
        <Route
          path="/logout"
          element={
            <PageTransition mode="default">
              <LogoutPage />
            </PageTransition>
          }
        />
        <Route
          path="/settings"
          element={
            <PageTransition mode="default">
              <SettingsPage />
            </PageTransition>
          }
        />
        <Route
          path="/library"
          element={
            <PageTransition mode="default">
              <LibraryPage />
            </PageTransition>
          }
        />
        <Route
          path="/help"
          element={
            <PageTransition mode="default">
              <HelpPage />
            </PageTransition>
          }
        />

        <Route
          path="/home"
          element={
            <PageTransition mode="default">
              <HomePage />
            </PageTransition>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LibraryProvider>
        <UserProvider>
          <DashboardProvider>
            <BrowserRouter>
              <AnimatedRoutes />
            </BrowserRouter>
          </DashboardProvider>
        </UserProvider>
      </LibraryProvider>
    </ThemeProvider>
  );
}

export default App;
