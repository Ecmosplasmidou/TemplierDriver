import React, { useEffect, useRef } from "react";
import styles from "../styles/Preloader.module.css";
import { gsap } from "gsap";

const Preloader = ({ setLoading }) => {
  const preloaderRef = useRef(null);
  const contentRef = useRef(null);
  const fillRef = useRef(null);
  const percentRef = useRef(null);

  useEffect(() => {
    const visited = sessionStorage.getItem("visited");

    if (!visited) {
      const tl = gsap.timeline();
      
      // Animation d'entrée
      tl.fromTo(contentRef.current, 
        { opacity: 0, scale: 0.8 }, 
        { opacity: 1, scale: 1, duration: 1, ease: "expo.out" }
      );

      // Simulation de chargement nerveuse (vitesse variable comme une accélération)
      let progress = { value: 0 };
      gsap.to(progress, {
        value: 100,
        duration: 3, // Temps total du chargement
        ease: "power2.inOut",
        onUpdate: () => {
          const val = Math.floor(progress.value);
          if (percentRef.current) percentRef.current.textContent = val + "%";
          if (fillRef.current) fillRef.current.style.width = val + "%";
        },
        onComplete: () => {
          sessionStorage.setItem("visited", "true");
          
          // Animation de sortie "Flash" (type départ de course)
          const exitTl = gsap.timeline({ onComplete: () => setLoading(false) });
          exitTl.to(contentRef.current, { 
            scale: 1.5, 
            opacity: 0, 
            duration: 0.4, 
            ease: "expo.in" 
          })
          .to(preloaderRef.current, { 
            x: "100%", // Le preloader dégage sur le côté comme une voiture qui passe
            duration: 0.6, 
            ease: "power4.in" 
          });
        }
      });
    } else {
      setLoading(false);
    }
  }, [setLoading]);

  return (
    <div ref={preloaderRef} className={styles.preloader}>
      <div className={styles.overlay}></div>
      <div ref={contentRef} className={styles.loaderContent}>
        <div className={styles.logoWrapper}>
          <img
            src="/images/logoGIF.gif"
            alt="Templier Driver"
            className={styles.loaderGif}
          />
        </div>
        
        <div className={styles.raceContainer}>
          <div className={styles.labelWrapper}>
            <span className={styles.raceLabel}>PRÉPARATION DU MOTEUR</span>
            <span ref={percentRef} className={styles.percentText}>0%</span>
          </div>
          
          <div className={styles.progressBar}>
            <div ref={fillRef} className={styles.progressFill}>
              <div className={styles.glow}></div>
            </div>
          </div>
          
          <div className={styles.speedLine}></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;