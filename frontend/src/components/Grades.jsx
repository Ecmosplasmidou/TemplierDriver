import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./grades.css";
import Header from "./Header";
import Footer from "./Footer";

const cardsData = [
  { id: 'maitre', title: 'Grand Maître', threshold: 5000, image: "images/maitre.jpeg" },
  { id: 'senechal', title: 'Sénéchal', threshold: 2500, image: "images/senechal.jpeg" },
  { id: 'marechal', title: 'Maréchal', threshold: 1000, image: "images/marechal.jpeg" },
  { id: 'commandeur', title: 'Commandeur', threshold: 500, image: "images/commandeur.jpeg" },
  { id: 'drapier', title: 'Drapier', threshold: 100, image: "images/drapier.jpeg" },
  { id: 'chevalier', title: 'Chevalier', threshold: 10, image: "images/chevalier.jpeg" },
];

const Grades = () => {
  const [userSpend, setUserSpend] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);
        try {
          // Appel à ton serveur Bridge Node.js
          const response = await fetch(`http://localhost:5000/api/user-spend/${user.email}`);
          const data = await response.json();
          setUserSpend(data.total_spent || 0);
        } catch (error) {
          console.error("Erreur récupération shopify:", error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/login"); // Redirige si non connecté
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Logique du palier actif
  const activeGrade = [...cardsData]
    .filter(c => userSpend >= c.threshold)
    .sort((a, b) => b.threshold - a.threshold)[0];

  const nextGrade = [...cardsData]
    .sort((a, b) => a.threshold - b.threshold)
    .find(c => c.threshold > userSpend);

  return (
    <div className="page-fade-in">
      <Header />
      <div className="cards-wrapper">
        <div className="status-bar">
          <span>Dépenses : <strong>{userSpend}€</strong></span>
          <span className="separator">|</span>
          {nextGrade ? (
            <span>Prochain palier : <strong>{nextGrade.title}</strong> à <strong>{nextGrade.threshold}€</strong></span>
          ) : (
            <span className="max-reached">Rang de Maître Absolu</span>
          )}
        </div>

        <div className="card-row center">
          <Card data={cardsData[0]} isActive={activeGrade?.id === 'maitre'} />
        </div>
        <div className="card-row">
          <Card data={cardsData[1]} isActive={activeGrade?.id === 'senechal'} />
          <Card data={cardsData[2]} isActive={activeGrade?.id === 'marechal'} />
        </div>
        <div className="card-row">
          <Card data={cardsData[3]} isActive={activeGrade?.id === 'commandeur'} />
          <Card data={cardsData[4]} isActive={activeGrade?.id === 'drapier'} />
        </div>
        <div className="card-row center">
          <Card data={cardsData[5]} isActive={activeGrade?.id === 'chevalier'} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

const Card = ({ data, isActive }) => (
  <div className={`card-container ${isActive ? "active-grade" : ""}`}>
    <div className="card">
      <div className="card-front">
        {isActive && <div className="active-badge">ACTIF</div>}
        <div className="card-id"></div>
        <img src="images/templierdesc.jpg" alt="Sceau" />
      </div>
      <div className="card-back">
        <img src={data.image} alt={data.title} />
        <div className="grade-label">{data.title}</div>
      </div>
    </div>
  </div>
);

export default Grades;