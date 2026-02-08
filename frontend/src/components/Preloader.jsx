import React, { useEffect } from "react";
import styles from "../styles/Preloader.module.css";
import { gsap } from "gsap";

const Preloader = ({ setLoading }) => {
  useEffect(() => {
    const visited = sessionStorage.getItem("visited");

    if (!visited) {
      let percent = 0;
      const interval = setInterval(() => {
        percent++;
        document.getElementById("loader-percent").textContent = percent + "%";

        if (percent >= 100) {
          clearInterval(interval);
          sessionStorage.setItem("visited", "true");

          gsap.to("#preloader", {
            opacity: 0,
            duration: 0.8,
            onComplete: () => setLoading(false),
          });
        }
      }, 20);
    } else {
      setLoading(false);
    }
  }, [setLoading]);

  return (
    <div id="preloader" className={styles.preloader}>
      <div className={styles.loaderContent}>
        <img
          src="/assets/images/logoGIF.gif"
          alt="Chargement..."
          className={styles.loaderGif}
        />
        <span id="loader-percent">0%</span>
      </div>
    </div>
  );
};

export default Preloader;
