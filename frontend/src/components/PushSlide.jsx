import React from "react";
import styles from "../styles/PushSlide.module.css";

const PushSlide = () => {
  return (
    <div className={styles.pushSlide}>
      <div className={styles.slideTrack}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={styles.slideItem}>
            <span>PUSH,PUSH,PUSH</span>
            <img
              src="images/racing-flag.jpg"
              alt="Racing flag"
              className={styles.flagIcon}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PushSlide;
