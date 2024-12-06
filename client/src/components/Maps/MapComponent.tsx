import React, { FC, ReactNode, useCallback, useContext } from "react";
import { useState } from "react";
import InteractiveMap, {
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  ViewStateChangeEvent,
  MapRef,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useSelector, useDispatch } from "react-redux";
import { setViewport } from "../../features/map/mapSlice";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import { ThemeContext } from "../../Theme";
import { MapState } from "shared.types";

interface MapComponentProps {
  mapRef: React.MutableRefObject<MapRef>;
  onHover: (e: { lngLat: { lng: number; lat: number } }) => Promise<void>;
  handleClick: (e: any, mapRef: React.MutableRefObject<MapRef>) => void;
  layerId: string;
  children: ReactNode;
}

interface MapViewportState {
  mapViewport: MapState;
}

const MapComponent: FC<MapComponentProps> = ({
  mapRef,
  onHover,
  handleClick,
  layerId = "",
  children,
}) => {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const lng = localStorage.getItem("i18nextLng");
  const { theme } = useContext(ThemeContext);

  const mapRefCallback = useCallback(
    (ref: MapRef | null) => {
      if (ref !== null) {
        mapRef.current = ref;
        const map = ref;

        const language = new MapboxLanguage();
        map.addControl(language).setLanguage(lng ?? "en");
      }
    },
    [mapRef, lng]
  );

  const dispatch = useDispatch();
  const { longitude, latitude, zoom } = useSelector(
    (state: MapViewportState) => state.mapViewport
  );

  const handleViewportChange = (e: ViewStateChangeEvent) => {
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
      mapStyle={
        theme === "dark-theme"
          ? "mapbox://styles/mapbox/dark-v11"
          : "mapbox://styles/mapbox/light-v11"
      }
      onMove={(e) => handleViewportChange(e)}
      onMouseMove={(e) => onHover(e)}
      onMouseEnter={() => setCursor("pointer")}
      onMouseLeave={() => setCursor(undefined)}
      interactiveLayerIds={[layerId]}
      onClick={(e) => handleClick(e, mapRef)}
      ref={mapRefCallback}
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
