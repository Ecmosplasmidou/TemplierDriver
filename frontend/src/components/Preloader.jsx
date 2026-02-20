import React, { useEffect, useRef } from "react";
import styles from "../styles/Preloader.module.css";
import { gsap } from "gsap";

const Preloader = ({ setLoading }) => {
  const percentRef = useRef(null);
  const preloaderRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const visited = sessionStorage.getItem("visited");

    if (!visited) {
      let percent = 0;
      
      gsap.fromTo(contentRef.current, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 1 }
      );

      const interval = setInterval(() => {
        percent++;
        if (percentRef.current) {
          percentRef.current.textContent = percent + "%";
        }

        if (percent >= 100) {
          clearInterval(interval);
          sessionStorage.setItem("visited", "true");

          const tl = gsap.timeline({
            onComplete: () => setLoading(false)
          });

          tl.to(contentRef.current, { 
            opacity: 0, 
            y: -20, 
            duration: 0.5 
          })
          .to(preloaderRef.current, { 
            opacity: 0, 
            duration: 0.8, 
            ease: "power2.inOut" 
          });
        }
      }, 30);

      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [setLoading]);

  return (
    <div id="preloader" ref={preloaderRef} className={styles.preloader}>
      <div ref={contentRef} className={styles.loaderContent}>
        <img
          src="/images/logoGIF.gif"
          alt="Templier Driver"
          className={styles.loaderGif}
        />
        <div className={styles.percentContainer}>
          <span ref={percentRef} className={styles.percentText}>0%</span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;