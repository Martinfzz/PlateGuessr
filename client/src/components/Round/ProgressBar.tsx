import React, { useState, useEffect, useRef, FC } from "react";
import { MDBProgress, MDBProgressBar } from "mdb-react-ui-kit";

interface ProgressBarProps {
  addedTime: number;
  setEndGame: () => void;
  showEndGameModal: boolean;
  setFinalScore: (arg0: number) => void;
}

const ProgressBar: FC<ProgressBarProps> = ({
  addedTime,
  setEndGame,
  showEndGameModal,
  setFinalScore,
}) => {
  const duration = 120;
  const [time, setTime] = useState(duration);
  const resetTime = useRef(false);
  const timeoutId = useRef<number>();

  useEffect(() => {
    const startTime = performance.now();
    let lastTimestamp = startTime;

    const updateTimer = (timestamp: number) => {
      const deltaTime = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      setTime((prevTime) => {
        if (prevTime <= 0 && !resetTime.current) {
          setEndGame();
          setTime(duration);
          resetTime.current = true;
          return 0;
        }
        const newTime = prevTime - deltaTime;
        setFinalScore(newTime);
        return Math.max(newTime, 0);
      });

      if (!resetTime.current) {
        timeoutId.current = requestAnimationFrame(updateTimer);
      }
    };

    timeoutId.current = requestAnimationFrame(updateTimer);

    return () => cancelAnimationFrame(timeoutId.current as number);
  }, [setEndGame, setFinalScore]);

  useEffect(() => {
    setTime(Math.min(time + addedTime, duration));
  }, [addedTime]);

  useEffect(() => {
    if (!showEndGameModal && resetTime) {
      setTime(duration);
      resetTime.current = false;
    }
  }, [showEndGameModal, resetTime, duration]);

  return (
    <MDBProgress
      data-testid="progress-bar"
      className="round-progress-bar"
      height="5"
    >
      <MDBProgressBar
        bgColor="success"
        striped
        animated
        width={Math.ceil((time / duration) * 100)}
        valuemin={0}
        valuemax={100}
      />
    </MDBProgress>
  );
};

export default ProgressBar;
