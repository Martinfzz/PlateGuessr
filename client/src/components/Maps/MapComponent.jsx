import React from "react";
import { useState } from "react";
import InteractiveMap, {
  NavigationControl,
  FullscreenControl,
  ScaleControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useSelector, useDispatch } from "react-redux";
import { setViewport } from "../../features/map/mapSlice";

const MapComponent = ({
  mapRef,
  onHover = () => {},
  handleClick,
  layerIds = [],
  children,
}) => {
  const [cursor, setCursor] = useState(null);

  const dispatch = useDispatch();
  const { longitude, latitude, zoom } = useSelector(
    (state) => state.mapViewport
  );

  const handleViewportChange = (e) => {
    dispatch(setViewport(e.viewState));
  };

  return (
    <InteractiveMap
      mapboxAccessToken="pk.eyJ1IjoibWFydGluZnp6IiwiYSI6ImNtMnl0eWltdDA0NnUyd3FzNWN5aDQ5OTkifQ.ZtRxBpmpMa9pxB02NZeFgQ"
      initialViewState={{
        longitude: longitude || 2,
        latitude: latitude || 46,
        zoom: zoom || 5,
      }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      onMove={(e) => handleViewportChange(e)}
      onMouseMove={(e) => onHover(e, mapRef)}
      onMouseEnter={() => setCursor("pointer")}
      onMouseLeave={() => setCursor(null)}
      interactiveLayerIds={layerIds}
      onClick={(e) => handleClick(e, mapRef)}
      ref={mapRef}
      cursor={cursor}
    >
      <FullscreenControl position="bottom-right" />
      <NavigationControl position="bottom-right" />
      <ScaleControl />

      {children}
    </InteractiveMap>
  );
};

export default MapComponent;
