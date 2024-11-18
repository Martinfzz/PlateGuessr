import React, { useState, useEffect, useRef } from "react";
import { MDBProgress, MDBProgressBar } from "mdb-react-ui-kit";

const ProgressBar = ({
  addedTime,
  setEndGame,
  showEndGameModal,
  setFinalScore,
}) => {
  const [time, setTime] = useState(120);
  const resetTime = useRef(false);

  useEffect(() => {
    const timeoutId = setInterval(() => setTime(time - 0.01), 10);

    if (time <= 0 && !resetTime.current) {
      clearInterval(timeoutId);
      setEndGame();
      resetTime.current = true;
    }

    setFinalScore(time);
    return () => clearInterval(timeoutId);
  }, [time, setEndGame, setFinalScore]);

  useEffect(() => {
    setTime(Math.min(time + addedTime, 120));
  }, [addedTime]);

  useEffect(() => {
    if (!showEndGameModal && resetTime) {
      setTime(120);
      resetTime.current = false;
    }
  }, [showEndGameModal, resetTime]);

  return (
    <MDBProgress className="round-progress-bar" height="5">
      <MDBProgressBar
        bgColor="success"
        striped
        animated
        width={(time / 120) * 100}
        valuemin={0}
        valuemax={100}
      />
    </MDBProgress>
  );
};

export default ProgressBar;
