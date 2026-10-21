import { useState, useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Intro from "./components/Intro";

// Lazy-load page components
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Skills = lazy(() => import("./pages/Skills"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const [showIntro, setShowIntro] = useState(true);

  // Add/remove admin-page body class
  useEffect(() => {
    if (isAdminRoute) {
      document.body.classList.add("admin-page");
    } else {
      document.body.classList.remove("admin-page");
    }

    return () => {
      document.body.classList.remove("admin-page");
    };
  }, [isAdminRoute]);

  return (
    <>
      {!isAdminRoute && showIntro && (
        <Intro onDone={() => setShowIntro(false)} />
      )}

      {!isAdminRoute && <Navbar />}

      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            Loading...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}