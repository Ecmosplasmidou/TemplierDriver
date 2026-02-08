import React, { useEffect } from "react";
import styles from "../styles/Manifeste.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Manifeste = () => {
  useEffect(() => {
    const textBlocks = document.querySelectorAll(`.${styles.textBlock}`);
    
    textBlocks.forEach((block) => {
      gsap.fromTo(block, 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: block,
            start: "top 85%",
          }
        }
      );
    });

    gsap.fromTo(`.${styles.profileWrapper}`,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
          trigger: `.${styles.profileWrapper}`,
          start: "top 80%",
        }
      }
    );
  }, []);

  return (
    <section className={styles.manifesteSection}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.subtitle}>L'Esprit de l'Ordre</span>
          <h2 className={styles.mainTitle}>Manifeste Templier Driver</h2>
        </header>

        <div className={styles.contentGrid}>
          <article className={styles.aboutText}>
            <div className={styles.textBlock}>
              <p className={styles.leadText}>
                Nous sommes les héritiers d'un temps où chaque geste avait du sens, 
                où l'honneur guidait les pas, où le dépassement de soi était une discipline sacrée.
              </p>
              <p>
                Nous ne roulons pas pour la gloire ni pour la reconnaissance : 
                nous roulons pour la vérité brute du pilotage, pour la liberté d'ouvrir la voie, 
                pour l'ivresse pure de la maîtrise.
              </p>
            </div>

            <div className={styles.textBlock}>
              <p className={styles.emphasis}>
                Templier Driver est plus qu'une marque. C'est un Ordre, un esprit, une signature.
              </p>
              <p>
                Un sceau rare. Silencieux. Porté par celles et ceux qui pilotent avec précision, 
                exigence, élégance. Ici, chaque virage est un serment. Chaque ligne droite, 
                une déclaration de liberté.
              </p>
            </div>

            <div className={styles.textBlock}>
              <p>
                Nous refusons le bruit, le banal, le vite oublié. Nous choisissons la rareté, 
                le style, la trace. Le luxe d'aller vite… avec grâce.
              </p>
            </div>
          </article>

          <aside className={styles.profileSide}>
            <div className={styles.profileWrapper}>
              <div className={styles.imageFrame}>
                <img src="/images/photo-profil.png" alt="Yann Barthes" />
              </div>
              <div className={styles.profileInfo}>
                <h3 className={styles.name}>Yann Barthes</h3>
                <p className={styles.role}>Fondateur & Pilote</p>
                <span className={styles.signature}>"Just trust in you"</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Manifeste;