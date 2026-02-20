import React from "react";
import { Link } from "react-router-dom"

import styles from "../styles/Hero.module.css";
import Header from "./Header";
import PushSlide from "./PushSlide";
import Footer from "./Footer";
import Manifeste from "./Manifest";

const Hero = () => {
  return (
    <>
      <Header />
      <section className={styles.hero}>
        <video autoPlay muted loop playsInline className={styles.heroVideo}>
          <source src="/videos/video_site_TemplierDriver.mp4" type="video/mp4" />
        </video>
        <div className={styles.heroOverlay}>
          <div className={styles.heroTextContainer}>
              <span className={styles.heroSubtitle}>L'excellence à votre portée</span>
              <h1 className={styles.heroMainTitle}>Collection Officielle</h1>
              <p className={styles.heroDescription}>
                Portez l'héritage de l'Ordre. Découvrez des accessoires exclusifs 
                conçus pour ceux qui exigent la perfection.
              </p>
              <Link to="https://shop.templierdriver.com" target="_blank" className={styles.heroBtn}>
                Achetez maintenant
              </Link>
          </div>
        </div>
      </section>
      <section className={styles.pushSection}>
        <PushSlide /> 
      </section>
      <Manifeste />
      <Footer />
    </>
  );
};

export default Hero;