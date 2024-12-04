const BorderEffect = ({ goodGuess }) => (
  <>
    <div className={`border-effect-top-bar border-effect-color-${goodGuess}`} />
    <div
      className={`border-effect-bottom-bar border-effect-color-${goodGuess}`}
    />
    <div
      className={`border-effect-right-bar border-effect-color-${goodGuess}`}
    />
    <div
      className={`border-effect-left-bar border-effect-color-${goodGuess}`}
    />
  </>
);

export default BorderEffect;
