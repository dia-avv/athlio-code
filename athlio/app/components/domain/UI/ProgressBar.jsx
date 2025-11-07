import React from "react";
import styles from "./ProgressBar.module.css";

const ProgressBar = ({ currentStep = 1, totalSteps = 7 }) => {
  // Normalize and clamp values: currentStep is expected 1-based, totalSteps >= 1
  const total = Math.max(1, Number(totalSteps) || 1);
  const step = Math.min(Math.max(Number(currentStep) || 0, 0), total);
  const percent = Math.round((step / total) * 100);

  return (
    <div
      className={styles.progressWrapper}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label={`Onboarding progress ${percent}%`}
    >
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${percent}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
};

export default ProgressBar;
