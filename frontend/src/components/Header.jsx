import React, { useState, useEffect } from "react";
import styles from "../styles/Header.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Erreur déconnexion:", error);
    }
  };

  const getLinkClass = ({ isActive }) => 
    isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink;

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <NavLink to="/" className={styles.logo}>
          <img src="/images/logo.png" alt="Templier Driver Logo" />
        </NavLink>

        <button 
          className={`${styles.burger} ${menuOpen ? styles.burgerActive : ""}`} 
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.active : ""}`}>
          <NavLink to="/grades" className={getLinkClass} onClick={() => setMenuOpen(false)}>
            Grades
          </NavLink>
          
          <a 
            href="https://shop.templierdriver.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.navLink}
            onClick={() => setMenuOpen(false)}
          >
            Shop
          </a>

          <NavLink to="/contact" className={getLinkClass} onClick={() => setMenuOpen(false)}>
            Contact
          </NavLink>

          {user ? (
            <button 
              className={`${styles.logoutButton}`} 
              onClick={handleLogout}
            >
              Déconnexion
            </button>
          ) : (
            <NavLink 
              to="/login" 
              className={({ isActive }) => isActive ? `${styles.loginButton} ${styles.activeLogin}` : styles.loginButton}
              onClick={() => setMenuOpen(false)}
            >
              Connexion
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;