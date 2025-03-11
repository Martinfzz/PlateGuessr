import React, { FC } from "react";

interface BorderEffectProps {
  goodGuess: boolean;
}
const BorderEffect: FC<BorderEffectProps> = ({ goodGuess }) => (
  <div data-testid="border-effect">
    <div
      data-testid="top-bar"
      className={`border-effect-top-bar border-effect-color-${goodGuess}`}
    />
    <div
      data-testid="bottom-bar"
      className={`border-effect-bottom-bar border-effect-color-${goodGuess}`}
    />
    <div
      data-testid="right-bar"
      className={`border-effect-right-bar border-effect-color-${goodGuess}`}
    />
    <div
      data-testid="left-bar"
      className={`border-effect-left-bar border-effect-color-${goodGuess}`}
    />
  </div>
);

export default BorderEffect;
