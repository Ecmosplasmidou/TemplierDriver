import React from "react";
import styles from "../styles/PushSlide.module.css";

const PushSlide = () => {
  const items = [...Array(10)]

  return (
    <div className={styles.pushSlide}>
      <div className={styles.slideTrack}>
        {[...items, ...items].map((_, i) => (
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
