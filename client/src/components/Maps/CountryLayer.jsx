import React from "react";
import { Source, Layer, Marker } from "react-map-gl";
import data from "../../assets/metadata/geojson/germany.geojson";
import { dataLayer } from "../../utils/data-layer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const CountryLayer = ({
  gameOptions,
  userMarker,
  userMarkerColor,
  answerMarker,
}) => {
  return (
    <>
      <Source type="geojson" data={data}>
        <Layer {...dataLayer(gameOptions)} />
      </Source>

      {userMarker.length
        ? userMarker.map((m, i) => (
            <Marker {...m} key={i} anchor="bottom">
              <FontAwesomeIcon
                icon={faLocationDot}
                size="3x"
                style={{
                  color: userMarkerColor,
                  marginBottom: "2px",
                }}
              />
            </Marker>
          ))
        : null}

      {answerMarker.length
        ? answerMarker.map((m, i) => (
            <Marker {...m} key={i} anchor="bottom">
              <FontAwesomeIcon
                icon={faLocationDot}
                size="3x"
                style={{
                  color: "#47A025",
                  marginBottom: "2px",
                }}
              />
            </Marker>
          ))
        : null}
    </>
  );
};

export default CountryLayer;
