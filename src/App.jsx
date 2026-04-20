import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar   from "./Navbar";
import Home     from "./Home";
import About    from "./About";
import Skills   from "./Skills";
import Projects from "./Projects";
import Contact  from "./Contact";

export default function App() {
  return (
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
  );
}