import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar   from "./Navbar";
import Home     from "./Home";
import About    from "./About";
import Skills   from "./Skills";
import Projects from "./Projects";
import Contact  from "./Contact";
import Intro    from "./Intro";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {/* Splash intro */}
      {showIntro && <Intro onDone={() => setShowIntro(false)} />}

      {/* Main app */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/"         element={<Home />}     />
          <Route path="/about"    element={<About />}    />
          <Route path="/skills"   element={<Skills />}   />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact"  element={<Contact />}  />
        </Routes>
      </Router>
    </>
  );
}