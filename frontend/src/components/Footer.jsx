import React from "react";
import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <a
        href="https://www.instagram.com/templierdriver"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
      >
        <i className="fab fa-instagram"></i>
      </a>
      <a
        href="https://www.facebook.com/templierdriver"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
      >
        <i className="fab fa-facebook-f"></i>
      </a>
      <a
        href="https://www.tiktok.com/@templierdriver"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TikTok"
      >
        <i className="fab fa-tiktok"></i>
      </a>
    </footer>
  );
};

export default Footer;
