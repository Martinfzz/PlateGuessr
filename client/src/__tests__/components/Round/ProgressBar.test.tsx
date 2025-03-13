import React from "react";
import { render, act, screen, waitFor } from "@testing-library/react";
import ProgressBar from "../../../components/Round/ProgressBar";

jest.useFakeTimers();

describe("ProgressBar Component", () => {
  const setEndGame = jest.fn();
  const setFinalScore = jest.fn();

  test("renders ProgressBar component", () => {
    render(
      <ProgressBar
        addedTime={0}
        setEndGame={setEndGame}
        showEndGameModal={false}
        setFinalScore={setFinalScore}
      />
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("decreases time and calls setEndGame when time reaches 0", async () => {
    render(
      <ProgressBar
        addedTime={0}
        setEndGame={setEndGame}
        showEndGameModal={false}
        setFinalScore={setFinalScore}
      />
    );

    act(() => {
      jest.advanceTimersByTime(120000); // Advance time to 1200 seconds
    });

    await waitFor(() => {
      expect(setEndGame).toHaveBeenCalled();
    });
  });

  test("resets time when showEndGameModal is true", () => {
    const { rerender } = render(
      <ProgressBar
        addedTime={0}
        setEndGame={setEndGame}
        showEndGameModal={false}
        setFinalScore={setFinalScore}
      />
    );

    act(() => {
      jest.advanceTimersByTime(60000); // Advance time to 60 seconds
    });

    rerender(
      <ProgressBar
        addedTime={0}
        setEndGame={setEndGame}
        showEndGameModal={true}
        setFinalScore={setFinalScore}
      />
    );

    act(() => {
      jest.advanceTimersByTime(10000); // Advance time to 10 seconds
    });

    expect(setEndGame).not.toHaveBeenCalled();
  });

  test("increases time when addedTime is greater than 0", async () => {
    render(
      <ProgressBar
        addedTime={0}
        setEndGame={setEndGame}
        showEndGameModal={false}
        setFinalScore={setFinalScore}
      />
    );

    act(() => {
      jest.advanceTimersByTime(60000); // Advance time to 60 seconds
    });

    await waitFor(() => {
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "style",
        "width: 50%;"
      );
    });
  });
});
