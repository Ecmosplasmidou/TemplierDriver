import React, { useState, useEffect } from "react";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        try {
          const backendUrl = "https://templierdriver-server.onrender.com"; 
          const response = await fetch(`${backendUrl}/api/user-spend/${user.email}`);
          if (!response.ok) throw new Error("Erreur serveur");
          const data = await response.json();
          setUserSpend(data.total_spent || 0);
        } catch (error) {
          console.error("Erreur récupération shopify:", error);
        }
      } else {
        setIsLoggedIn(false);
        setUserSpend(0);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const activeGrade = [...cardsData]
    .filter(c => userSpend >= c.threshold)
    .sort((a, b) => b.threshold - a.threshold)[0];

  const nextGrade = [...cardsData]
    .sort((a, b) => a.threshold - b.threshold)
    .find(c => c.threshold > userSpend);

  // Calcul du pourcentage pour la barre de progression
  const calculateProgress = () => {
    if (!nextGrade) return 100;
    const currentLevelThreshold = activeGrade ? activeGrade.threshold : 0;
    const progress = ((userSpend - currentLevelThreshold) / (nextGrade.threshold - currentLevelThreshold)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  return (
    <div className="page-fade-in">
      <Header />
      <div className="cards-wrapper">
        
        {/* Barre de Progression Visuelle */}
        <div className="progression-container">
          <div className="status-info">
            <span>Dépenses : <strong>{userSpend}€</strong></span>
            {isLoggedIn ? (
              nextGrade ? (
                <span>Objectif : <strong>{nextGrade.title}</strong> ({nextGrade.threshold}€)</span>
              ) : (
                <span className="max-reached">Rang de Maître Absolu Atteint</span>
              )
            ) : (
              <span>Connectez-vous pour voir votre grade</span>
            )}
          </div>
          
          <div className="progress-track">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${calculateProgress()}%` }}
            >
              <div className="progress-glow"></div>
            </div>
          </div>
          
          <div className="threshold-markers">
            {cardsData.slice(0).reverse().map(grade => (
              <div key={grade.id} className={`marker ${userSpend >= grade.threshold ? "met" : ""}`}>
                <span className="marker-label">{grade.threshold}€</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grille des Grades */}
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