import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/Header.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { User } from 'lucide-react';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setProfileOpen(false);
      setMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Erreur déconnexion:", error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        
        {/* BURGER (Apparaît à gauche sur mobile via CSS order) */}
        <button 
          className={`${styles.burger} ${menuOpen ? styles.burgerActive : ""}`} 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* LOGO (Centré sur mobile via CSS) */}
        <NavLink to="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          <img src="/images/logo.png" alt="Templier Driver Logo" />
        </NavLink>

        {/* NAVIGATION (Centrale sur desktop) */}
        <nav className={`${styles.nav} ${menuOpen ? styles.active : ""}`}>
          <NavLink to="/" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink} onClick={() => setMenuOpen(false)}>Accueil</NavLink>
          <NavLink to="/grades" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink} onClick={() => setMenuOpen(false)}>Grades</NavLink>
          <a href="https://shop.templierdriver.com" className={styles.navLink} onClick={() => setMenuOpen(false)}>Shop</a>
          <NavLink to="/contact" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink} onClick={() => setMenuOpen(false)}>Contact</NavLink>
        </nav>

        {/* PROFIL (À droite sur mobile via CSS order) */}
        <div className={styles.profileWrapper} ref={profileRef}>
          <button 
            className={styles.iconButton} 
            onClick={() => setProfileOpen(!profileOpen)}
            aria-label="Profil"
          >
            <User color="#ffffff" size={24} />
          </button>

          {profileOpen && (
            <div className={styles.dropdownMenu}>
              {user ? (
                <button onClick={handleLogout} className={styles.actionBtn}>
                  Déconnexion
                </button>
              ) : (
                <button 
                  onClick={() => { navigate("/login"); setProfileOpen(false); }} 
                  className={styles.actionBtn}
                >
                  Se connecter
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;