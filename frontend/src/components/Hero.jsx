import React from "react";
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
        <PushSlide /> 
      </section>
      <Manifeste />
      <section className={styles.formSection}>
      </section>
      <Footer />
    </>
  );
};

export default Hero;