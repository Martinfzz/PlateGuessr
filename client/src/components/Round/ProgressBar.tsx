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
  const [time, setTime] = useState(120);
  const resetTime = useRef(false);

  useEffect(() => {
    const timeoutId = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 0 && !resetTime.current) {
          clearInterval(timeoutId);
          setEndGame();
          resetTime.current = true;
          return 0;
        }
        setFinalScore(prevTime - 0.01);
        return prevTime - 0.01;
      });
    }, 10);

    return () => clearInterval(timeoutId);
  }, [time, setEndGame, setFinalScore]);

  useEffect(() => {
    setTime(Math.min(time + addedTime, 120));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addedTime]);

  useEffect(() => {
    if (!showEndGameModal && resetTime) {
      setTime(120);
      resetTime.current = false;
    }
  }, [showEndGameModal, resetTime]);

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
        width={Math.ceil((time / 120) * 100)}
        valuemin={0}
        valuemax={100}
      />
    </MDBProgress>
  );
};

export default ProgressBar;
