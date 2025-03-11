import React from "react";
import { Source, Layer, Marker } from "react-map-gl";
import { dataLayer } from "../../utils/data-layer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { GameOptions, Markers } from "shared.types";
const data = require("../../assets/metadata/geojson/germany.geojson");

interface GameState {
  game: {
    gameOptions: GameOptions;
    markers: Markers;
  };
}

const CountryLayer = () => {
  const { gameOptions, markers } = useSelector(
    (state: GameState) => state.game
  );

  console.log(markers);

  return (
    <>
      <Source type="geojson" data={data} data-testid="countries-source">
        <Layer {...dataLayer(gameOptions)} data-testid="countries-layer" />
      </Source>

      {markers.user.length > 0
        ? markers.user.map((m, i) => (
            <Marker {...m} key={i} anchor="bottom" data-testid="user-marker">
              <FontAwesomeIcon
                icon={faLocationDot}
                size="3x"
                style={{
                  color: markers.color,
                  marginBottom: "2px",
                }}
                data-testid="user-marker-icon"
              />
            </Marker>
          ))
        : null}

      {markers.answer.length > 0
        ? markers.answer.map((m, i) => (
            <Marker {...m} key={i} anchor="bottom" data-testid="answer-marker">
              <FontAwesomeIcon
                icon={faLocationDot}
                size="3x"
                style={{
                  color: "#47A025",
                  marginBottom: "2px",
                }}
                data-testid="answer-marker-icon"
              />
            </Marker>
          ))
        : null}
    </>
  );
};

export default CountryLayer;
