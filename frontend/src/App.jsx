import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Preloader from "../src/components/Preloader";
import Header from "../src/components/Header";
import Hero from "./components/Hero";
import Manifeste from "../src/components/Manifest";
import Contact from "../src/components/contact";
import Grades from "../src/components/Grades";
import Login from "../src/components/auth/login";
import Footer from "../src/components/Footer";

import "./styles/global.css";

gsap.registerPlugin(ScrollTrigger);

// Composant pour le suivi HubSpot
function HubspotTracker() {
  const location = useLocation();
  useEffect(() => {
    if (window._hsq) {
      window._hsq.push(["trackPageView"]);
    }
  }, [location.pathname]);
  return null;
}

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="App">
      {loading ? (
        <Preloader setLoading={setLoading} />
      ) : (
        <Router>
          <HubspotTracker />
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/login" element={<Login />} />
            <Route path="/manifest" element={<Manifeste />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/grades" element={<Grades />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;